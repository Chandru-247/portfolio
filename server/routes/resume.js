const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');
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

// Get writable directory (local uploads or OS tmpdir for Vercel/serverless)
function getUploadDir() {
  const localDir = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.accessSync(localDir, fs.constants.W_OK);
    return localDir;
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'galaxy_uploads');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return tmpDir;
  }
}

// Memory storage prevents filesystem crashes on serverless runtimes like Vercel
const upload = multer({
  storage: multer.memoryStorage(),
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

  try {
    const db = getDatabase();
    const ext = path.extname(req.file.originalname) || '.pdf';
    const cleanName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Resume_${cleanName}_${Date.now()}${ext}`;
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/${filename}`;
    const fileSizeKb = Math.round(req.file.size / 1024);

    db.resume = {
      title: req.body.title || req.file.originalname,
      filename,
      fileUrl,
      externalUrl: db.resume?.externalUrl || '',
      lastUpdated: new Date().toISOString(),
      fileSize: `${fileSizeKb} KB`,
      useExternal: false,
      isCustomUpload: true
    };

    saveDatabase(db);

    return res.json({
      success: true,
      message: 'New resume successfully uploaded to the archives.',
      data: db.resume
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save uploaded resume: ' + err.message
    });
  }
});

// POST /api/resume/regenerate - Re-generates PDF from current profile data
router.post('/regenerate', requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    const { title, filename } = getUserResumeNames(db);
    const uploadDir = getUploadDir();
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
  const uploadDir = getUploadDir();

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
