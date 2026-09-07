require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { uploadStream, isCloudinaryConfigured } = require('../utils/cloudinary');
const { getDatabase, saveDatabase } = require('../config/db');

async function syncLocalAssetsToCloudinary() {
  console.log('\n🌌 ==========================================');
  console.log('   UPLOADING ASSETS TO CLOUDINARY CDN      ');
  console.log('==========================================\n');

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not configured in server/.env!');
    process.exit(1);
  }

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('No server/uploads directory found.');
    process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`🔍 Found ${files.length} local files in server/uploads...\n`);

  const uploadedUrls = {};

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    if (!fs.statSync(filePath).isFile()) continue;

    console.log(`🚀 Uploading ${file} to Cloudinary...`);
    try {
      const buffer = fs.readFileSync(filePath);
      const ext = path.extname(file);
      const cleanName = path.basename(file, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const isPdf = ext.toLowerCase() === '.pdf';

      const result = await uploadStream(buffer, {
        folder: isPdf ? 'galaxy_portfolio/resumes' : 'galaxy_portfolio/assets',
        public_id: `${cleanName}_${Date.now()}`,
        resource_type: isPdf ? 'auto' : 'image'
      });

      uploadedUrls[file] = result.secure_url;
      console.log(`✅ Uploaded: ${file} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    }
  }

  // Update portfolio-db.json with the new Cloudinary CDN URLs
  const db = getDatabase();
  let updated = false;

  // 1. Update Profile Avatar
  if (db.profile?.avatar) {
    for (const [localFile, cloudUrl] of Object.entries(uploadedUrls)) {
      if (db.profile.avatar.includes(localFile)) {
        console.log(`\n🔄 Updating profile avatar from local path to: ${cloudUrl}`);
        db.profile.avatar = cloudUrl;
        updated = true;
      }
    }
  }

  // 2. Update Resume URL if local
  if (db.resume?.filename && uploadedUrls[db.resume.filename]) {
    console.log(`🔄 Updating resume fileUrl to: ${uploadedUrls[db.resume.filename]}`);
    db.resume.fileUrl = uploadedUrls[db.resume.filename];
    updated = true;
  }

  if (updated) {
    saveDatabase(db);
    console.log('\n💾 portfolio-db.json updated successfully with permanent Cloudinary URLs!');
  }

  console.log('\n✨ Asset migration to Cloudinary completed successfully!\n');
}

syncLocalAssetsToCloudinary();
