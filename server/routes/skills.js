const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/skills
router.get('/', (req, res) => {
  const db = getDatabase();
  const { category } = req.query;

  let skills = [...db.skills];
  if (category && category !== 'All') {
    skills = skills.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  skills.sort((a, b) => (a.order || 99) - (b.order || 99));

  // Also group by categories for convenience
  const categories = [...new Set(db.skills.map(s => s.category))];

  res.json({
    success: true,
    count: skills.length,
    categories,
    data: skills
  });
});

// POST /api/skills
router.post('/', requireAuth, (req, res) => {
  const { name, category, proficiency, icon, order } = req.body;

  if (!name || !category) {
    return res.status(400).json({
      success: false,
      message: 'Skill name and category are required.'
    });
  }

  const db = getDatabase();
  const newSkill = {
    id: 'skill-' + Date.now(),
    name: name.trim(),
    category: category.trim(),
    proficiency: Math.min(100, Math.max(1, Number(proficiency) || 85)),
    icon: icon || 'Code',
    order: Number(order) || db.skills.length + 1
  };

  db.skills.push(newSkill);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Skill telemetry added.',
    data: newSkill
  });
});

// PUT /api/skills/:id
router.put('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const index = db.skills.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Skill not found.'
    });
  }

  db.skills[index] = {
    ...db.skills[index],
    ...req.body,
    proficiency: req.body.proficiency !== undefined ? Number(req.body.proficiency) : db.skills[index].proficiency,
    id: db.skills[index].id
  };

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Skill updated successfully.',
    data: db.skills[index]
  });
});

// DELETE /api/skills/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const initialLength = db.skills.length;
  db.skills = db.skills.filter(s => s.id !== req.params.id);

  if (db.skills.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Skill not found.'
    });
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Skill removed successfully.'
  });
});

module.exports = router;
