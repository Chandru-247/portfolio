require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { loadDatabase, connectDB, isMongoConnected } = require('./config/db');
const { isCloudinaryConfigured } = require('./utils/cloudinary');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seeds
loadDatabase();
if (process.env.MONGODB_URI) {
  connectDB().catch((err) => {
    console.warn('⚠️ MongoDB connection notice on startup:', err.message);
  });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Static client assets directory (for generated mockups, avatar, etc.)
const clientAssetsDir = path.join(__dirname, '..', 'client', 'public', 'assets');
if (fs.existsSync(clientAssetsDir)) {
  app.use('/assets', express.static(clientAssetsDir));
}

// REST API Route Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Galaxy-Portfolio-Core',
    database: isMongoConnected() ? 'MongoDB Atlas (Connected)' : 'Local Persistent JSON Storage',
    storage: isCloudinaryConfigured() ? 'Cloudinary CDN (Active)' : 'Local Disk Storage',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend build if available
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Galaxy Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Galaxy Engine Error'
  });
});

// Start Server if run directly (locally or in standalone container)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌌 Galaxy Portfolio Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🛸 Health check at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
