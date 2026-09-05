const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase, saveDatabase, defaultData } = require('../config/db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Cosmic Security Alert: Username and password are required.'
    });
  }

  const db = getDatabase();
  const admin = db.adminUser;

  if (!admin || admin.username !== username.trim()) {
    return res.status(401).json({
      success: false,
      message: 'Cosmic Security Alert: Invalid commander username.'
    });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Cosmic Security Alert: Invalid security password.'
    });
  }

  const token = jwt.sign(
    {
      username: admin.username,
      role: admin.role,
      name: admin.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Cosmic Access Granted: Welcome back, Commander.',
    token,
    user: {
      username: admin.username,
      role: admin.role,
      name: admin.name,
      email: admin.email
    }
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const db = getDatabase();
  const admin = db.adminUser;

  res.json({
    success: true,
    user: {
      username: admin.username,
      role: admin.role,
      name: admin.name,
      email: admin.email
    }
  });
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Both current password and new password are required.'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters in length.'
    });
  }

  const db = getDatabase();
  const isMatch = bcrypt.compareSync(currentPassword, db.adminUser.passwordHash);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password verification failed.'
    });
  }

  db.adminUser.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDatabase(db);

  return res.json({
    success: true,
    message: 'Security credentials updated successfully.'
  });
});

// POST /api/auth/reset-demo
router.post('/reset-demo', requireAuth, (req, res) => {
  saveDatabase(JSON.parse(JSON.stringify(defaultData)));
  res.json({
    success: true,
    message: 'Portfolio data reset to factory cosmic seed state.'
  });
});

module.exports = router;
