const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, default: 80 },
  icon: { type: String, default: 'Code' },
  order: { type: Number, default: 99 }
}, { timestamps: true });

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
