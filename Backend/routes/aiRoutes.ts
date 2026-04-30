import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { calculateHealthScore, processAIChat, executeAIAction } from '../services/aiService.ts';

const router = express.Router();

router.use(protect);

router.get('/health-score', async (req: any, res) => {
  try {
    const healthData = await calculateHealthScore(req.user.id);
    res.json({ success: true, ...healthData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI failed to process data' });
  }
});

router.post('/chat', async (req: any, res) => {
  try {
    const { messages } = req.body;
    const response = await processAIChat(req.user.id, messages);
    res.json({ success: true, ...response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/execute', async (req: any, res) => {
  try {
    const { action, params } = req.body;
    const result = await executeAIAction(req.user.id, action, params);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
