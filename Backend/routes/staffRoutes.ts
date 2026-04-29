import express from 'express';
import Staff from '../models/Staff.ts';
import User from '../models/User.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { canAddStaff } from '../utils/planUtils.ts';
import bcrypt from 'bcryptjs';

const router = express.Router();
router.use(protect);

// GET all staff
router.get('/', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { status } = req.query;
    const query: any = { userId: ownerId };
    if (status) query.status = status;
    const staff = await Staff.find(query).sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single staff
router.get('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const member = await Staff.findOne({ _id: req.params.id, userId: ownerId });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create staff
router.post('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { email, hasAppAccess, name, phone, role } = req.body;

    if (hasAppAccess) {
      if (!email) return res.status(400).json({ message: 'Email required for App Access' });
      
      const owner = req.user;
      const canAdd = await canAddStaff(ownerId, owner.plan);
      if (!canAdd) {
        return res.status(403).json({ 
          message: `Staff limit reached for your ${owner.plan} plan. Upgrade to Business for unlimited staff.` 
        });
      }

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'A user with this email already exists' });

      // Create User record for login
      const tempPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        fullName: name,
        email,
        password: tempPassword, // In production, send invite email
        phone,
        role: 'staff',
        parentId: ownerId,
        businessName: owner.businessName,
        plan: owner.plan,
      });

      console.log(`Created staff user: ${email} with temp password: ${tempPassword}`);
    }

    const member = new Staff({ ...req.body, userId: ownerId });
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const updated = await Staff.findOneAndUpdate(
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

// POST mark attendance for a staff member
router.post('/:id/attendance', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { date, status, note, checkinTime, checkoutTime } = req.body;
    const member = await Staff.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId },
      {
        $push: {
          attendance: {
            date: date || new Date(),
            status: status || 'PRESENT',
            note,
            checkinTime,
            checkoutTime,
          },
        },
      },
      { new: true }
    );
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST mark salary paid
router.post('/:id/salary', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const { month, amount, mode } = req.body;
    const member = await Staff.findOneAndUpdate(
      { _id: req.params.id, userId: ownerId },
      {
        $push: {
          salaryHistory: {
            month,
            amount,
            paidDate: new Date(),
            isPaid: true,
            mode: mode || 'CASH',
          },
        },
      },
      { new: true }
    );
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
  try {
    const ownerId = req.ownerId;
    const deleted = await Staff.findOneAndDelete({ _id: req.params.id, userId: ownerId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
