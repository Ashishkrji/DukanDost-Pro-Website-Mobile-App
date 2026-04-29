import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dukandost-pro';
  
  console.log('Connecting to:', uri);
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Create a dummy collection and item to force database creation
    const DummySchema = new mongoose.Schema({ name: String });
    const DummyModel = mongoose.model('Init', DummySchema);
    
    await DummyModel.create({ name: 'DukanDost Initialization' });
    console.log('Database initialized successfully! You can now see "dukandost-pro" in MongoDB Compass.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

seed();
