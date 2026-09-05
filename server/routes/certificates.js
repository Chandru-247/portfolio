const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/certificates
router.get('/', (req, res) => {
  const db = getDatabase();
  res.json({
    success: true,
    count: db.certificates.length,
    data: db.certificates
  });
});

// POST /api/certificates
router.post('/', requireAuth, (req, res) => {
  const {
    title,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    image,
    downloadUrl,
    featured
  } = req.body;

  if (!title || !issuer) {
    return res.status(400).json({
      success: false,
      message: 'Certificate title and issuer are required.'
    });
  }

  const db = getDatabase();
  const newCert = {
    id: 'cert-' + Date.now(),
    title: title.trim(),
    issuer: issuer.trim(),
    issueDate: issueDate || 'Present',
    expiryDate: expiryDate || 'Lifetime',
    credentialId: credentialId || 'N/A',
    credentialUrl: credentialUrl || '#',
    image: image || '/assets/cert_cloud_architect.png',
    downloadUrl: downloadUrl || image || '/assets/cert_cloud_architect.png',
    featured: Boolean(featured)
  };

  db.certificates.push(newCert);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Certificate registered successfully.',
    data: newCert
  });
});

// PUT /api/certificates/:id
router.put('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const index = db.certificates.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found.'
    });
  }

  db.certificates[index] = {
    ...db.certificates[index],
    ...req.body,
    id: db.certificates[index].id
  };

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Certificate updated successfully.',
    data: db.certificates[index]
  });
});

// DELETE /api/certificates/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const initialLength = db.certificates.length;
  db.certificates = db.certificates.filter(c => c.id !== req.params.id);

  if (db.certificates.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found.'
    });
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Certificate record removed.'
  });
});

module.exports = router;
