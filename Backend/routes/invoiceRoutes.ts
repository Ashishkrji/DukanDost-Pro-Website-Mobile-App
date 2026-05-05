import express from 'express';
import Invoice from '../models/Invoice.ts';
import Customer from '../models/Customer.ts';
import Product from '../models/Product.ts';
import { checkFeatureAccess } from '../middleware/planMiddleware';

const router = express.Router();

// GET all documents by type
router.get('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { status, customerId, vendorId, search, type = 'INVOICE' } = req.query;
    const query: any = { userId: ownerId, type };
    
    if (status && status !== 'All') query.status = status;
    if (customerId) query.customerId = customerId;
    if (vendorId) query.vendorId = vendorId;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];
    }
    const invoices = await Invoice.find(query)
      .populate('customerId', 'name phone')
      .populate('vendorId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single document
router.get('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId })
      .populate('customerId')
      .populate('vendorId');
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create document
router.post('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { customerId, vendorId, items, discount = 0, dueDate, notes, isGST, type = 'INVOICE' } = req.body;

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

    const customer = customerId ? await Customer.findOne({ _id: customerId, userId: ownerId }) : null;

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
      vendorId,
      type,
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

    // Deduct/Add Stock based on type
    if (type === 'INVOICE' || type === 'CHALLAN' || type === 'DEBIT_NOTE') {
      for (const item of items) {
        if (item.productId) {
          await Product.findOneAndUpdate(
            { _id: item.productId, userId: ownerId },
            { $inc: { stock: -Number(item.qty) } }
          );
        }
      }
    } else if (type === 'CREDIT_NOTE') {
      for (const item of items) {
        if (item.productId) {
          await Product.findOneAndUpdate(
            { _id: item.productId, userId: ownerId },
            { $inc: { stock: Number(item.qty) } }
          );
        }
      }
    }

    // Update customer balance if it's a financial document
    if (customer && (type === 'INVOICE' || type === 'CREDIT_NOTE' || type === 'DEBIT_NOTE')) {
      const balanceChange = type === 'CREDIT_NOTE' ? -total : total;
      customer.balance = (customer.balance || 0) + balanceChange;
      if (customer.balance > 0) customer.status = 'Udhaar';
      await customer.save();
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// PUT update document status
router.put('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { status } = req.body;
    const updateData: any = { ...req.body };
    
    if (status === 'PAID') {
      updateData.paidDate = new Date();
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

// DELETE document
router.delete('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, userId: ownerId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET sharing link
router.get('/:id/share', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId }).populate('customerId');
    if (!invoice) return res.status(404).json({ message: 'Not found' });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const shareUrl = `${frontendUrl}/view-document/${invoice._id}`;
    
    const message = `Hello ${invoice.customerName}, your ${invoice.type.toLowerCase()} ${invoice.invoiceNumber} is ready. Total: ₹${invoice.total}. View it here: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/${invoice.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    res.json({ success: true, message, shareUrl, whatsappUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST convert document
router.post('/convert/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const { targetType } = req.body;
    
    const sourceDoc = await Invoice.findOne({ _id: req.params.id, userId: ownerId });
    if (!sourceDoc) return res.status(404).json({ message: 'Source not found' });

    const newDoc = new Invoice({
      ...sourceDoc.toObject(),
      _id: undefined,
      type: targetType,
      invoiceNumber: undefined,
      originalDocumentId: sourceDoc._id,
      status: targetType === 'INVOICE' ? 'UNPAID' : 'PENDING',
      createdAt: undefined,
      updatedAt: undefined
    });

    const saved = await newDoc.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Conversion failed', error });
  }
});

// POST generate e-invoice (M12)
router.post('/:id/generate-einvoice', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: ownerId });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (!invoice.isGST) return res.status(400).json({ message: 'E-Invoice can only be generated for GST bills' });
    if (invoice.einvoiceDetails?.status === 'GENERATED') {
      return res.status(400).json({ message: 'E-Invoice already generated' });
    }

    // Mock NIC/IRP processing delay
    // In real app, you'd call GST portal API here

    // Generate Mock IRN (SHA-256 hash of invoice details)
    const crypto = await import('crypto');
    const irnData = `${invoice.invoiceNumber}${invoice.total}${ownerId}${Date.now()}`;
    const irn = crypto.createHash('sha256').update(irnData).digest('hex');
    
    const ackNumber = Math.floor(Math.random() * 1000000000000).toString();
    const ackDate = new Date().toISOString();
    
    // Mock QR Code (In real app, this is a signed string from IRP)
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(irn)}`;

    invoice.einvoiceDetails = {
      irn,
      ackNumber,
      ackDate,
      qrCode,
      status: 'GENERATED'
    };

    await invoice.save();
    res.json({ success: true, message: 'E-Invoice generated successfully', einvoiceDetails: invoice.einvoiceDetails });
  } catch (error) {
    res.status(500).json({ message: 'E-Invoice generation failed', error });
  }
});

export default router;
