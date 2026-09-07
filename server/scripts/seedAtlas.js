require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const AdminUser = require('../models/AdminUser');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');
const Resume = require('../models/Resume');

const DB_FILE = path.join(__dirname, '..', 'data', 'portfolio-db.json');

async function seedAtlas() {
  const uri = process.env.MONGODB_URI;

  console.log('\n🌌 ==========================================');
  console.log('   GALAXY PORTFOLIO - MONGODB ATLAS SEEDER  ');
  console.log('==========================================\n');

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env or root .env!');
    console.log('\n📝 Please add your MongoDB connection string:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/portfolio?retryWrites=true&w=majority\n');
    process.exit(1);
  }

  console.log('📡 Connecting to MongoDB Atlas cluster...');
  try {
    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ Connected successfully to MongoDB Atlas!\n');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  }

  // Load JSON source data
  let data;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      data = JSON.parse(raw);
      console.log(`📂 Read source portfolio data from: ${DB_FILE}`);
    } else {
      console.warn('⚠️ portfolio-db.json not found, using default data template.');
      data = require('../config/db').defaultData;
    }
  } catch (err) {
    console.error('❌ Error reading portfolio data file:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  try {
    // 1. Seed Profile
    if (data.profile) {
      await Profile.findOneAndUpdate({}, { $set: data.profile }, { upsert: true, returnDocument: 'after' });
      console.log(`👤 Profile synced: "${data.profile.name}" (${data.profile.headline})`);
    }

    // 2. Seed Admin User
    if (data.adminUser) {
      await AdminUser.findOneAndUpdate(
        { username: data.adminUser.username || 'admin' },
        { $set: data.adminUser },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`🛡️ Admin User synced: "${data.adminUser.username}"`);
    }

    // 3. Seed Resume
    if (data.resume) {
      await Resume.findOneAndUpdate({}, { $set: data.resume }, { upsert: true, returnDocument: 'after' });
      console.log(`📄 Resume synced: "${data.resume.title || data.resume.filename}"`);
    }

    // 4. Seed Skills
    if (Array.isArray(data.skills)) {
      await Skill.deleteMany({});
      if (data.skills.length > 0) {
        await Skill.insertMany(data.skills);
      }
      console.log(`⚡ Skills synced: ${data.skills.length} skills recorded`);
    }

    // 5. Seed Projects
    if (Array.isArray(data.projects)) {
      await Project.deleteMany({});
      if (data.projects.length > 0) {
        await Project.insertMany(data.projects);
      }
      console.log(`🚀 Projects synced: ${data.projects.length} celestial projects recorded`);
    }

    // 6. Seed Certificates
    if (Array.isArray(data.certificates)) {
      await Certificate.deleteMany({});
      if (data.certificates.length > 0) {
        await Certificate.insertMany(data.certificates);
      }
      console.log(`📜 Certificates synced: ${data.certificates.length} credentials recorded`);
    }

    // 7. Seed Messages
    if (Array.isArray(data.messages)) {
      await Message.deleteMany({});
      if (data.messages.length > 0) {
        await Message.insertMany(data.messages);
      }
      console.log(`📬 Messages synced: ${data.messages.length} transmissions recorded`);
    }

    console.log('\n✨ All galactic portfolio data has been successfully pushed to MongoDB Atlas!');
    console.log('🛸 Your Vercel deployment will now query and persist everything directly in MongoDB Atlas.\n');
  } catch (err) {
    console.error('❌ Error during data seeding:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas.');
    process.exit(0);
  }
}

seedAtlas();
