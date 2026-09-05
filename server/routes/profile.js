const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/profile
router.get('/', (req, res) => {
  const db = getDatabase();
  res.json({
    success: true,
    data: db.profile
  });
});

// PUT /api/profile
router.put('/', requireAuth, (req, res) => {
  const db = getDatabase();
  const updates = req.body;

  // Merge updates deeply
  db.profile = {
    ...db.profile,
    ...updates,
    education: updates.education !== undefined ? updates.education : db.profile.education,
    careerGoals: updates.careerGoals !== undefined ? updates.careerGoals : db.profile.careerGoals,
    stats: {
      ...db.profile.stats,
      ...(updates.stats || {})
    },
    socialLinks: updates.socialLinks ? { ...updates.socialLinks } : db.profile.socialLinks
  };

  // If resume is not a custom uploaded file, keep resume filename and title synced with profile name
  if (db.resume && !db.resume.isCustomUpload) {
    const rawName = db.profile.name || 'CHANDRU R';
    const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    db.resume.title = `${cleanName}_Software_Engineer_Resume.pdf`;
    db.resume.filename = `${cleanName}_Resume.pdf`;
    db.resume.fileUrl = `/uploads/${cleanName}_Resume.pdf`;
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Cosmic Profile updated successfully.',
    data: db.profile
  });
});

module.exports = router;
