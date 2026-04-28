import express from 'express';
import Voucher from '../models/Voucher.ts';

const router = express.Router();

// GET all vouchers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status && status !== 'All') query.status = status;
    const vouchers = await Voucher.find(query).sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET validate a voucher code
router.get('/validate/:code', async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      code: req.params.code.toUpperCase(),
      status: 'Active',
    });
    if (!voucher) return res.status(404).json({ message: 'Invalid or expired voucher' });
    if (voucher.expiry && new Date(voucher.expiry) < new Date()) {
      return res.status(400).json({ message: 'Voucher has expired' });
    }
    if (voucher.usageCount >= voucher.usageLimit) {
      return res.status(400).json({ message: 'Voucher usage limit reached' });
    }
    res.json({ valid: true, voucher });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single voucher
router.get('/:id', async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Not found' });
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create voucher
router.post('/', async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    const saved = await voucher.save();
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Voucher code already exists' });
    }
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
});

// PUT toggle status (Active/Paused)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Not found' });
    if (voucher.status === 'Expired') {
      return res.status(400).json({ message: 'Cannot toggle expired voucher' });
    }
    voucher.status = voucher.status === 'Active' ? 'Paused' : 'Active';
    await voucher.save();
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// PUT update voucher
router.put('/:id', async (req, res) => {
  try {
    const updated = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// DELETE voucher
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Voucher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Voucher deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
