import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { sendReminder, sendBulkMessages } from '../controllers/whatsappController.ts';

const router = express.Router();

router.use(protect);

router.post('/remind', sendReminder);
router.post('/bulk-send', sendBulkMessages);

export default router;
