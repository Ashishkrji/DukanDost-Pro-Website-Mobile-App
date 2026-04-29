import express from 'express';
import { protect } from '../middleware/authMiddleware.ts';
import { checkFeatureAccess } from '../middleware/planMiddleware.ts';
import { createCampaign, getCampaigns, sendCampaign } from '../controllers/campaignController.ts';

const router = express.Router();

router.use(protect);

router.get('/', getCampaigns);
router.post('/', checkFeatureAccess('WhatsApp Business API'), createCampaign);
router.post('/:id/send', checkFeatureAccess('WhatsApp Business API'), sendCampaign);

export default router;

