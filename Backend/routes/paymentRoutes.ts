import express from 'express';
import { updatePaymentSettings, getPaymentSettings } from '../controllers/paymentSettingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/settings', getPaymentSettings);
router.post('/settings', updatePaymentSettings);

export default router;
