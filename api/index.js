const app = require('../server/index');
const { connectDB } = require('../server/config/db');

module.exports = async (req, res) => {
  // Ensure database is connected for Vercel serverless lambdas
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('Vercel serverless MongoDB connection notice:', err.message);
    }
  }
  return app(req, res);
};
