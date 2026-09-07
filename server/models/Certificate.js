const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, default: 'Present' },
  expiryDate: { type: String, default: 'Lifetime' },
  credentialId: { type: String, default: 'N/A' },
  credentialUrl: { type: String, default: '#' },
  image: { type: String, default: '/assets/cert_cloud_architect.png' },
  downloadUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
