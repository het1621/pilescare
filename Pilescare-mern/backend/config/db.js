import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    return;
  }

  try {
    // Added Serverless-specific options to prevent hanging and timeouts
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of waiting 10s if the DB is unreachable
      socketTimeoutMS: 45000,         // Close inactive sockets after 45 seconds to save resources
      family: 4,                      // Force IPv4 (Vercel resolves IPv4 much faster than IPv6)
    });

    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Rethrow the error so your API routes know the connection failed 
    // and can return a proper 500 status code to the frontend!
    throw error; 
  }
};

export default connectDB;