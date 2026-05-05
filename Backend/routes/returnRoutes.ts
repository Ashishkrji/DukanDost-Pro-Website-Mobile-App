import express from 'express';
import CreditDebitNote from '../models/CreditDebitNote.ts';
import Customer from '../models/Customer.ts';
import Vendor from '../models/Vendor.ts';
import Product from '../models/Product.ts';
import Inventory from '../models/Inventory.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();
router.use(protect);

// GET all notes
router.get('/', async (req: any, res) => {
  try {
    const notes = await CreditDebitNote.find({ userId: req.user.id })
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// POST create note
router.post('/create', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { type, customerId, vendorId, items, reason, totalAmount } = req.body;

    const lastNote = await CreditDebitNote.findOne({ userId, type }).sort({ createdAt: -1 });
    const nextNum = lastNote ? parseInt(lastNote.noteNumber.split('-')[1]) + 1 : 1001;
    const noteNumber = `${type === 'CREDIT' ? 'CN' : 'DN'}-${nextNum}`;

    const note = await CreditDebitNote.create({
      userId,
      noteNumber,
      type,
      customerId,
      vendorId,
      items,
      reason,
      subtotal: totalAmount, // Simplification for now
      totalAmount
    });

    // Update Balances & Inventory
    if (type === 'CREDIT' && customerId) {
      await Customer.findByIdAndUpdate(customerId, { $inc: { balance: -totalAmount } });
      // Restock items
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
        await Inventory.create({
          userId,
          productId: item.productId,
          type: 'RETURN',
          quantity: item.quantity,
          notes: `Sales Return: ${noteNumber}`
        });
      }
    } else if (type === 'DEBIT' && vendorId) {
      await Vendor.findByIdAndUpdate(vendorId, { $inc: { balance: -totalAmount } });
      // Remove stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        await Inventory.create({
          userId,
          productId: item.productId,
          type: 'ADJUSTMENT',
          quantity: -item.quantity,
          notes: `Purchase Return: ${noteNumber}`
        });
      }
    }

    res.status(201).json({ success: true, note });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
