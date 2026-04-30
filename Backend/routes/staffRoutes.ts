import express from 'express';
import Staff from '../models/Staff.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/staff
router.get('/', async (req: any, res) => {
  try {
    const userId = req.ownerId;
    const staff = await Staff.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// POST /api/staff
router.post('/', async (req: any, res) => {
  try {
    const userId = req.ownerId;
    const staffMember = await Staff.create({ ...req.body, userId });
    res.status(201).json({ success: true, staff: staffMember });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/staff/:id/attendance
router.patch('/:id/attendance', async (req: any, res) => {
  try {
    const userId = req.ownerId;
    const { attendance } = req.body;
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.id, userId },
      { attendance },
      { new: true }
    );
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Update failed' });
  }
});

export default router;
