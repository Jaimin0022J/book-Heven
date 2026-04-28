const mongoose = require('mongoose');

const connectDB = async () => {
  global.dbConnected = false;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('WARNING: Server starting in MOCK MODE (In-Memory). Data will not be persisted.');
    global.dbConnected = false;
  }
};

module.exports = connectDB;
