const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'administrator' },
  name: { type: String, default: 'Cosmic Commander' },
  email: { type: String, default: 'itismechandru247@gmail.com' }
}, { timestamps: true });

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
