import express from 'express';
import Invoice from '../models/Invoice.ts';
import Customer from '../models/Customer.ts';
import Product from '../models/Product.ts';
import { checkFeatureAccess } from '../middleware/planMiddleware';

const router = express.Router();

// GET all invoices
router.get('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { status, customerId, search } = req.query;
    const query: any = { userId: ownerId };
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
router.get('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId }).populate('customerId');
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create invoice
router.post('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { customerId, items, discount = 0, dueDate, notes, isGST } = req.body;

    // Plan check for GST
    if (isGST) {
      const userPlan = req.user?.plan || 'Starter';
      if (userPlan === 'Starter') {
        return res.status(403).json({
          success: false,
          message: 'GST Billing is a Pro feature. Please upgrade to unlock.',
          requiredPlan: 'Pro'
        });
      }
    }

    const customer = await Customer.findOne({ _id: customerId, userId: ownerId });

    // Calculate totals
    let subtotal = 0;
    let totalGST = 0;
    const processedItems = (items || []).map((item: any) => {
      const lineTotal = Number(item.qty) * Number(item.price);
      const gstAmount = (lineTotal * (Number(item.gstRate) || 0)) / 100;
      subtotal += lineTotal;
      totalGST += gstAmount;
      return { ...item, gstAmount, total: lineTotal + gstAmount };
    });

    const total = subtotal + totalGST - Number(discount);

    const invoice = new Invoice({
      userId: ownerId,
      customerId,
      customerName: customer?.name || req.body.customerName,
      customerPhone: customer?.phone || req.body.customerPhone,
      customerGSTIN: customer?.gstNumber,
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

    // Deduct Stock from Inventory
    for (const item of items) {
      if (item.productId) {
        await Product.findOneAndUpdate(
          { _id: item.productId, userId: ownerId },
          { $inc: { stock: -Number(item.qty) } }
        );
      }
    }

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
router.put('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { status } = req.body;
    const updateData: any = { ...req.body };
    if (status === 'PAID') {
      updateData.paidDate = new Date();
      // Update customer balance
      const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId });
      if (invoice && invoice.status !== 'PAID') {
        await Customer.findOneAndUpdate({ _id: invoice.customerId, userId: ownerId }, {
          $inc: { balance: -invoice.total },
        });
      }
    }
    const updated = await Invoice.findOneAndUpdate({ _id: req.params.id, userId: ownerId }, updateData, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// DELETE invoice
router.delete('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, userId: ownerId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET sharing link/text
router.get('/:id/share', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId }).populate('customerId');
    if (!invoice) return res.status(404).json({ message: 'Not found' });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const shareUrl = `${frontendUrl}/view-invoice/${invoice._id}`;
    
    const message = `Hello ${invoice.customerName}, your invoice ${invoice.invoiceNumber} from DukanDost is ready. Total: ₹${invoice.total}. View it here: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/${invoice.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    res.json({
      success: true,
      message,
      shareUrl,
      whatsappUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;

