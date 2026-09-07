const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Mongoose Models for MongoDB Atlas
const AdminUser = require('../models/AdminUser');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');
const Resume = require('../models/Resume');

const DB_FILE = path.join(__dirname, '..', 'data', 'portfolio-db.json');

// Default initial data representing a cosmic portfolio
const defaultData = {
  adminUser: {
    username: 'admin',
    passwordHash: bcrypt.hashSync('galaxy@2026', 10),
    role: 'administrator',
    name: 'Cosmic Commander',
    email: 'itismechandru247@gmail.com'
  },
  profile: {
    name: 'CHANDRU R',
    headline: 'Software Engineer & Space Tech Enthusiast',
    subheadline: 'Architecting high-performance distributed systems, dynamic web applications, and stellar digital experiences.',
    typingWords: [
      'Full-Stack Web Developer',
      'Java & DSA Specialist',
      'Distributed Systems Enthusiast',
      'Cosmic UI/UX Designer',
      'Open Source Contributor'
    ],
    statusText: 'Open to Mission Opportunities',
    statusAvailable: true,
    location: 'Bengaluru, India / Remote Planetary Station',
    email: 'itismechandru247@gmail.com',
    avatar: 'https://res.cloudinary.com/ogtctcs6/image/upload/v1788795478/galaxy_portfolio/assets/asset_Jersey_1788795478115.jpg',
    avatarPosition: 'center 85%',
    bio: 'I am a passionate computer science engineer with a deep fascination for algorithms, scalable architectures, and cosmic aesthetics. With a strong foundation in Java, Data Structures & Algorithms, Object-Oriented Design, and modern web frameworks, I build resilient applications that traverse the boundaries of speed and elegance.',
    education: [
      {
        id: 'edu-college',
        type: 'College Course',
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        institution: 'National Institute of Technology',
        period: '2022 - 2026',
        grade: 'CGPA: 8.9 / 10.0',
        status: 'Currently Pursuing',
        highlights: 'Specialization in Distributed Systems, High-Performance Computing, Cloud Architectures & Advanced Data Structures.'
      },
      {
        id: 'edu-twelfth',
        type: '12th Standard',
        degree: 'Higher Secondary School Certificate (Class 12 - PCM & CS)',
        institution: 'St. Xavier Senior Secondary School',
        period: '2020 - 2022',
        grade: 'Percentage: 94.6%',
        status: 'Completed',
        highlights: 'Distinction in Physics, Chemistry, Mathematics & Computer Science. Science & Math Olympiad Ranker.'
      },
      {
        id: 'edu-tenth',
        type: '10th Standard',
        degree: 'Secondary School Examination (Class 10 - CBSE/SSLC)',
        institution: 'Modern English Academy High School',
        period: '2018 - 2020',
        grade: 'Percentage: 95.8%',
        status: 'Completed',
        highlights: 'School Academic Distinction with 100/100 in Mathematics. State Science Exhibition Finalist.'
      }
    ],
    careerGoals: [
      {
        id: 'goal-current',
        title: '🚀 Active Career Milestone: Software Development Engineer (SDE)',
        status: 'Currently Pursuing',
        period: '2026 - Present',
        goal: 'Currently pursuing advanced distributed computing, full-stack microservices architecture, and high-frequency algorithms (650+ DSA solved). Actively preparing for top-tier software engineering mission opportunities.'
      },
      {
        id: 'goal-1',
        title: 'Mission Milestone 1: Scalable Cloud Architecture',
        status: 'In Progress',
        period: '2026',
        goal: 'Engineer scalable cloud-native microservices capable of handling millions of real-time events with sub-millisecond latencies.'
      },
      {
        id: 'goal-2',
        title: 'Mission Milestone 2: Open Source Core Modules',
        status: 'Target',
        period: '2026 - 2027',
        goal: 'Contribute core modules to major open-source cloud frameworks and space-exploration visual computing tools.'
      },
      {
        id: 'goal-3',
        title: 'Mission Milestone 3: Lead Systems Engineering',
        status: 'Vision',
        period: '2027+',
        goal: 'Lead an engineering squadron building resilient software systems that power next-gen frontier technologies.'
      }
    ],
    stats: {
      projectsCompleted: 24,
      gitCommits: '1.2K+',
      algorithmsSolved: '650+',
      certificationsEarned: 6
    },
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      email: 'mailto:itismechandru247@gmail.com',
      discord: 'https://discord.com'
    }
  },
  resume: {
    title: 'CHANDRU_R_Software_Engineer_Resume.pdf',
    filename: 'Chandru_R_Resume.pdf',
    fileUrl: '/uploads/Chandru_R_Resume.pdf',
    externalUrl: '',
    lastUpdated: '2026-09-05T12:00:00.000Z',
    fileSize: '4.4 KB',
    useExternal: false
  },
  skills: [
    // Languages
    { id: 'skill-1', name: 'Java', category: 'Languages', proficiency: 94, icon: 'Coffee', order: 1 },
    { id: 'skill-2', name: 'JavaScript (ES6+)', category: 'Languages', proficiency: 92, icon: 'FileCode', order: 2 },
    { id: 'skill-3', name: 'TypeScript', category: 'Languages', proficiency: 88, icon: 'Code', order: 3 },
    { id: 'skill-4', name: 'Python', category: 'Languages', proficiency: 85, icon: 'Terminal', order: 4 },
    { id: 'skill-5', name: 'C++', category: 'Languages', proficiency: 80, icon: 'Cpu', order: 5 },

    // Core CS
    { id: 'skill-6', name: 'Data Structures & Algorithms', category: 'Core CS', proficiency: 95, icon: 'Binary', order: 6 },
    { id: 'skill-7', name: 'Object-Oriented Programming (OOP)', category: 'Core CS', proficiency: 96, icon: 'Box', order: 7 },
    { id: 'skill-8', name: 'System Design & Architecture', category: 'Core CS', proficiency: 84, icon: 'Layers', order: 8 },
    { id: 'skill-9', name: 'Database Management (DBMS)', category: 'Core CS', proficiency: 90, icon: 'Database', order: 9 },

    // Web & Frontend
    { id: 'skill-10', name: 'React.js', category: 'Frontend', proficiency: 92, icon: 'Atom', order: 10 },
    { id: 'skill-11', name: 'HTML5 & Semantic Markup', category: 'Frontend', proficiency: 98, icon: 'Layout', order: 11 },
    { id: 'skill-12', name: 'CSS3 & Modern Animations', category: 'Frontend', proficiency: 95, icon: 'Palette', order: 12 },
    { id: 'skill-13', name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, icon: 'Wind', order: 13 },

    // Backend & DB
    { id: 'skill-14', name: 'Node.js', category: 'Backend', proficiency: 90, icon: 'Server', order: 14 },
    { id: 'skill-15', name: 'Express.js', category: 'Backend', proficiency: 91, icon: 'Radio', order: 15 },
    { id: 'skill-16', name: 'MongoDB & Mongoose', category: 'Backend', proficiency: 89, icon: 'HardDrive', order: 16 },
    { id: 'skill-17', name: 'RESTful API Engineering', category: 'Backend', proficiency: 93, icon: 'Share2', order: 17 },

    // Tools & DevOps
    { id: 'skill-18', name: 'Git & GitHub Version Control', category: 'Tools', proficiency: 94, icon: 'GitBranch', order: 18 },
    { id: 'skill-19', name: 'VS Code & Dev Environment', category: 'Tools', proficiency: 96, icon: 'Monitor', order: 19 },
    { id: 'skill-20', name: 'Docker & Containerization', category: 'Tools', proficiency: 82, icon: 'Package', order: 20 },
    { id: 'skill-21', name: 'Postman & API Testing', category: 'Tools', proficiency: 90, icon: 'Send', order: 21 }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CosmoPulse - Real-Time Astronomical Telemetry Cloud',
      slug: 'cosmopulse-telemetry',
      category: 'Full Stack',
      description: 'Distributed microservices engine aggregating simulated satellite telemetry, orbital coordinates, and deep-space cosmic rays with 3D WebGL visualizations.',
      longDescription: 'CosmoPulse is built to handle millions of streaming sensory datapoints with sub-50ms latency. Implements JWT role-based telemetry streaming, custom WebSocket pipelines, and Redis caching. Features an interactive three.js orbital plane and responsive control center.',
      image: '/assets/project_galaxy_ai.png',
      tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Three.js', 'WebSockets'],
      githubUrl: 'https://github.com/galaxy-portfolio/cosmopulse',
      liveUrl: 'https://cosmopulse-demo.space',
      featured: true,
      order: 1
    },
    {
      id: 'proj-2',
      title: 'QuantumSort & Graph Navigator - 3D Algorithm Visualizer',
      slug: 'quantum-algo-visualizer',
      category: 'Core CS / Systems',
      description: 'Interactive computational visualizer for complex graph traversals (Dijkstra, A*, BFS/DFS), dynamic programming, and sorting heuristics.',
      longDescription: 'Engineered for students and algorithm enthusiasts to intuitively explore complex time complexities and memory structures. Includes step-by-step playback, breakpoint debugging, custom test case matrix builder, and space complexity profiling.',
      image: '/assets/project_dsa_visualizer.png',
      tags: ['Java', 'Algorithms', 'React', 'Canvas API', 'DSA Engine'],
      githubUrl: 'https://github.com/galaxy-portfolio/quantum-algo-viz',
      liveUrl: 'https://quantum-algorithms.space',
      featured: true,
      order: 2
    },
    {
      id: 'proj-3',
      title: 'AstroBazaar - Glassmorphic Space Commerce Platform',
      slug: 'astrobazaar-commerce',
      category: 'Full Stack',
      description: 'Full-stack enterprise e-commerce platform designed for orbital logistics and spacecraft equipment with real-time inventory management and Stripe checkout.',
      longDescription: 'Comprehensive full-stack portal featuring secure admin inventory control, cart synchronization, coupon engine, order fulfillment webhooks, and automated PDF invoice generation.',
      image: '/assets/project_orbit_commerce.png',
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind CSS', 'Stripe'],
      githubUrl: 'https://github.com/galaxy-portfolio/astrobazaar',
      liveUrl: 'https://astrobazaar-shop.space',
      featured: true,
      order: 3
    },
    {
      id: 'proj-4',
      title: 'NebulaShield - Cloud Vulnerability Scanner & Monitor',
      slug: 'nebulashield-security',
      category: 'Backend',
      description: 'Automated cybersecurity audit daemon inspecting open ports, SSL lifecycle status, and OWASP Top 10 vulnerabilities with automated alerting.',
      longDescription: 'Features multi-threaded scanner engines in Java/Node, cryptographic signature verification, Discord/Slack webhooks, and an administrative mitigation dashboard.',
      image: '/assets/project_galaxy_ai.png',
      tags: ['Node.js', 'Java', 'Express', 'Security', 'REST API'],
      githubUrl: 'https://github.com/galaxy-portfolio/nebulashield',
      liveUrl: 'https://nebulashield.space',
      featured: false,
      order: 4
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      issueDate: 'January 2026',
      expiryDate: 'January 2029',
      credentialId: 'AWS-99482710-CLF',
      credentialUrl: 'https://aws.amazon.com/verification',
      image: '/assets/cert_cloud_architect.png',
      downloadUrl: '/assets/cert_cloud_architect.png',
      featured: true
    },
    {
      id: 'cert-2',
      title: 'Advanced Data Structures & Algorithms in Java',
      issuer: 'HackerRank & Coursera Specialization',
      issueDate: 'November 2025',
      expiryDate: 'Lifetime',
      credentialId: 'HR-DSA-JAVA-40192',
      credentialUrl: 'https://www.hackerrank.com/certificates',
      image: '/assets/cert_java_dsa.png',
      downloadUrl: '/assets/cert_java_dsa.png',
      featured: true
    },
    {
      id: 'cert-3',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta (Facebook)',
      issueDate: 'August 2025',
      expiryDate: 'Lifetime',
      credentialId: 'META-FE-782190',
      credentialUrl: 'https://coursera.org/verify/professional-cert',
      image: '/assets/cert_cloud_architect.png',
      downloadUrl: '/assets/cert_cloud_architect.png',
      featured: true
    },
    {
      id: 'cert-4',
      title: 'Associate Cloud Engineer & Distributed Systems',
      issuer: 'Google Cloud Platform',
      issueDate: 'March 2025',
      expiryDate: 'March 2028',
      credentialId: 'GCP-ACE-559102',
      credentialUrl: 'https://cloud.google.com/certification',
      image: '/assets/cert_java_dsa.png',
      downloadUrl: '/assets/cert_java_dsa.png',
      featured: false
    }
  ],
  messages: [
    {
      id: 'msg-1',
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@astralab.org',
      subject: 'Inquiry: Space Telemetry Visualization Collaboration',
      message: 'Greetings Alex! We came across your CosmoPulse real-time visualization platform and were truly impressed with your UI polish and latency performance. We would love to discuss an engineering role within our planetary observation team.',
      createdAt: '2026-09-02T16:45:00.000Z',
      read: false,
      starred: true
    },
    {
      id: 'msg-2',
      name: 'Marcus Chen',
      email: 'm.chen@novatech.io',
      subject: 'Senior Full-Stack / Backend Engineer Position',
      message: 'Hi Alex, your Java and Node.js work along with the stellar portfolio design caught our tech scouting radar. Are you available for a discovery call this upcoming Thursday?',
      createdAt: '2026-09-03T11:20:00.000Z',
      read: true,
      starred: false
    }
  ]
};

// In-memory cached database
let databaseCache = null;

// Serverless Mongoose connection cache for Vercel lambdas
let cachedMongoose = global.mongooseCache;
if (!cachedMongoose) {
  cachedMongoose = global.mongooseCache = { conn: null, promise: null };
}

function isMongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Connect to MongoDB Atlas with connection pooling & serverless caching
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cachedMongoose.conn) {
    return cachedMongoose.conn;
  }

  if (!cachedMongoose.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    };

    cachedMongoose.promise = mongoose.connect(uri, opts).then(async (m) => {
      console.log('🌌 [Cosmic DB] Successfully connected to MongoDB Atlas');
      // On first connection, sync data from Atlas or auto-seed if empty
      await syncFromMongo();
      return m;
    }).catch((err) => {
      console.warn('⚠️ [Cosmic DB] MongoDB Atlas connection error, using local fallback:', err.message);
      cachedMongoose.promise = null;
      return null;
    });
  }

  try {
    cachedMongoose.conn = await cachedMongoose.promise;
  } catch (e) {
    cachedMongoose.promise = null;
    return null;
  }

  return cachedMongoose.conn;
}

/**
 * Fetch all collections from MongoDB Atlas into databaseCache.
 * If MongoDB is empty, automatically seeds it from current databaseCache / defaultData!
 */
async function syncFromMongo() {
  if (!isMongoConnected()) return null;

  try {
    const [profileDoc, adminDoc, resumeDoc, skillsDocs, projectsDocs, certsDocs, messagesDocs] = await Promise.all([
      Profile.findOne().lean(),
      AdminUser.findOne().lean(),
      Resume.findOne().lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Project.find().sort({ order: 1 }).lean(),
      Certificate.find().lean(),
      Message.find().sort({ createdAt: -1 }).lean()
    ]);

    // Check if Atlas is brand new / empty
    const isEmpty = !profileDoc && (!skillsDocs || skillsDocs.length === 0);

    if (isEmpty) {
      console.log('✨ [Cosmic DB] MongoDB Atlas is empty. Initializing with local portfolio records...');
      const sourceData = databaseCache || loadLocalData();
      await syncToMongo(sourceData);
      return databaseCache;
    }

    // Build unified data object from Atlas documents
    databaseCache = {
      adminUser: adminDoc || defaultData.adminUser,
      profile: profileDoc || defaultData.profile,
      resume: resumeDoc || defaultData.resume,
      skills: (skillsDocs && skillsDocs.length > 0) ? skillsDocs : defaultData.skills,
      projects: projectsDocs || [],
      certificates: certsDocs || [],
      messages: messagesDocs || []
    };

    return databaseCache;
  } catch (err) {
    console.error('Error syncing from MongoDB Atlas:', err.message);
    return null;
  }
}

/**
 * Push data object directly to MongoDB Atlas
 */
async function syncToMongo(data) {
  if (!isMongoConnected() || !data) return false;

  try {
    const operations = [];

    // 1. Sync Profile
    if (data.profile) {
      operations.push(
        Profile.findOneAndUpdate({}, { $set: data.profile }, { upsert: true, returnDocument: 'after' })
      );
    }

    // 2. Sync AdminUser
    if (data.adminUser) {
      operations.push(
        AdminUser.findOneAndUpdate(
          { username: data.adminUser.username || 'admin' },
          { $set: data.adminUser },
          { upsert: true, returnDocument: 'after' }
        )
      );
    }

    // 3. Sync Resume
    if (data.resume) {
      operations.push(
        Resume.findOneAndUpdate({}, { $set: data.resume }, { upsert: true, returnDocument: 'after' })
      );
    }

    // 4. Sync Skills
    if (Array.isArray(data.skills)) {
      operations.push(
        Skill.deleteMany({}).then(() => {
          if (data.skills.length > 0) return Skill.insertMany(data.skills);
        })
      );
    }

    // 5. Sync Projects
    if (Array.isArray(data.projects)) {
      operations.push(
        Project.deleteMany({}).then(() => {
          if (data.projects.length > 0) return Project.insertMany(data.projects);
        })
      );
    }

    // 6. Sync Certificates
    if (Array.isArray(data.certificates)) {
      operations.push(
        Certificate.deleteMany({}).then(() => {
          if (data.certificates.length > 0) return Certificate.insertMany(data.certificates);
        })
      );
    }

    // 7. Sync Messages
    if (Array.isArray(data.messages)) {
      operations.push(
        Message.deleteMany({}).then(() => {
          if (data.messages.length > 0) return Message.insertMany(data.messages);
        })
      );
    }

    await Promise.all(operations);
    return true;
  } catch (err) {
    console.error('Error syncing to MongoDB Atlas:', err.message);
    return false;
  }
}

function loadLocalData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
}

function loadDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveDatabase(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    databaseCache = JSON.parse(raw);

    // If MongoDB Atlas connection URI is configured, initiate connection
    if (process.env.MONGODB_URI) {
      connectDB().catch((err) => {
        console.warn('Asynchronous MongoDB connect error:', err.message);
      });
    }

    return databaseCache;
  } catch (err) {
    console.error('Error loading portfolio database, resetting to defaults:', err);
    saveDatabase(defaultData);
    return defaultData;
  }
}

function saveDatabase(data) {
  try {
    databaseCache = data;

    // 1. Persist locally to portfolio-db.json if writable
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (fsErr) {
      // In read-only serverless environment like Vercel, ignore local write failure
      console.warn('Local database file write bypassed (serverless environment):', fsErr.message);
    }

    // 2. Persist to MongoDB Atlas if connected
    if (isMongoConnected()) {
      syncToMongo(data).catch((mongoErr) => {
        console.error('Failed to async sync database change to MongoDB Atlas:', mongoErr.message);
      });
    }

    return true;
  } catch (err) {
    console.error('Error saving portfolio database:', err);
    return false;
  }
}

function getDatabase() {
  if (!databaseCache) {
    databaseCache = loadDatabase();
  }
  return databaseCache;
}

module.exports = {
  getDatabase,
  saveDatabase,
  loadDatabase,
  connectDB,
  isMongoConnected,
  syncFromMongo,
  syncToMongo,
  defaultData
};
