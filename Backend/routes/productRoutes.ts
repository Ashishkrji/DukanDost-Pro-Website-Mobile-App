import express from 'express';
import Product from '../models/Product.ts';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const query: any = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET distinct categories
router.get('/categories', async (_req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET low stock alerts
router.get('/alerts/low-stock', async (_req, res) => {
  try {
    const products = await Product.find({ status: { $in: ['LOW STOCK', 'OUT OF STOCK'] } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists' });
    }
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
});

// PUT update product (also handles stock adjustment)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// PATCH toggle online store visibility
router.patch('/:id/visibility', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    product.isVisible = !product.isVisible;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// POST bulk actions (delete, update stock)
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids, data } = req.body;
    if (action === 'delete') {
      await Product.deleteMany({ _id: { $in: ids } });
      return res.json({ message: `${ids.length} products deleted` });
    }
    if (action === 'update' && data) {
      await Product.updateMany({ _id: { $in: ids } }, data);
      return res.json({ message: `${ids.length} products updated` });
    }
    res.status(400).json({ message: 'Unknown action' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
