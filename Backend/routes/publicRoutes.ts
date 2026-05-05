import express from 'express';
import Product from '../models/Product';
import Shop from '../models/Shop';

const router = express.Router();

// GET /api/public/catalog/:shopId
router.get('/catalog/:shopId', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const products = await Product.find({ shopId: req.params.shopId, isVisible: true });
    res.json({ shop, products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching catalog' });
  }
});

import CAAccess from '../models/CAAccess';
import Invoice from '../models/Invoice';
import LedgerEntry from '../models/LedgerEntry';

// GET /api/public/ca-portal/:token
router.get('/ca-portal/:token', async (req, res) => {
  try {
    const access = await CAAccess.findOne({ token: req.params.token, isActive: true });
    if (!access) return res.status(403).json({ message: 'Invalid or expired access token' });

    if (access.expiryDate && access.expiryDate < new Date()) {
       access.isActive = false;
       await access.save();
       return res.status(403).json({ message: 'Access has expired' });
    }

    const invoices = await Invoice.find({ userId: access.userId }).limit(500);
    const ledger = await LedgerEntry.find({ userId: access.userId }).limit(500);
    
    res.json({ success: true, invoices, ledger, accessType: access.accessType });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CA data' });
  }
});

import { createOrder, verifyPayment } from '../controllers/paymentController.ts';

// Payments
router.post('/payments/create-order', createOrder);
router.post('/payments/verify', verifyPayment);

export default router;
