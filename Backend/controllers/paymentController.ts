import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Invoice from '../models/Invoice.ts';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret',
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

import Payment from '../models/Payment.ts';

export const getPayments = async (req: any, res: Response) => {
  try {
    const ownerId = req.ownerId;
    const payments = await Payment.find({ userId: ownerId })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });
    
    // Format for frontend
    const formatted = payments.map(p => ({
      id: p._id,
      amount: p.amount,
      mode: p.method,
      status: p.status === 'SUCCESS' ? 'Success' : p.status === 'PENDING' ? 'Pending' : 'Failed',
      customer: (p.customerId as any)?.name || 'Guest',
      customerInitials: (p.customerId as any)?.name?.substring(0, 2).toUpperCase() || 'GS',
      date: new Date(p.createdAt as any).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }));

    res.status(200).json(formatted);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: any, res: Response) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      invoiceId 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified!
      if (invoiceId) {
        await Invoice.findByIdAndUpdate(invoiceId, { 
          status: 'PAID',
          paidDate: new Date(),
          paymentMode: 'Online'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
      error: error.message,
    });
  }
};
