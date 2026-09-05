const express = require('express');
const router = express.Router();
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/projects
router.get('/', (req, res) => {
  const db = getDatabase();
  let projects = [...db.projects];

  const { category, featured } = req.query;

  if (category && category.toLowerCase() !== 'all') {
    projects = projects.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
    );
  }

  if (featured === 'true') {
    projects = projects.filter(p => p.featured);
  }

  // Sort by order or id
  projects.sort((a, b) => (a.order || 99) - (b.order || 99));

  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const project = db.projects.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found in celestial repository.'
    });
  }

  res.json({
    success: true,
    data: project
  });
});

// POST /api/projects
router.post('/', requireAuth, (req, res) => {
  const {
    title,
    category,
    description,
    longDescription,
    image,
    tags,
    githubUrl,
    liveUrl,
    featured,
    order
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Project title and description are required.'
    });
  }

  const db = getDatabase();
  const newProject = {
    id: 'proj-' + Date.now(),
    title: title.trim(),
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: category || 'Full Stack',
    description: description.trim(),
    longDescription: longDescription ? longDescription.trim() : description.trim(),
    image: image || '/assets/project_galaxy_ai.png',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['React', 'Node.js']),
    githubUrl: githubUrl || '#',
    liveUrl: liveUrl || '#',
    featured: Boolean(featured),
    order: Number(order) || db.projects.length + 1
  };

  db.projects.push(newProject);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'New project launched successfully into portfolio galaxy.',
    data: newProject
  });
});

// PUT /api/projects/:id
router.put('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const index = db.projects.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.'
    });
  }

  const updates = req.body;
  if (updates.tags && !Array.isArray(updates.tags)) {
    updates.tags = updates.tags.split(',').map(t => t.trim());
  }

  db.projects[index] = {
    ...db.projects[index],
    ...updates,
    id: db.projects[index].id // preserve id
  };

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Project updated successfully.',
    data: db.projects[index]
  });
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, (req, res) => {
  const db = getDatabase();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== req.params.id);

  if (db.projects.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: 'Project not found.'
    });
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: 'Project successfully decommissioned from portfolio.'
  });
});

module.exports = router;
