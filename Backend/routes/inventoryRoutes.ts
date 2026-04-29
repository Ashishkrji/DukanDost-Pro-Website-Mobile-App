import express from 'express';
import Inventory from '../models/Inventory.ts';
import Product from '../models/Product.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// GET /api/inventory/history/:productId
router.get('/history/:productId', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const history = await Inventory.find({ userId, productId }).sort({ date: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST /api/inventory/entry (Purchase/Adjustment)
router.post('/entry', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { productId, type, quantity, price, vendorId, notes } = req.body;

    // 1. Create inventory entry
    const entry = await Inventory.create({
      userId,
      productId,
      type,
      quantity,
      price,
      vendorId,
      notes
    });

    // 2. Update product stock
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (type === 'PURCHASE' || type === 'RETURN' || (type === 'ADJUSTMENT' && quantity > 0)) {
      (product as any).stock += Math.abs(quantity);
    } else if (type === 'SALE' || (type === 'ADJUSTMENT' && quantity < 0)) {
      (product as any).stock -= Math.abs(quantity);
    }

    await product.save();

    res.status(201).json({ success: true, entry, currentStock: (product as any).stock });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
