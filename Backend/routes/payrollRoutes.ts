import express from 'express';
import SalaryPayment from '../models/SalaryPayment';
import Staff from '../models/Staff';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Get salary history for staff
router.get('/:staffId', protect, async (req: any, res) => {
  try {
    const payments = await SalaryPayment.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching salary history' });
  }
});

// Process salary (Create payment)
router.post('/pay', protect, async (req: any, res) => {
  const { staffId, month, year, paymentMode } = req.body;
  try {
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // Simple calculation: Net = Basic + Allowances - Deductions
    const netPaid = (staff.salaryComponents?.basic || staff.salary) + 
                    (staff.salaryComponents?.allowances || 0) - 
                    (staff.salaryComponents?.deductions || 0);

    const payment = await SalaryPayment.create({
      staffId,
      userId: req.user._id,
      month,
      year,
      baseSalary: staff.salary,
      allowances: staff.salaryComponents?.allowances || 0,
      deductions: staff.salaryComponents?.deductions || 0,
      netPaid,
      paymentMode,
      status: 'PAID'
    });

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error processing salary' });
  }
});

export default router;
