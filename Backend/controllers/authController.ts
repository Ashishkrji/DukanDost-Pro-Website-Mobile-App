import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, businessName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'Email already in use' });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      businessName,
    });

    createSendToken(newUser, 201, res);
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await (user as any).comparePassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const getProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  // Logic for forgot password will be added later
  res.status(200).json({ 
    status: 'success', 
    message: 'If an account exists, a reset link will be sent.' 
  });
};
