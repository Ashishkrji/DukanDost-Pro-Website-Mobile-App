import express from 'express';
import Warehouse from '../models/Warehouse';
import Product from '../models/Product';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Get all warehouses for a shop
router.get('/:shopId', protect, async (req: any, res) => {
  try {
    const warehouses = await Warehouse.find({ shopId: req.params.shopId });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warehouses' });
  }
});

// Create warehouse
router.post('/', protect, async (req: any, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.json(warehouse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating warehouse' });
  }
});

// Transfer stock between warehouses
router.post('/transfer', protect, async (req: any, res) => {
  const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Deduct from source
    const fromStock = product.warehouseStocks.find((ws: any) => ws.warehouseId.toString() === fromWarehouseId);
    if (!fromStock || fromStock.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock in source warehouse' });
    }
    fromStock.quantity -= quantity;

    // Add to destination
    let toStock = product.warehouseStocks.find((ws: any) => ws.warehouseId.toString() === toWarehouseId);
    if (!toStock) {
      product.warehouseStocks.push({ warehouseId: toWarehouseId as any, quantity });
    } else {
      toStock.quantity += quantity;
    }

    await product.save();
    res.json({ message: 'Transfer successful', product });
  } catch (error) {
    res.status(500).json({ message: 'Transfer failed' });
  }
});

export default router;
