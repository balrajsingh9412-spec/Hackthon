const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri || mongoUri.trim() === '') {
      console.error('❌ MONGODB_URI or MONGO_URI is not set in environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🗡️ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
