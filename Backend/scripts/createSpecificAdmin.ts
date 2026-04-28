import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createSpecificAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dukandost');
    console.log('Connected to MongoDB...');

    const email = 'Admin2026@gmail.com';
    const password = 'Admin@2026';

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists. Updating password...`);
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log('Password updated successfully!');
    } else {
      const newAdmin = new Admin({
        fullName: 'DukanDost Admin',
        email: email,
        password: password,
        role: 'admin',
        permissions: ['all']
      });

      await newAdmin.save();
      console.log(`Successfully created admin: ${email}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Operation Error:', error);
    process.exit(1);
  }
};

createSpecificAdmin();
