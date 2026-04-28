import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'You are not logged in. Please log in to get access.' });
    }

    // 2) Verification token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Check if admin still exists
    const currentAdmin = await Admin.findById(decoded.id);
    if (!currentAdmin) {
      return res.status(401).json({ success: false, message: 'The admin belonging to this token no longer exists.' });
    }

    if (!currentAdmin.isActive) {
      return res.status(403).json({ success: false, message: 'Your administrative access has been suspended.' });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as any).admin = currentAdmin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).admin.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
