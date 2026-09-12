const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri || mongoUri.trim() === '') {
      console.log('⚡ MONGODB_URI not set. Initializing MongoDB Memory Server fallback for instant offline execution...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🗡️ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If external Atlas fails, try memory server fallback
    if (process.env.MONGODB_URI) {
      console.log('⚠️ Atlas connection failed. Attempting MongoDB Memory Server fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`🗡️ MongoDB Fallback Connected: ${conn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.error(`❌ Fallback MongoDB Error: ${fallbackErr.message}`);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
