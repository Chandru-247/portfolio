const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  id: { type: String },
  type: { type: String },
  degree: { type: String },
  institution: { type: String },
  period: { type: String },
  grade: { type: String },
  status: { type: String },
  highlights: { type: String }
}, { _id: false });

const CareerGoalSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  status: { type: String },
  period: { type: String },
  goal: { type: String }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, default: 'CHANDRU R' },
  headline: { type: String, default: 'Software Engineer' },
  subheadline: { type: String, default: '' },
  typingWords: [{ type: String }],
  statusText: { type: String, default: 'Open to Mission Opportunities' },
  statusAvailable: { type: Boolean, default: true },
  location: { type: String, default: 'Bengaluru, India / Remote' },
  email: { type: String, default: 'itismechandru247@gmail.com' },
  avatar: { type: String, default: 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg' },
  avatarPosition: { type: String, default: 'center 85%' },
  bio: { type: String, default: '' },
  education: [EducationSchema],
  careerGoals: [CareerGoalSchema],
  stats: {
    projectsCompleted: { type: mongoose.Schema.Types.Mixed, default: 0 },
    gitCommits: { type: mongoose.Schema.Types.Mixed, default: '0' },
    algorithmsSolved: { type: mongoose.Schema.Types.Mixed, default: '0' },
    certificationsEarned: { type: mongoose.Schema.Types.Mixed, default: 0 }
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    email: { type: String, default: '' },
    discord: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
