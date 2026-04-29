import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';
import whatsappService from '../services/whatsappService.ts';

/**
 * Automator for WhatsApp Reminders
 * Checks every hour for reminders that are due today and match the preferred time
 */
export const initReminderScheduler = () => {
  console.log('⏰ WhatsApp Reminder Scheduler Initialized...');

  // Run every hour at the top of the hour
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Checking for scheduled WhatsApp reminders...');
    
    try {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Find all active reminders where nextReminderDate is today or past
      const dueReminders = await Reminder.find({
        isActive: true,
        nextReminderDate: { $lte: now },
        status: { $in: ['pending', 'sent'] }
      }).populate('userId');

      for (const reminder of dueReminders) {
        // Check if preferred time matches current hour (Simplified logic)
        // Preferred time format example: "10:00 AM" -> Convert to 24h hour
        const [timePart, ampm] = reminder.preferredTime.split(' ');
        let [prefHour] = timePart.split(':').map(Number);
        
        if (ampm === 'PM' && prefHour < 12) prefHour += 12;
        if (ampm === 'AM' && prefHour === 12) prefHour = 0;

        if (prefHour === currentHour) {
          await triggerReminderSend(reminder);
        }
      }
    } catch (error) {
      console.error('❌ Scheduler Error:', error);
    }
  });

  // Daily Overdue Reminders (Runs at 11:00 AM)
  cron.schedule('0 11 * * *', async () => {
    console.log('📢 Running daily overdue payment reminders...');
    try {
      const businessUsers = await User.find({ plan: 'Business' });
      const businessUserIds = businessUsers.map(u => u._id);

      const Customer = (await import('../models/Customer.ts')).default;
      const customersToRemind = await Customer.find({
        userId: { $in: businessUserIds },
        balance: { $gt: 2000 },
        status: 'Overdue',
        isActive: true
      });

      console.log(`[Cron] Found ${customersToRemind.length} overdue customers.`);

      for (const customer of customersToRemind) {
        await whatsappService.sendPaymentReminder(
          customer.phone,
          customer.name,
          customer.balance,
          new Date().toLocaleDateString()
        );
      }
    } catch (error) {
      console.error('❌ Daily Reminder Cron Error:', error);
    }
  });
};

const triggerReminderSend = async (reminder: any) => {
  try {
    const user = reminder.userId;
    if (!user) return;

    // Build message
    const message = reminder.messageTemplate
      .replace('{{CustomerName}}', reminder.customerName || 'Customer')
      .replace('{{Amount}}', reminder.pendingAmount.toString())
      .replace('{{InvoiceNumber}}', reminder.invoiceNumber || 'N/A')
      .replace('{{BusinessName}}', user.businessName || 'DukanDost Partner');

    console.log(`[AUTO-REACH] Sending WhatsApp to ${reminder.mobileNumber} for ${user.businessName}`);
    
    // Call actual WhatsApp Business API
    await whatsappService.sendTextMessage(reminder.mobileNumber, message);

    // Update reminder status
    reminder.lastSentDate = new Date();
    reminder.history.push({
      sentAt: new Date(),
      status: 'sent',
      message: message
    });

    // Calculate next date
    if (reminder.repeatFrequency !== 'One Time') {
      const next = new Date();
      if (reminder.repeatFrequency === 'Daily') next.setDate(next.getDate() + 1);
      if (reminder.repeatFrequency === 'Weekly') next.setDate(next.getDate() + 7);
      if (reminder.repeatFrequency === 'Monthly') next.setMonth(next.getMonth() + 1);
      reminder.nextReminderDate = next;
      reminder.status = 'sent';
    } else {
      reminder.status = 'completed';
      reminder.isActive = false;
    }

    await reminder.save();
  } catch (error) {
    console.error(`❌ Failed to send auto reminder ${reminder._id}:`, error);
  }
};
