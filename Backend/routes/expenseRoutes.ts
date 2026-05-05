import express from 'express';
import Expense from '../models/Expense.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/expenses
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category } = req.query;
    
    let query: any = { userId };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST /api/expenses
router.post('/create', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { amount, category, paymentMethod, notes, date } = req.body;

    const expense = await Expense.create({
      userId,
      amount,
      category,
      paymentMethod,
      notes,
      date: date || new Date()
    });

    res.status(201).json({ success: true, expense });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

export default router;
