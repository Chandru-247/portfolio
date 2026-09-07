const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, default: 'Full Stack' },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  image: { type: String, default: '/assets/project_galaxy_ai.png' },
  tags: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 99 }
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
