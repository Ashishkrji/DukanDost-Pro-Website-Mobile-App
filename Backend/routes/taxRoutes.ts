import express from 'express';
import Invoice from '../models/Invoice.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/tax/gstr-1
router.get('/gstr-1', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const invoices = await Invoice.find({
      userId,
      isGST: true,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Grouping by Tax Slab for GSTR-1
    const b2b: any[] = [];
    const b2c: any[] = [];

    invoices.forEach(inv => {
      const data = {
        invoiceNo: inv.invoiceNumber,
        date: inv.createdAt,
        totalValue: inv.total,
        taxableValue: inv.subtotal,
        igst: inv.totalGST, // Simplification: assuming all IGST for now or splitting CGST/SGST 50-50
        cgst: inv.totalGST / 2,
        sgst: inv.totalGST / 2,
        customerName: inv.customerName,
        customerGSTIN: inv.customerGSTIN
      };

      if (inv.customerGSTIN) b2b.push(data);
      else b2c.push(data);
    });

    res.json({ success: true, month, year, b2b, b2c });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// GET /api/tax/gstr-3b
router.get('/gstr-3b', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const invoices = await Invoice.find({
      userId,
      isGST: true,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const summary = invoices.reduce((acc, inv) => {
      acc.totalTaxableValue += inv.subtotal;
      acc.totalIGST += inv.totalGST;
      acc.totalCGST += inv.totalGST / 2;
      acc.totalSGST += inv.totalGST / 2;
      return acc;
    }, { totalTaxableValue: 0, totalIGST: 0, totalCGST: 0, totalSGST: 0 });

    res.json({ success: true, month, year, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

export default router;
