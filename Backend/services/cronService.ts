import cron from 'node-cron';
import Customer from '../models/Customer.ts';
import User from '../models/User.ts';
import whatsappService from './whatsappService.ts';

/**
 * Daily Payment Reminders Cron Job
 * Runs every day at 10:00 AM
 */
export const initCronJobs = () => {
  console.log('[Cron] Initializing scheduled tasks...');

  // 10:00 AM Daily
  cron.schedule('0 10 * * *', async () => {
    console.log('[Cron] Running daily payment reminders...');
    
    try {
      // 1. Find all users on 'Business' plan (Automation is a premium feature)
      const businessUsers = await User.find({ plan: 'Business' });
      const businessUserIds = businessUsers.map(u => u._id);

      // 2. Find customers with high balance (> 5000) or overdue status
      const customersToRemind = await Customer.find({
        userId: { $in: businessUserIds },
        balance: { $gt: 1000 },
        status: { $in: ['Udhaar', 'Overdue'] },
        isActive: true
      });

      console.log(`[Cron] Found ${customersToRemind.length} customers to remind.`);

      for (const customer of customersToRemind) {
        // To avoid spam, we might check if a reminder was sent recently
        // For now, let's trigger the reminder
        await whatsappService.sendPaymentReminder(
          customer.phone,
          customer.name,
          customer.balance,
          new Date().toLocaleDateString()
        );
        console.log(`[Cron] Reminder sent to ${customer.name} (${customer.phone})`);
      }

    } catch (error) {
      console.error('[Cron Error] Failed to run reminders:', error);
    }
  });

  console.log('[Cron] Tasks scheduled successfully.');
};
