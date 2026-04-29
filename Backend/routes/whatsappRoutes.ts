import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { sendReminder } from '../controllers/whatsappController.ts';

const router = express.Router();

router.use(protect);

router.post('/remind', sendReminder);

export default router;
