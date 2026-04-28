import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { updateUPISettings, getUPISettings } from '../controllers/settingsController';

const router = express.Router();

router.use(protect);

router.get('/upi', getUPISettings);
router.post('/upi', updateUPISettings);

export default router;
