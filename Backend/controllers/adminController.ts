import { Request, Response } from 'express';
import User from '../models/User';
import Subscription from '../models/Subscription';
import BusinessInquiry from '../models/BusinessInquiry';
import Transaction from '../models/Transaction';
import SupportTicket from '../models/SupportTicket';
import PlatformSettings from '../models/PlatformSettings';
import Reminder from '../models/Reminder';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const starterUsers = await User.countDocuments({ plan: 'Starter' });
    const proUsers = await User.countDocuments({ plan: 'Pro' });
    const businessUsers = await User.countDocuments({ plan: 'Business' });

    // Revenue calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRevenue = await Subscription.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = await Subscription.aggregate([
      { $match: { createdAt: { $gte: todayStart }, paymentStatus: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const failedPayments = await Subscription.countDocuments({ paymentStatus: 'failed' });
    const pendingInquiries = await BusinessInquiry.countDocuments({ status: 'pending' });

    // Reminder stats
    const totalRemindersSent = await Reminder.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.status': 'sent' } },
      { $count: 'total' }
    ]);

    const failedReminders = await Reminder.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.status': 'failed' } },
      { $count: 'total' }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        starterUsers,
        proUsers,
        businessUsers,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        failedPayments,
        pendingInquiries,
        totalRemindersSent: totalRemindersSent[0]?.total || 0,
        failedReminders: failedReminders[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, plan, status } = req.query;
    let query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (plan && plan !== 'all') query.plan = plan;

    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getBusinessInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await BusinessInquiry.find().populate('userId', 'fullName businessName email phone').sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await BusinessInquiry.findByIdAndUpdate(id, { status });
    res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

export const getPaymentLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Subscription.find().populate('userId', 'fullName businessName').sort({ createdAt: -1 });
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment logs' });
  }
};

export const updateUserPlanManually = async (req: Request, res: Response) => {
  try {
    const { userId, plan, durationMonths } = req.body;
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (durationMonths || 1));

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sub = await Subscription.create({
      userId,
      planName: plan,
      amount: 0,
      billingType: 'manual',
      paymentStatus: 'captured',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: endDate,
      isActive: true,
      orderId: 'manual_' + Date.now()
    });

    user.plan = plan;
    user.subscriptionId = sub._id as any;
    await user.save();

    res.status(200).json({ success: true, message: 'Plan updated manually' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await SupportTicket.find().populate('userId', 'fullName businessName').sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await SupportTicket.findByIdAndUpdate(id, { status });
    res.status(200).json({ success: true, message: 'Ticket updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ticket' });
  }
};

export const getPlatformSettings = async (req: Request, res: Response) => {
  try {
    const settings = await (PlatformSettings as any).getSettings();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

export const updatePlatformSettings = async (req: Request, res: Response) => {
  try {
    const settings = await (PlatformSettings as any).getSettings();
    const { general, email, security } = req.body;

    if (general) settings.general = { ...settings.general, ...general };
    if (email) settings.email = { ...settings.email, ...email };
    if (security) settings.security = { ...settings.security, ...security };

    await settings.save();
    res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, businessName, phone, plan, role, status } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, {
      fullName,
      email,
      businessName,
      phone,
      plan,
      role,
      status
    }, { new: true }).select('-password');

    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await User.findByIdAndDelete(id);
    
    // Cleanup related data if necessary (e.g. transactions, customers)
    // For now, just delete the user
    
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const testEmailConnection = async (req: Request, res: Response) => {
  // Mock test for now
  res.status(200).json({ success: true, message: 'SMTP Connection Successful (Mock)' });
};

