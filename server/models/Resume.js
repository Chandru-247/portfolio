const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  title: { type: String, default: 'CHANDRU_R_Software_Engineer_Resume.pdf' },
  filename: { type: String, default: 'CHANDRU_R_Resume.pdf' },
  fileUrl: { type: String, default: '/uploads/CHANDRU_R_Resume.pdf' },
  externalUrl: { type: String, default: '' },
  lastUpdated: { type: String, default: () => new Date().toISOString() },
  fileSize: { type: String, default: '4.3 KB' },
  useExternal: { type: Boolean, default: false },
  isCustomUpload: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
