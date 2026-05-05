import { Request, Response } from 'express';
import Coupon from '../models/Coupon.ts';

// @desc    Get all coupons
// @route   GET /api/coupons
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({ shopId: req.user.currentShopId });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons' });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, description, type, value, minOrderValue, maxDiscount, expiryDate, usageLimit } = req.body;
    
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      expiryDate,
      usageLimit,
      shopId: req.user.currentShopId
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon' });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findOneAndDelete({ 
      _id: req.params.id, 
      shopId: req.user.currentShopId 
    });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon' });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, orderValue, shopId } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      shopId,
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (orderValue < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value for this coupon is ${coupon.minOrderValue}` });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (orderValue * coupon.value) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    res.json({ 
      code: coupon.code, 
      discountAmount, 
      type: coupon.type, 
      value: coupon.value 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating coupon' });
  }
};
