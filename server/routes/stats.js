const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/stats (Admin Dashboard metrics)
router.get('/', requireAuth, (req, res) => {
  const db = getDatabase();

  const totalProjects = db.projects ? db.projects.length : 0;
  const featuredProjects = db.projects ? db.projects.filter(p => p.featured).length : 0;
  const totalCertificates = db.certificates ? db.certificates.length : 0;
  const totalSkills = db.skills ? db.skills.length : 0;
  const totalMessages = db.messages ? db.messages.length : 0;
  const unreadMessages = db.messages ? db.messages.filter(m => !m.read).length : 0;

  // Skills breakdown by category
  const skillsByCategory = {};
  if (db.skills) {
    db.skills.forEach(s => {
      skillsByCategory[s.category] = (skillsByCategory[s.category] || 0) + 1;
    });
  }

  res.json({
    success: true,
    data: {
      totalProjects,
      featuredProjects,
      totalCertificates,
      totalSkills,
      totalMessages,
      unreadMessages,
      skillsByCategory,
      profileName: db.profile ? db.profile.name : 'Unknown Commander',
      resumeFile: db.resume ? db.resume.title : 'None',
      lastActive: new Date().toISOString()
    }
  });
});

module.exports = router;
