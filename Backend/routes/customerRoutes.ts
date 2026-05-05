import express from 'express';
import Customer from '../models/Customer.ts';
import LedgerEntry from '../models/LedgerEntry.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/customers/all
router.get('/all', async (req: any, res) => {
  try {
    const { search, status } = req.query;
    const ownerId = req.ownerId;
    
    const query: any = { userId: ownerId, isActive: { $ne: false } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'All') query.status = status;
    
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const customer = await Customer.findOne({ _id: req.params.id, userId: ownerId });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST /api/customers/create
router.post('/create', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { 
      name, phone, alternateNumber, address, shopName, 
      gstNumber, notes, initialEntry 
    } = req.body;

    const customer = new Customer({
      userId: ownerId,
      name,
      phone,
      alternateNumber,
      address,
      shopName,
      gstNumber,
      notes,
    });

    if (initialEntry && initialEntry.amount > 0) {
      const { transactionType, amount, description } = initialEntry;
      
      if (transactionType === 'Udhaar Diya') {
        customer.totalCredit = Number(amount);
        customer.remainingBalance = Number(amount);
        customer.balance = Number(amount);
        customer.status = 'Udhaar';
      } else {
        customer.totalReceived = Number(amount);
        customer.remainingBalance = -Number(amount);
        customer.balance = -Number(amount);
        customer.status = 'Up-to-date';
      }
      
      customer.lastTransactionDate = new Date();
      const savedCustomer = await customer.save();

      // Create ledger entry
      await LedgerEntry.create({
        customerId: savedCustomer._id,
        userId: ownerId,
        transactionType,
        amount,
        notes: description || 'Initial Khata Entry',
        balanceAfterEntry: customer.remainingBalance,
        date: new Date()
      });

      return res.status(201).json({ success: true, customer: savedCustomer });
    }

    const saved = await customer.save();
    res.status(201).json({ success: true, customer: saved });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Phone number already exists for this user' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/customers/update/:id
router.put('/update/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error });
  }
});

// DELETE /api/customers/delete/:id
router.delete('/delete/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId },
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST /api/customers/bulk/remind
router.post('/bulk/remind', async (req: any, res) => {
  const { customerIds } = req.body;
  try {
    const ownerId = req.ownerId;
    const customers = await Customer.find({ _id: { $in: customerIds }, userId: ownerId });
    
    // Simulate sending reminders
    console.log(`Sending bulk reminders to ${customers.length} customers`);
    
    res.json({ success: true, message: `Sent ${customers.length} reminders` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
