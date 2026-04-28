import { Request, Response } from 'express';
import Reminder from '../models/Reminder.js';
import Customer from '../models/Customer.js';

// @desc    Create a new reminder
// @route   POST /api/reminders/create
// @access  Private
export const createReminder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { 
      customerId, 
      customerName, 
      mobileNumber, 
      pendingAmount, 
      invoiceNumber,
      reminderType,
      sendAfterDays,
      repeatFrequency,
      preferredTime,
      messageTemplate,
      stopCondition
    } = req.body;

    // Calculate initial nextReminderDate
    const nextReminderDate = new Date();
    nextReminderDate.setDate(nextReminderDate.getDate() + (sendAfterDays || 0));

    const reminder = await Reminder.create({
      userId,
      customerId,
      customerName,
      mobileNumber,
      pendingAmount,
      invoiceNumber,
      reminderType,
      sendAfterDays,
      repeatFrequency,
      preferredTime,
      messageTemplate,
      nextReminderDate,
      stopCondition,
      isActive: true
    });

    res.status(201).json({ success: true, reminder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reminders for a user
// @route   GET /api/reminders/all
// @access  Private
export const getReminders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const reminders = await Reminder.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reminders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a reminder
// @route   PUT /api/reminders/update/:id
// @access  Private
export const updateReminder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const reminderId = req.params.id;

    const updated = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Reminder not found' });

    res.status(200).json({ success: true, reminder: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/delete/:id
// @access  Private
export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, userId });

    if (!deleted) return res.status(404).json({ success: false, message: 'Reminder not found' });

    res.status(200).json({ success: true, message: 'Reminder deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send reminder now (manual override)
// @route   POST /api/reminders/send-now/:id
// @access  Private
export const sendReminderNow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId });

    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });

    // Mock WhatsApp Sending Logic
    // In future, this will call Meta WhatsApp Business API
    const message = reminder.messageTemplate
      .replace('{{CustomerName}}', reminder.customerName || 'Customer')
      .replace('{{Amount}}', reminder.pendingAmount.toString())
      .replace('{{InvoiceNumber}}', reminder.invoiceNumber || 'N/A')
      .replace('{{BusinessName}}', (req as any).user.businessName || 'DukanDost Partner');

    console.log(`[WhatsApp API MOCK] Sending to ${reminder.mobileNumber}: ${message}`);

    // Update history
    reminder.lastSentDate = new Date();
    reminder.history.push({
      sentAt: new Date(),
      status: 'sent',
      message: message
    });

    // Update next reminder date if repeating
    if (reminder.repeatFrequency !== 'One Time') {
      const next = new Date();
      if (reminder.repeatFrequency === 'Daily') next.setDate(next.getDate() + 1);
      if (reminder.repeatFrequency === 'Weekly') next.setDate(next.getDate() + 7);
      if (reminder.repeatFrequency === 'Monthly') next.setMonth(next.getMonth() + 1);
      reminder.nextReminderDate = next;
    } else {
      reminder.status = 'completed';
      reminder.isActive = false;
    }

    await reminder.save();

    res.status(200).json({ success: true, message: 'Reminder sent successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pause/Resume reminder
// @route   POST /api/reminders/toggle/:id
// @access  Private
export const toggleReminder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId });

    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });

    reminder.isActive = !reminder.isActive;
    reminder.status = reminder.isActive ? 'pending' : 'paused';
    
    await reminder.save();

    res.status(200).json({ success: true, isActive: reminder.isActive });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
