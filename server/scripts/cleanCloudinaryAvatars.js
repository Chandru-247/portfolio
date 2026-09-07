require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const { cloudinary, isCloudinaryConfigured } = require('../utils/cloudinary');
const { getDatabase, saveDatabase, connectDB } = require('../config/db');
const Profile = require('../models/Profile');

async function cleanAvatars() {
  console.log('\n🌌 ==========================================');
  console.log('   CLEANING CLOUDINARY AVATARS & SETTING JERSEY ');
  console.log('==========================================\n');

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not configured!');
    process.exit(1);
  }

  // The latest uploaded Jersey photo public ID and URL
  const jerseyPublicId = 'galaxy_portfolio/assets/asset_Jersey_1788795478115';
  const jerseyUrl = 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg';

  // Images to delete
  const imagesToDelete = [
    'galaxy_portfolio/assets/avatar_cosmic_1788793510019',
    'galaxy_portfolio/avatars/avatar_chandru_cosmic_1788795150022',
    'galaxy_portfolio/assets/Asset_Screenshot__2__1788601829164_1788793494514',
    'galaxy_portfolio/assets/asset_Jersey_1788795385357' // remove duplicate earlier upload
  ];

  console.log('🗑️ Removing previous avatar test images from Cloudinary:');
  for (const publicId of imagesToDelete) {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      console.log(`   ✅ Deleted "${publicId}": ${res.result}`);
    } catch (err) {
      console.warn(`   ⚠️ Notice for "${publicId}": ${err.message}`);
    }
  }

  // 1. Update MongoDB Atlas Profile with the Jersey avatar
  console.log('\n📡 Connecting to MongoDB Atlas...');
  try {
    await connectDB();
    const updated = await Profile.findOneAndUpdate(
      {},
      { $set: { avatar: jerseyUrl } },
      { returnDocument: 'after', upsert: true }
    );
    console.log(`✅ MongoDB Atlas Profile avatar updated to:`);
    console.log(`   ${updated.avatar}`);
  } catch (mongoErr) {
    console.error('⚠️ MongoDB Atlas update error:', mongoErr.message);
  }

  // 2. Update local database JSON
  const db = getDatabase();
  db.profile.avatar = jerseyUrl;
  saveDatabase(db);
  console.log('💾 Local portfolio-db.json updated to Jersey avatar.');

  console.log('\n✨ COMPLETE! Previous test avatars removed and Jersey avatar active!\n');
  process.exit(0);
}

cleanAvatars();
