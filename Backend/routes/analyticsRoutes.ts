import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import LedgerEntry from '../models/LedgerEntry.ts';
import Customer from '../models/Customer.ts';
import Invoice from '../models/Invoice.ts';
import Product from '../models/Product.ts';
import cacheService from '../services/cacheService.ts';
import mongoose from 'mongoose';

const router = express.Router();
router.use(protect);

// GET /api/analytics/pl (Profit & Loss)
router.get('/pl', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { startDate, endDate, shopId } = req.query;
    
    const filter: any = { userId: ownerId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    if (shopId && shopId !== 'all') {
      filter.shopId = shopId;
    }

    const cacheKey = `pl_${ownerId}_${shopId || 'all'}_${startDate || 'start'}_${endDate || 'end'}`;
    const cachedStats = await cacheService.get(cacheKey);
    if (cachedStats) return res.json({ success: true, stats: cachedStats, fromCache: true });

    const entries = await LedgerEntry.find(filter);

    const stats = {
      totalSales: 0,
      totalPurchases: 0,
      totalExpenses: 0,
      netProfit: 0,
      cashIn: 0,
      cashOut: 0
    };

    entries.forEach(entry => {
      if (entry.transactionType === 'Udhaar Diya') stats.totalSales += entry.amount;
      if (entry.transactionType === 'Payment Mila') stats.cashIn += entry.amount;
      if (entry.transactionType === 'Maal Kharida') stats.totalPurchases += entry.amount;
      if (entry.transactionType === 'Payment Diya') stats.cashOut += entry.amount;
    });

    // Calculate GST Liability from Invoices
    const invoices = await Invoice.find({ userId: ownerId, isGST: true, ... (shopId && shopId !== 'all' ? { shopId } : {}) });
    const totalTax = invoices.reduce((sum, inv) => sum + ((inv as any).totalGST || 0), 0);

    // Simple P&L: Sales - Purchases
    stats.netProfit = stats.totalSales - stats.totalPurchases;
    (stats as any).totalTax = totalTax;

    await cacheService.set(cacheKey, stats, 300); // 5 min cache

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Analytics error', error });
  }
});

// GET /api/analytics/recovery (Debt Recovery Dashboard)
router.get('/recovery', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { shopId } = req.query;
    
    const filter: any = { userId: ownerId, balance: { $gt: 0 } };
    if (shopId && shopId !== 'all') {
      filter.shopId = shopId;
    }
    
    const customers = await Customer.find(filter);
    
    const totalOutstanding = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
    
    // Aging analysis
    const aging = {
      '0-15 days': 0,
      '16-30 days': 0,
      '31-60 days': 0,
      '60+ days': 0
    };

    const now = Date.now();
    customers.forEach(c => {
      const lastTx = c.lastTransactionDate ? new Date(c.lastTransactionDate).getTime() : now;
      const days = (now - lastTx) / (1000 * 60 * 60 * 24);
      
      if (days <= 15) aging['0-15 days'] += c.balance;
      else if (days <= 30) aging['16-30 days'] += c.balance;
      else if (days <= 60) aging['31-60 days'] += c.balance;
      else aging['60+ days'] += c.balance;
    });

    res.json({ 
      success: true, 
      totalOutstanding,
      customerCount: customers.length,
      aging 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recovery analytics error', error });
  }
});

// GET /api/analytics/profitability (Customer Profitability)
router.get('/profitability', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { shopId } = req.query;
    
    const match: any = { 
      userId: new mongoose.Types.ObjectId(ownerId), 
      transactionType: 'Udhaar Diya' 
    };
    
    if (shopId && shopId !== 'all') {
      match.shopId = new mongoose.Types.ObjectId(shopId as string);
    }
    
    const profitability = await LedgerEntry.aggregate([
      { $match: match },
      { $group: { 
          _id: '$customerId', 
          totalSales: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
      }},
      { $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
      }},
      { $unwind: '$customer' },
      { $project: {
          name: '$customer.name',
          phone: '$customer.phone',
          totalSales: 1,
          transactionCount: 1
      }},
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, profitability });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Profitability error', error });
  }
});

// GET /api/analytics/trends (Weekly sales vs expenses)
router.get('/trends', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    
    const entries = await LedgerEntry.aggregate([
      { $match: { 
          userId: new mongoose.Types.ObjectId(ownerId),
          date: { $gte: startDate }
      }},
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: { $cond: [{ $eq: ["$transactionType", "Udhaar Diya"] }, "$amount", 0] } },
          expenses: { $sum: { $cond: [{ $eq: ["$transactionType", "Maal Kharida"] }, "$amount", 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);

    const formatted = entries.map(e => ({
      name: new Date(e._id).toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: e.revenue,
      expenses: e.expenses
    }));

    res.json({ success: true, trends: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Trend analytics error', error });
  }
});

// GET /api/analytics/top-products
router.get('/top-products', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { limit = 5 } = req.query;

    const topProducts = await Invoice.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(ownerId), type: 'INVOICE' } },
      { $unwind: '$items' },
      { $group: {
          _id: '$items.name',
          totalQty: { $sum: '$items.qty' },
          totalRevenue: { $sum: '$items.total' },
          category: { $first: '$items.category' } // Note: ensure category is in items if needed
      }},
      { $sort: { totalRevenue: -1 } },
      { $limit: Number(limit) }
    ]);

    res.json({ success: true, topProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Top products error', error });
  }
});

// GET /api/analytics/stock-value
router.get('/stock-value', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { shopId } = req.query;
    
    const filter: any = { userId: ownerId };
    if (shopId && shopId !== 'all') {
      filter.shopId = shopId;
    }
    
    const products = await Product.find(filter);
    
    let totalStockValue = 0;
    let totalStockQty = 0;
    let lowStockCount = 0;
    
    products.forEach(p => {
      // Logic: CostPrice * Stock. If costPrice missing, use 70% of Price
      const cost = p.costPrice || (p.price * 0.7);
      totalStockValue += (p.stock || 0) * cost;
      totalStockQty += (p.stock || 0);
      if (p.stock <= (p.minStock || 5)) lowStockCount++;
    });
    
    res.json({ 
      success: true, 
      totalStockValue, 
      totalStockQty, 
      lowStockCount,
      productCount: products.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stock value analysis error', error });
  }
});

export default router;
