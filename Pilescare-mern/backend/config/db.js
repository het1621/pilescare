import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Don't process.exit() — let the server start and fail gracefully per-request
    // This is especially important for serverless deployments (Vercel)
  }
};

export default connectDB;
