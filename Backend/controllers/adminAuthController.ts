import { Request, Response } from 'express';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';

const signToken = (id: string) => {
  return (jwt as any).sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
  });
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // 2) Check if admin exists & password is correct
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await (admin as any).comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account is suspended' });
    }

    // 3) Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // 4) If everything ok, send token to client
    const token = signToken(admin._id.toString());

    res.status(200).json({
      success: true,
      token,
      data: {
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById((req as any).admin.id);
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};
