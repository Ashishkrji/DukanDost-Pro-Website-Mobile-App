import express from 'express';
import Customer from '../models/Customer.ts';
import Vendor from '../models/Vendor.ts';
import LedgerEntry from '../models/LedgerEntry.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// POST /api/ledger/create
router.post('/create', async (req: any, res) => {
  try {
    const { customerId, vendorId, transactionType, amount, paymentMethod, notes, date } = req.body;
    const userId = req.user.id;

    if (!customerId && !vendorId) {
      return res.status(400).json({ success: false, message: 'Either customerId or vendorId is required' });
    }

    let balanceAfterEntry = 0;
    let target: any;

    if (customerId) {
      target = await Customer.findOne({ _id: customerId, userId });
      if (!target) return res.status(404).json({ success: false, message: 'Customer not found' });
      
      balanceAfterEntry = target.remainingBalance || 0;
      if (transactionType === 'Udhaar Diya') {
        balanceAfterEntry += Number(amount);
        target.totalCredit = (target.totalCredit || 0) + Number(amount);
      } else if (transactionType === 'Payment Mila') {
        balanceAfterEntry -= Number(amount);
        target.totalReceived = (target.totalReceived || 0) + Number(amount);
      }
      target.remainingBalance = balanceAfterEntry;
      target.balance = balanceAfterEntry;
      if (balanceAfterEntry === 0) target.status = 'Up-to-date';
      else if (balanceAfterEntry > 0) target.status = 'Udhaar';
    } else {
      target = await Vendor.findOne({ _id: vendorId, userId });
      if (!target) return res.status(404).json({ success: false, message: 'Vendor not found' });
      
      balanceAfterEntry = target.balance || 0;
      if (transactionType === 'Maal Kharida') {
        balanceAfterEntry += Number(amount);
        target.totalPurchased = (target.totalPurchased || 0) + Number(amount);
      } else if (transactionType === 'Payment Diya') {
        balanceAfterEntry -= Number(amount);
        target.totalPaid = (target.totalPaid || 0) + Number(amount);
      }
      target.balance = balanceAfterEntry;
    }

    const entry = await LedgerEntry.create({
      customerId,
      vendorId,
      userId,
      transactionType,
      amount,
      paymentMethod,
      notes,
      balanceAfterEntry,
      date: date || new Date()
    });

    if (customerId) target.lastTransactionDate = entry.date;
    await target.save();

    // Automated Balance Sharing (M11)
    if (customerId && req.body.shareOnWhatsApp) {
      console.log(`[WhatsApp] To: ${target.phone} - "Aapka naya balance ₹${balanceAfterEntry} hai. Team DukanDost"`);
    }

    res.status(201).json({ success: true, entry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/ledger/history
router.get('/history', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { customerId, vendorId } = req.query;

    const query: any = { userId };
    if (customerId) query.customerId = customerId;
    if (vendorId) query.vendorId = vendorId;

    if (!customerId && !vendorId) {
      return res.status(400).json({ success: false, message: 'Either customerId or vendorId is required' });
    }

    const entries = await LedgerEntry.find(query).sort({ date: -1 });
    res.json({ success: true, entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
