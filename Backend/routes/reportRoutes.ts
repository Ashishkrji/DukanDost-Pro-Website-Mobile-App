import express from 'express';
import Invoice from '../models/Invoice';
import Transaction from '../models/Transaction';
import Product from '../models/Product';
import Expense from '../models/Expense';
import { protect } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const router = express.Router();

// 1. Day Book (Combined view of all entries for a date)
router.get('/day-book', protect, async (req: any, res) => {
  const { date } = req.query;
  const start = new Date(date as string);
  start.setHours(0,0,0,0);
  const end = new Date(date as string);
  end.setHours(23,59,59,999);

  try {
    const [invoices, transactions, expenses] = await Promise.all([
      Invoice.find({ userId: req.user._id, createdAt: { $gte: start, $lte: end } }),
      Transaction.find({ userId: req.user._id, createdAt: { $gte: start, $lte: end } }),
      Expense.find({ userId: req.user._id, date: { $gte: start, $lte: end } })
    ]);
    res.json({ invoices, transactions, expenses });
  } catch (error) {
    res.status(500).json({ message: 'Error generating Day Book' });
  }
});

// 2. Item-wise Profit Report
router.get('/item-profit', protect, async (req: any, res) => {
  try {
    const report = await Invoice.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id), type: 'INVOICE', status: 'PAID' } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        totalQty: { $sum: '$items.qty' },
        totalRevenue: { $sum: '$items.total' },
        avgPrice: { $avg: '$items.price' }
      }},
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }},
      { $unwind: '$productDetails' },
      { $project: {
        name: 1,
        totalQty: 1,
        totalRevenue: 1,
        totalCost: { $multiply: ['$totalQty', '$productDetails.costPrice'] },
        profit: { $subtract: ['$totalRevenue', { $multiply: ['$totalQty', '$productDetails.costPrice'] }] }
      }}
    ]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating profit report' });
  }
});

// 3. Cash Flow Summary
router.get('/cash-flow', protect, async (req: any, res) => {
  try {
    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user._id), type: { $in: ['LIYA', 'Liya'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    res.json({ 
      cashIn: income[0]?.total || 0, 
      cashOut: expense[0]?.total || 0,
      net: (income[0]?.total || 0) - (expense[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating cash flow' });
  }
});

import { generateTallyXML } from '../utils/tallyExport';
import CAAccess from '../models/CAAccess';
import crypto from 'crypto';

// 4. Tally Export (L1)
router.get('/export/tally', protect, async (req: any, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id, type: 'INVOICE' }).limit(1000);
    const xml = generateTallyXML(invoices);
    res.set('Content-Type', 'text/xml');
    res.attachment('DukanDost_Tally_Export.xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ message: 'Tally export fail' });
  }
});

// 5. CA Access Management (L2)
router.post('/ca-access', protect, async (req: any, res) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const access = await CAAccess.create({
      userId: req.user._id,
      token,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      accessType: req.body.accessType || 'READ_ONLY',
      notes: req.body.notes
    });
    res.json({ success: true, url: `/ca-portal/${token}`, expiryDate: access.expiryDate });
  } catch (error) {
    res.status(500).json({ message: 'CA link generation failed' });
  }
});

export default router;
