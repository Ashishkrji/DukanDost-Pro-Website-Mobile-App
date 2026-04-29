import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import Shop from '../models/Shop.ts';

const router = express.Router();
router.use(protect);

// GET all shops for owner
router.get('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const shops = await Shop.find({ ownerId, isActive: true });
    res.json({ success: true, shops });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// POST create shop
router.post('/', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    
    // Check plan limits in future (e.g. Starter = 1 shop, Pro = 3 shops, Business = Unlimited)
    
    const shop = new Shop({ ...req.body, ownerId });
    const saved = await shop.save();
    res.status(201).json({ success: true, shop: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error });
  }
});

// PUT update shop
router.put('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    const updated = await Shop.findOneAndUpdate(
      { _id: req.params.id, ownerId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, shop: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Bad Request', error });
  }
});

// DELETE shop (soft delete)
router.delete('/:id', async (req: any, res) => {
  try {
    const ownerId = req.ownerId;
    await Shop.findOneAndUpdate({ _id: req.params.id, ownerId }, { isActive: false });
    res.json({ success: true, message: 'Shop deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

export default router;
