import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  if (!uri) {
    console.log("No MongoDB URI provided. Add MONGODB_URI or MONGO_URI to .env.");
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
