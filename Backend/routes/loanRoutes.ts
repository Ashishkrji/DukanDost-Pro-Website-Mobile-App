import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Dummy Loan Application Logic
router.post('/apply', protect, async (req: any, res: any) => {
  const { amount, tenure, purpose } = req.body;
  const user = req.user;

  // Simulating call to NBFC with Dummy Key
  const nbfcApiKey = process.env.NBFC_PARTNER_API_KEY;
  
  console.log(`[NBFC] Calling partner API with key: ${nbfcApiKey?.substring(0, 5)}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  res.status(200).json({
    success: true,
    message: 'Application submitted to NBFC partner',
    applicationId: 'APP-' + Math.random().toString(36).substring(7).toUpperCase(),
    status: 'PENDING_REVIEW'
  });
});

router.get('/status', protect, async (req: any, res: any) => {
  res.status(200).json({
    success: true,
    status: 'IN_PROGRESS',
    updates: [
      { date: new Date().toISOString(), message: 'Documents verified by DukanDost' },
      { date: new Date().toISOString(), message: 'Sent to NBFC for final approval' }
    ]
  });
});

export default router;
