const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  read: { type: Boolean, default: false },
  starred: { type: Boolean, default: false },
  forwardedTo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
