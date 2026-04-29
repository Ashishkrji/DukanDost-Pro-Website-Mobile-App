import express from 'express';
import Vendor from '../models/Vendor.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/vendors/all
router.get('/all', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const vendors = await Vendor.find({ userId, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST /api/vendors/create
router.post('/create', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, address, gstNumber } = req.body;

    const vendor = await Vendor.create({
      userId,
      name,
      phone,
      email,
      address,
      gstNumber
    });

    res.status(201).json({ success: true, vendor });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Phone number already exists for this user' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/vendors/update/:id
router.put('/update/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const updated = await Vendor.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, vendor: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error });
  }
});

// DELETE /api/vendors/delete/:id
router.delete('/delete/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const updated = await Vendor.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

export default router;
