import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import BusinessInquiry from '../models/BusinessInquiry.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// @desc    Create Razorpay Order
// @route   POST /api/subscription/create-order
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { planName, billingType, amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: (req as any).user._id,
        planName,
        billingType,
        durationMonths: req.body.durationMonths
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/subscription/verify-payment
// @access  Private
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planName,
      billingType,
      amount
    } = req.body;

    const userId = (req as any).user._id;

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || '')
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Calculate end date based on durationMonths
    const startDate = new Date();
    const endDate = new Date();
    const duration = req.body.durationMonths || 1;
    endDate.setMonth(startDate.getMonth() + duration);

    // Save subscription
    const subscription = await Subscription.create({
      userId,
      planName,
      billingType,
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      isActive: true
    });

    // Update user plan
    await User.findByIdAndUpdate(userId, {
      plan: planName,
      subscriptionId: subscription._id
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated',
      plan: planName
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// @desc    Get Current Plan (Includes automatic downgrade check)
// @route   GET /api/subscription/current-plan
// @access  Private
export const getCurrentPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId).populate('subscriptionId');
    
    if (user?.plan !== 'Starter' && user?.subscriptionId) {
      const sub = user.subscriptionId as any;
      const now = new Date();

      // Check if expired or cancelled at period end
      if (now > sub.subscriptionEndDate) {
        // Downgrade user
        await User.findByIdAndUpdate(userId, {
          plan: 'Starter',
          subscriptionId: null
        });
        
        await Subscription.findByIdAndUpdate(sub._id, { isActive: false });
        
        return res.status(200).json({
          success: true,
          plan: 'Starter',
          subscription: null
        });
      }
    }

    res.status(200).json({
      success: true,
      plan: user?.plan,
      subscription: user?.subscriptionId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch plan info' });
  }
};

// @desc    Cancel Subscription (Set to expire at period end)
// @route   POST /api/subscription/cancel-plan
// @access  Private
export const cancelPlan = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    const sub = await Subscription.findOne({ userId, isActive: true });
    if (!sub) {
      return res.status(400).json({ success: false, message: 'No active subscription found' });
    }

    sub.cancelAtPeriodEnd = true;
    await sub.save();

    res.status(200).json({ 
      success: true, 
      message: 'Subscription will be cancelled at the end of the current billing period' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation request failed' });
  }
};

// @desc    Request Refund (Allowed only for Yearly within 7 days)
// @route   POST /api/subscription/request-refund
// @access  Private
export const requestRefund = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const sub = await Subscription.findOne({ userId, isActive: true });

    if (!sub) {
      return res.status(400).json({ success: false, message: 'No active subscription found' });
    }

    if (sub.billingType === 'monthly') {
      return res.status(400).json({ success: false, message: 'Monthly plans are non-refundable' });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (sub.subscriptionStartDate < sevenDaysAgo) {
      return res.status(400).json({ success: false, message: 'Refund period (7 days) has expired' });
    }

    sub.refundRequested = true;
    await sub.save();

    res.status(200).json({ 
      success: true, 
      message: 'Refund request submitted. Our team will review it within 5-7 working days.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Refund request failed' });
  }
};

// @desc    Get Payment History
// @route   GET /api/subscription/payment-history
// @access  Private
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const history = await Subscription.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment history' });
  }
};
// @desc    Log Business Inquiry
// @route   POST /api/subscription/business-inquiry
// @access  Private
export const logBusinessInquiry = async (req: Request, res: Response) => {
  try {
    const { ownerName, shopName, contactNumber, email, query } = req.body;
    const userId = (req as any).user._id;

    const inquiry = await BusinessInquiry.create({
      userId,
      ownerName: ownerName || 'N/A',
      shopName: shopName || 'N/A',
      contactNumber: contactNumber || 'N/A',
      email: email || 'N/A',
      query: query || 'N/A'
    });

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log inquiry' });
  }
};
