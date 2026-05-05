import express from 'express';
import { getCoupons, createCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Public route for customers to validate coupons
router.post('/validate', validateCoupon);

// Admin protected routes
router.use(protect);
router.get('/', getCoupons);
router.post('/', createCoupon);
router.delete('/:id', deleteCoupon);

export default router;
