import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log("No MongoDB URI provided. Add MONGODB_URI to .env.");
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    console.error("Please ensure your Hostinger IP is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> Allow Access From Anywhere).");
  }
};
