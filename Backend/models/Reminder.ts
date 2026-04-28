import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: String,
  mobileNumber: {
    type: String,
    required: true
  },
  pendingAmount: {
    type: Number,
    required: true
  },
  invoiceNumber: String,
  reminderType: {
    type: String,
    enum: [
      'Payment Due Reminder',
      'Overdue Payment Reminder',
      'Monthly Collection Reminder',
      'Invoice Reminder',
      'Follow-up Reminder'
    ],
    default: 'Payment Due Reminder'
  },
  sendAfterDays: {
    type: Number,
    default: 3
  },
  repeatFrequency: {
    type: String,
    enum: ['One Time', 'Daily', 'Weekly', 'Monthly'],
    default: 'One Time'
  },
  preferredTime: {
    type: String,
    default: '10:00 AM'
  },
  messageTemplate: {
    type: String,
    required: true
  },
  nextReminderDate: {
    type: Date,
    required: true
  },
  lastSentDate: Date,
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'paused', 'completed'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stopCondition: {
    type: String,
    enum: ['Until payment received', 'Fixed number of reminders', 'Manual stop'],
    default: 'Until payment received'
  },
  history: [{
    sentAt: Date,
    status: String,
    message: String,
    error: String
  }]
}, { timestamps: true });

export default mongoose.model('Reminder', ReminderSchema);
