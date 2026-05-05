import express from 'express';
import Transaction from '../models/Transaction.ts';
import Customer from '../models/Customer.ts';
import Reminder from '../models/Reminder.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();
router.use(protect);

// GET all transactions (with optional filters)
router.get('/', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { customerId, type, limit = 50 } = req.query;
    const query: any = { userId: ownerId, isDeleted: { $ne: true } };
    if (customerId) query.customerId = customerId;
    if (type) query.type = type;
    const txns = await Transaction.find(query)
      .populate('customerId', 'name phone initials color')
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json({ success: true, transactions: txns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// GET single transaction
router.get('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const txn = await Transaction.findOne({ _id: req.params.id, userId: ownerId }).populate('customerId');
    if (!txn) return res.status(404).json({ message: 'Not found' });
    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create transaction + update customer balance
router.post('/', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { customerId, type, amount, note, paymentMode } = req.body;

    const txn = new Transaction({ userId: ownerId, customerId, type, amount, note, paymentMode });
    const saved = await txn.save();

    // Update customer balance + lastTransactionDate + status
    const customer = await Customer.findOne({ _id: customerId, userId: ownerId });
    if (customer) {
      if (type === 'DIYA') {
        customer.balance = (customer.balance || 0) + Number(amount);
      } else if (type === 'LIYA') {
        customer.balance = Math.max(0, (customer.balance || 0) - Number(amount));
      }
      customer.lastTransactionDate = new Date();
      // Auto update status
      if (customer.balance === 0) {
        customer.status = 'Up-to-date';
        // Auto-stop any active reminders for this customer
        await Reminder.updateMany(
          { customerId, userId: ownerId, isActive: true, stopCondition: 'Until payment received' },
          { isActive: false, status: 'completed' }
        );
      } else {
        const daysSinceLastTxn = customer.lastTransactionDate
          ? (Date.now() - new Date(customer.lastTransactionDate).getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        customer.status = daysSinceLastTxn > 30 ? 'Overdue' : 'Udhaar';
      }
      await customer.save();

      // Auto Balance Share Simulation (#7)
      if (customer.phone) {
        console.log(`[WhatsApp Share] To: ${customer.phone}, Message: Aapka naya balance ₹${customer.balance} hai. - DukanDost Pro`);
      }
    }

    res.status(201).json({ ...saved.toObject(), whatsappShared: true });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// POST add a note to a transaction
router.post('/:id/notes', async (req, res) => {
  try {
    const { text, addedBy } = req.body;
    const ownerId = req.ownerId;
    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId },
      { $push: { notes: { text, addedBy: addedBy || 'Owner', addedAt: new Date() } } },
      { new: true }
    );
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// DELETE transaction (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    await Transaction.findOneAndUpdate({ _id: req.params.id, userId: ownerId }, { isDeleted: true });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
