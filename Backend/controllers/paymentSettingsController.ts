import { Request, Response } from 'express';
import PaymentSettings from '../models/PaymentSettings.js';
import User from '../models/User.js';

// @desc    Update or Create Payment Settings
// @route   POST /api/payments/settings
// @access  Private
export const updatePaymentSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { upiId, accountHolderName, businessName, mobileNumber, paymentNotes, preferredMethod } = req.body;

    // Validate UPI Format (basic)
    if (!upiId.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid UPI ID format' });
    }

    // Generate UPI QR URL (Direct Merchant Payment)
    // Format: upi://pay?pa=upiid&pn=name&am=amount&cu=INR
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountHolderName)}&cu=INR`)}`;

    const settings = await PaymentSettings.findOneAndUpdate(
      { userId },
      { 
        upiId, 
        accountHolderName, 
        businessName, 
        mobileNumber, 
        paymentNotes, 
        preferredMethod,
        qrCodeUrl,
        isActive: true
      },
      { upsify: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update Payment Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment settings' });
  }
};

// @desc    Get Payment Settings
// @route   GET /api/payments/settings
// @access  Private
export const getPaymentSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const settings = await PaymentSettings.findOne({ userId });

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment settings' });
  }
};
