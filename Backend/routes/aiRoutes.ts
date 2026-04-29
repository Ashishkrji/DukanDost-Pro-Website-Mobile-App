import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { calculateHealthScore } from '../services/aiService.ts';

const router = express.Router();

router.use(protect);

router.get('/health-score', async (req: any, res) => {
  try {
    const healthData = await calculateHealthScore(req.ownerId);
    res.json({ success: true, ...healthData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI failed to process data' });
  }
});

export default router;
