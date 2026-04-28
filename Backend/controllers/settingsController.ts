import { Request, Response } from 'express';
import User from '../models/User';

export const updateUPISettings = async (req: any, res: Response) => {
  try {
    const { upiId, accountHolderName, businessName } = req.body;
    
    // Simple validation
    if (!upiId.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid UPI ID format' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, {
      upiId,
      accountHolderName,
      businessName
    }, { new: true });

    // In a real app, you might generate a QR image URL here
    // For now, we'll return the upiId which the frontend can use to generate a QR client-side
    const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountHolderName || user?.fullName || '')}&cu=INR`;

    res.status(200).json({ 
      success: true, 
      message: 'Payment settings saved successfully',
      upiId,
      qrData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
};

export const getUPISettings = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('upiId accountHolderName businessName');
    res.status(200).json({ success: true, settings: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};
