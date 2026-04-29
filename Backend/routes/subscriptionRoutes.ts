import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  getCurrentPlan, 
  cancelPlan,
  requestRefund,
  getPaymentHistory,
  logBusinessInquiry,
  handleWebhook
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook is public (verified via signature)
router.post('/webhook', handleWebhook);

router.use(protect); // All other routes are protected

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/current-plan', getCurrentPlan);
router.post('/cancel-plan', cancelPlan);
router.post('/request-refund', requestRefund);
router.get('/payment-history', getPaymentHistory);
router.post('/business-inquiry', logBusinessInquiry);

export default router;

