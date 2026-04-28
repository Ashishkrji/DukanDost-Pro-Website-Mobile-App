import express from 'express';
import { getTestimonials } from '../controllers/landingController.ts';

const router = express.Router();

router.get('/testimonials', getTestimonials);

export default router;
