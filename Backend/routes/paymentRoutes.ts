import { updatePaymentSettings, getPaymentSettings } from '../controllers/paymentSettingsController.ts';
import { getPayments, createOrder, verifyPayment } from '../controllers/paymentController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

router.get('/', getPayments);
router.get('/settings', getPaymentSettings);
router.post('/settings', updatePaymentSettings);

// Razorpay (M13)
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
