const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');

// Get writable directory (local uploads or OS tmpdir for Vercel/serverless)
function getUploadDir() {
  const localDir = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.accessSync(localDir, fs.constants.W_OK);
    return { dir: localDir, isLocal: true };
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'galaxy_uploads');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return { dir: tmpDir, isLocal: false };
  }
}

// Memory storage prevents filesystem crashes on serverless runtimes like Vercel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are permitted for upload.'));
    }
  }
});

// POST /api/upload
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was transmitted.'
      });
    }

    const ext = path.extname(req.file.originalname) || '.png';
    const cleanName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Asset_${cleanName}_${Date.now()}${ext}`;
    const { dir, isLocal } = getUploadDir();

    let fileUrl = '';

    // If local directory is writable, write file to disk
    if (isLocal) {
      try {
        const filePath = path.join(dir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        fileUrl = `/uploads/${filename}`;
      } catch (err) {
        console.warn('Local disk write failed, fallback to data URL:', err.message);
      }
    }

    // In serverless / read-only environment or if disk write failed, use Base64 Data URL
    if (!fileUrl) {
      const mime = req.file.mimetype || 'image/png';
      fileUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    }

    return res.json({
      success: true,
      message: 'File successfully archived.',
      fileUrl,
      filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server upload error: ' + err.message
    });
  }
});

module.exports = router;
