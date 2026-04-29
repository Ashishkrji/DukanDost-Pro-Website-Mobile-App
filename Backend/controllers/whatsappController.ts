import { Request, Response } from 'express';
import whatsappService from '../services/whatsappService.ts';
import Customer from '../models/Customer.ts';

export const sendReminder = async (req: any, res: Response) => {
  try {
    const { customerId } = req.body;
    const customer = await Customer.findOne({ _id: customerId, userId: req.ownerId });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Trigger reminder
    const result = await whatsappService.sendPaymentReminder(
      customer.phone,
      customer.name,
      customer.balance,
      new Date().toLocaleDateString()
    );

    if (result.success) {
      res.json({ success: true, message: 'Reminder sent on WhatsApp!' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send WhatsApp', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
