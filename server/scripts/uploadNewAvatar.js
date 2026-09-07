require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { uploadStream, isCloudinaryConfigured } = require('../utils/cloudinary');
const { getDatabase, saveDatabase, connectDB } = require('../config/db');
const Profile = require('../models/Profile');

async function testUploadNewAvatar() {
  console.log('\n🌌 ==========================================');
  console.log('   TESTING PROFILE IMAGE UPLOAD TO CLOUD     ');
  console.log('==========================================\n');

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not configured!');
    process.exit(1);
  }

  // Find generated image in brain directory or sample file
  const brainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\d04c0953-1579-4d1c-af0a-2ebb481badb3';
  let imagePath = null;

  if (fs.existsSync(brainDir)) {
    const files = fs.readdirSync(brainDir).filter(f => f.startsWith('cosmic_dev_avatar') && f.endsWith('.jpg'));
    if (files.length > 0) {
      imagePath = path.join(brainDir, files[files.length - 1]);
    }
  }

  if (!imagePath || !fs.existsSync(imagePath)) {
    console.error('❌ Test avatar image file not found at:', imagePath);
    process.exit(1);
  }

  console.log(`📸 Found new avatar image file: ${imagePath}`);
  console.log(`📦 File size: ${(fs.statSync(imagePath).size / 1024).toFixed(1)} KB`);

  // Step 1: Upload directly to Cloudinary
  console.log('\n🚀 Uploading image to Cloudinary CDN (folder: galaxy_portfolio/avatars)...');
  const buffer = fs.readFileSync(imagePath);
  let cloudUrl = '';

  try {
    const uploadResult = await uploadStream(buffer, {
      folder: 'galaxy_portfolio/avatars',
      public_id: `avatar_chandru_cosmic_${Date.now()}`,
      resource_type: 'image'
    });
    cloudUrl = uploadResult.secure_url;
    console.log('✅ Cloudinary upload success!');
    console.log(`🔗 Cloudinary Public CDN URL: ${cloudUrl}`);
  } catch (cloudErr) {
    console.error('❌ Cloudinary upload failed:', cloudErr.message);
    process.exit(1);
  }

  // Step 2: Connect to MongoDB Atlas and update Profile
  console.log('\n📡 Connecting to MongoDB Atlas...');
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas!');

    // Update Atlas
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $set: { avatar: cloudUrl } },
      { returnDocument: 'after', upsert: true }
    );
    console.log('✅ MongoDB Atlas Profile.avatar updated to:');
    console.log(`   ${updatedProfile.avatar}`);
  } catch (mongoErr) {
    console.error('⚠️ MongoDB Atlas update error:', mongoErr.message);
  }

  // Step 3: Update local portfolio-db.json
  const db = getDatabase();
  db.profile.avatar = cloudUrl;
  saveDatabase(db);
  console.log('💾 Local portfolio-db.json updated as well.');

  console.log('\n✨ COMPLETE! The new profile image is permanently live on Cloudinary and MongoDB Atlas!\n');
  process.exit(0);
}

testUploadNewAvatar();
