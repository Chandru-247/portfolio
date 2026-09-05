const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getDatabase, saveDatabase } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { generateResumePdf } = require('../utils/generateResumePdf');

// Helper to get formatted filename from user name
function getUserResumeNames(db) {
  const rawName = db.profile?.name || 'CHANDRU R';
  const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const title = `${cleanName}_Software_Engineer_Resume.pdf`;
  const filename = `${cleanName}_Resume.pdf`;
  return { cleanName, title, filename };
}

// Multer setup for resume
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `Resume_${cleanName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/resume
router.get('/', (req, res) => {
  const db = getDatabase();
  const { title, filename } = getUserResumeNames(db);
  const resume = { ...db.resume };

  // If title/filename contains Alex_Vance or is missing, modernize to user's name
  if (!resume.title || resume.title.includes('Alex_Vance')) {
    resume.title = title;
  }
  if (!resume.filename || resume.filename.includes('Alex_Vance')) {
    resume.filename = filename;
    resume.fileUrl = `/uploads/${filename}`;
  }

  res.json({
    success: true,
    data: resume
  });
});

// PUT /api/resume
router.put('/', requireAuth, (req, res) => {
  const db = getDatabase();
  db.resume = {
    ...db.resume,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Resume configuration updated.',
    data: db.resume
  });
});

// POST /api/resume/upload
router.post('/upload', requireAuth, upload.single('resumeFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No resume file uploaded.'
    });
  }

  const db = getDatabase();
  const fileUrl = `/uploads/${req.file.filename}`;
  const fileSizeKb = Math.round(req.file.size / 1024);

  db.resume = {
    title: req.body.title || req.file.originalname,
    filename: req.file.filename,
    fileUrl,
    externalUrl: db.resume?.externalUrl || '',
    lastUpdated: new Date().toISOString(),
    fileSize: `${fileSizeKb} KB`,
    useExternal: false,
    isCustomUpload: true
  };

  saveDatabase(db);

  res.json({
    success: true,
    message: 'New resume successfully uploaded to the archives.',
    data: db.resume
  });
});

// POST /api/resume/regenerate - Re-generates PDF from current profile data
router.post('/regenerate', requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    const { title, filename } = getUserResumeNames(db);
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await generateResumePdf(db, filePath);
    const stats = fs.statSync(filePath);
    const fileSizeKb = (stats.size / 1024).toFixed(1);

    db.resume = {
      title,
      filename,
      fileUrl: `/uploads/${filename}`,
      externalUrl: db.resume?.externalUrl || '',
      lastUpdated: new Date().toISOString(),
      fileSize: `${fileSizeKb} KB`,
      useExternal: false,
      isCustomUpload: false
    };

    saveDatabase(db);

    res.json({
      success: true,
      message: `Successfully regenerated resume for ${db.profile?.name || 'user'}.`,
      data: db.resume
    });
  } catch (err) {
    console.error('Failed to regenerate resume PDF:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate resume PDF: ' + err.message
    });
  }
});

// Helper to ensure a valid resume file exists and return its path
async function ensureResumeFile(db) {
  const { title, filename } = getUserResumeNames(db);
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // If a custom file was uploaded and exists with valid size (>200 bytes)
  if (db.resume?.filename) {
    const customPath = path.join(uploadDir, db.resume.filename);
    if (fs.existsSync(customPath)) {
      const stats = fs.statSync(customPath);
      if (stats.size > 200) {
        return {
          filePath: customPath,
          downloadTitle: db.resume.title || title
        };
      }
    }
  }

  // Otherwise generate standard PDF for user
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 200) {
    await generateResumePdf(db, filePath);
    const stats = fs.statSync(filePath);
    db.resume = {
      title,
      filename,
      fileUrl: `/uploads/${filename}`,
      externalUrl: db.resume?.externalUrl || '',
      lastUpdated: new Date().toISOString(),
      fileSize: `${(stats.size / 1024).toFixed(1)} KB`,
      useExternal: false
    };
    saveDatabase(db);
  }

  return {
    filePath,
    downloadTitle: title
  };
}

// GET /api/resume/download
router.get('/download', async (req, res) => {
  try {
    const db = getDatabase();
    const resume = db.resume || {};

    if (resume.useExternal && resume.externalUrl) {
      return res.redirect(resume.externalUrl);
    }

    const { filePath, downloadTitle } = await ensureResumeFile(db);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadTitle}"`);
    return res.download(filePath, downloadTitle, (err) => {
      if (err && !res.headersSent) {
        console.error('Download error:', err);
        res.status(500).send('Error downloading resume');
      }
    });
  } catch (err) {
    console.error('Resume download handler error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume.'
    });
  }
});

// GET /api/resume/view - Preview inline in browser
router.get('/view', async (req, res) => {
  try {
    const db = getDatabase();
    const resume = db.resume || {};

    if (resume.useExternal && resume.externalUrl) {
      return res.redirect(resume.externalUrl);
    }

    const { filePath, downloadTitle } = await ensureResumeFile(db);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${downloadTitle}"`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error('Resume view handler error:', err);
    res.status(500).send('Failed to display resume.');
  }
});

module.exports = router;
