import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dukandost');
    console.log('Connected to MongoDB for seeding...');

    const email = 'admin@dukandostpro.com';
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log('Admin already exists. Skipping...');
      process.exit(0);
    }

    const newAdmin = new Admin({
      fullName: 'DukanDost Super Admin',
      email: email,
      password: 'adminPassword123', // This will be hashed by the pre-save hook
      role: 'super_admin',
      permissions: ['all']
    });

    await newAdmin.save();
    console.log('Successfully seeded super admin!');
    console.log('Email:', email);
    console.log('Password: adminPassword123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedAdmin();
