import express from 'express';
import Invoice from '../models/Invoice.ts';
import Customer from '../models/Customer.ts';
import { checkFeatureAccess } from '../middleware/planMiddleware';

const router = express.Router();

// GET all invoices
// GET all invoices
router.get('/', async (req, res) => {
  try {
    const { status, customerId, search } = req.query;
    const query: any = {};
    if (status && status !== 'All') query.status = status;
    if (customerId) query.customerId = customerId;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];
    }
    const invoices = await Invoice.find(query)
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customerId');
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create invoice
router.post('/', async (req, res) => {
  try {
    const { customerId, items, discount = 0, dueDate, notes, isGST } = req.body;

    // Plan check for GST
    if (isGST) {
      const userPlan = (req as any).user?.plan || 'Starter';
      if (userPlan === 'Starter') {
        return res.status(403).json({
          success: false,
          message: 'GST Billing is a Pro feature. Please upgrade to unlock.',
          requiredPlan: 'Pro'
        });
      }
    }

    const customer = await Customer.findById(customerId);

    // Calculate totals
    let subtotal = 0;
    let totalGST = 0;
    const processedItems = (items || []).map((item: any) => {
      const lineTotal = item.qty * item.price;
      const gstAmount = (lineTotal * (item.gstRate || 0)) / 100;
      subtotal += lineTotal;
      totalGST += gstAmount;
      return { ...item, gstAmount, total: lineTotal + gstAmount };
    });

    const total = subtotal + totalGST - discount;

    const invoice = new Invoice({
      customerId,
      customerName: customer?.name || req.body.customerName,
      customerPhone: customer?.phone || req.body.customerPhone,
      customerGSTIN: customer?.gstin,
      items: processedItems,
      subtotal,
      totalGST,
      total,
      discount,
      dueDate,
      notes,
      isGST,
    });
    const saved = await invoice.save();

    // Update customer balance (invoice adds to what they owe)
    if (customer) {
      customer.balance = (customer.balance || 0) + total;
      if (customer.balance > 0) {
        customer.status = 'Udhaar';
      }
      await customer.save();
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// PUT update invoice status (mark paid, overdue, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updateData: any = { ...req.body };
    if (status === 'PAID') {
      updateData.paidDate = new Date();
      // Update customer balance
      const invoice = await Invoice.findById(req.params.id);
      if (invoice && invoice.status !== 'PAID') {
        await Customer.findByIdAndUpdate(invoice.customerId, {
          $inc: { balance: -invoice.total },
        });
      }
    }
    const updated = await Invoice.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
