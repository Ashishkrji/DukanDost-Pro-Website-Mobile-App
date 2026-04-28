import { Request, Response } from 'express';
import Notification from '../models/Notification.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    // Fetch notifications meant for this user OR for all users (recipient: null)
    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { recipient: null }
      ],
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const notificationId = req.params.id;

    await Notification.findByIdAndUpdate(notificationId, {
      $addToSet: { readBy: userId }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

// @desc    Create a notification (Admin Only)
// @route   POST /api/admin/notifications
// @access  Private/Admin
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, recipient } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      recipient: recipient || null // null for all users
    });

    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
};

// @desc    Get all notifications (Admin Only)
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};
