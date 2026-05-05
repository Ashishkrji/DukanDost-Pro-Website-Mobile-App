import express from 'express';
import { updatePaymentSettings, getPaymentSettings } from '../controllers/paymentSettingsController.ts';
import { getPayments } from '../controllers/paymentController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

router.get('/', getPayments);
router.get('/settings', getPaymentSettings);
router.post('/settings', updatePaymentSettings);

export default router;
