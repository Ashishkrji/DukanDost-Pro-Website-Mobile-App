import express from 'express';
import { 
  createReminder, 
  getReminders, 
  updateReminder, 
  deleteReminder, 
  sendReminderNow,
  toggleReminder
} from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create', createReminder);
router.get('/all', getReminders);
router.put('/update/:id', updateReminder);
router.delete('/delete/:id', deleteReminder);
router.post('/send-now/:id', sendReminderNow);
router.post('/toggle/:id', toggleReminder);

export default router;
