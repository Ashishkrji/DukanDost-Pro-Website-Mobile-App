import express from 'express';
import Staff from '../models/Staff.ts';

const router = express.Router();

// GET all staff
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query: any = {};
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
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create staff
router.post('/', async (req, res) => {
  try {
    const member = new Staff(req.body);
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// PUT update staff
router.put('/:id', async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// POST mark attendance for a staff member
router.post('/:id/attendance', async (req, res) => {
  try {
    const { date, status, note, checkinTime, checkoutTime } = req.body;
    const member = await Staff.findByIdAndUpdate(
      req.params.id,
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
    const { month, amount, mode } = req.body;
    const member = await Staff.findByIdAndUpdate(
      req.params.id,
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
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
