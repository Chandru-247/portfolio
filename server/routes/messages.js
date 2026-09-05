const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const RECIPIENT_EMAIL = 'itismechandru247@gmail.com';

// POST /api/messages (Public Contact Form submission)
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message transmission content are required.'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid transmission frequency (email address).'
    });
  }

  const db = getDatabase();
  const newMessage = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject ? subject.trim() : 'Planetary Contact Transmission',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
    starred: false,
    forwardedTo: RECIPIENT_EMAIL
  };

  db.messages.unshift(newMessage); // Most recent first
  saveDatabase(db);

  // Attempt background email notification via FormSubmit
  try {
    const https = require('https');
    const postData = JSON.stringify({
      name: newMessage.name,
      email: newMessage.email,
      _subject: `[Portfolio Dispatch] ${newMessage.subject}`,
      message: `From: ${newMessage.name} <${newMessage.email}>\nSubject: ${newMessage.subject}\n\nMessage:\n${newMessage.message}`,
      _replyto: newMessage.email
    });

    const fsReq = https.request(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/'
      }
    }, (fsRes) => {
      let b = '';
      fsRes.on('data', c => b += c);
      fsRes.on('end', () => console.log('FormSubmit dispatch status:', fsRes.statusCode));
    });
    fsReq.on('error', (e) => console.warn('FormSubmit dispatch warning:', e.message));
    fsReq.write(postData);
    fsReq.end();
  } catch (fsErr) {
    console.warn('FormSubmit trigger error:', fsErr.message);
  }

  // Attempt background email notification if transporter credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: `[Portfolio Dispatch] ${newMessage.subject}`,
        text: `New transmission received from your portfolio:\n\nSender: ${name}\nEmail: ${email}\nSubject: ${newMessage.subject}\n\nMessage:\n${message}\n\nTimestamp: ${newMessage.createdAt}`
      });
    } catch (mailErr) {
      console.warn('Background email dispatch notice:', mailErr.message);
    }
  }

  res.status(201).json({
    success: true,
    message: `Cosmic transmission received! Message forwarded to ${RECIPIENT_EMAIL}.`,
    data: {
      id: newMessage.id,
      timestamp: newMessage.createdAt,
      recipientEmail: RECIPIENT_EMAIL
    }
  });
});

// GET /api/messages (Admin Inbox)
router.get('/', requireAuth, (req, res) => {
  const db = getDatabase();
  const unreadCount = db.messages.filter(m => !m.read).length;

  res.json({
    success: true,
    total: db.messages.length,
    unreadCount,
    data: db.messages
  });
});

// PATCH /api/messages/:id/read
router.patch('/:id/read', requireAuth, (req, res) => {
  const db = getDatabase();
  const msg = db.messages.find(m => m.id === req.params.id);

  if (!msg) {
    return res.status(404).json({
      success: false,
      message: 'Transmission not found.'
    });
  }

  msg.read = req.body.read !== undefined ? Boolean(req.body.read) : !msg.read;
  saveDatabase(db);

  res.json({
    success: true,
    message: `Message marked as ${msg.read ? 'read' : 'unread'}.`,
    data: msg
  });
});

// PATCH /api/messages/:id/star
router.patch('/:id/star', requireAuth, (req, res) => {
  const db = getDatabase();
  const msg = db.messages.find(m => m.id === req.params.id);

  if (!msg) {
    return res.status(404).json({
      success: false,
      message: 'Transmission not found.'
    });
  }

  msg.starred = req.body.starred !== undefined ? Boolean(req.body.starred) : !msg.starred;
  saveDatabase(db);

  res.json({
    success: true,
    message: `Message ${msg.starred ? 'starred' : 'unstarred'}.`,
    data: msg
  });
});

// DELETE /api/messages/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const initialLength = db.messages.length;
  db.messages = db.messages.filter(m => m.id !== req.params.id);

  if (db.messages.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Transmission record not found.'
    });
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Transmission log purged.'
  });
});

module.exports = router;
