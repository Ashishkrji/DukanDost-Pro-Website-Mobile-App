import express from 'express';
import Customer from '../models/Customer.ts';
import Transaction from '../models/Transaction.ts';
import { calculateCreditScore } from '../utils/creditScore.ts';

const router = express.Router();

// GET all customers (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const query: any = { isActive: { $ne: false } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'All') query.status = status;
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET credit score
router.get('/:id/credit-score', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const txns = await Transaction.find({ customerId: customer._id, isDeleted: { $ne: true } });
    const result = calculateCreditScore(customer, txns);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET customer transactions
router.get('/:id/transactions', async (req, res) => {
  try {
    const txns = await Transaction.find({
      customerId: req.params.id,
      isDeleted: { $ne: true },
    }).sort({ date: -1 });
    res.json(txns);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Phone number already exists' });
    }
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Customer not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// DELETE customer (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST bulk WhatsApp reminders (simulated)
router.post('/bulk/remind', async (req, res) => {
  try {
    const { customerIds } = req.body;
    // In production: integrate with WhatsApp Business API
    res.json({
      message: `Reminders sent to ${customerIds?.length || 0} customers`,
      sent: customerIds,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
