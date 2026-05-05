import { Request, Response } from 'express';
import Customer from '../models/Customer.ts';

// @desc    Send a reminder to a single customer
export const sendReminder = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;
    const customer = await Customer.findById(customerId);
    
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    // In a real app, integrate with WhatsApp Business API (Twilio/Meta)
    // For now, simulate success
    console.log(`[WhatsApp] Sending reminder to ${customer.phone}: Balance ₹${customer.balance}`);
    
    res.json({ success: true, message: 'Reminder sent to WhatsApp' });
  } catch (error) {
    res.status(500).json({ message: 'WhatsApp integration error' });
  }
};

// @desc    Send bulk messages to all active customers
export const sendBulkMessages = async (req: any, res: Response) => {
  try {
    const ownerId = req.ownerId;
    const { message, shopId } = req.body;
    
    const filter: any = { userId: ownerId, isActive: true };
    if (shopId && shopId !== 'all') filter.shopId = shopId;

    const customers = await Customer.find(filter);
    
    if (customers.length === 0) {
      return res.status(400).json({ success: false, message: 'No active customers found' });
    }

    // Simulate bulk sending
    console.log(`[WhatsApp Bulk] Sending to ${customers.length} customers from Shop ${shopId || 'Default'}`);
    console.log(`[WhatsApp Bulk] Message: ${message}`);

    // Here we would loop and call API or use a bulk endpoint
    // To avoid timeouts, in production use a background worker (BullMQ/Redis)

    res.json({ 
      success: true, 
      message: `Campaign started! Message being sent to ${customers.length} customers.`,
      count: customers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bulk messaging failed' });
  }
};
