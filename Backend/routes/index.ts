import express from 'express';
import customerRoutes from './customerRoutes.ts';
import transactionRoutes from './transactionRoutes.ts';
import invoiceRoutes from './invoiceRoutes.ts';
import productRoutes from './productRoutes.ts';
import paymentRoutes from './paymentRoutes.ts';
import staffRoutes from './staffRoutes.ts';
import voucherRoutes from './voucherRoutes.ts';
import authRoutes from './authRoutes.ts';
import subscriptionRoutes from './subscriptionRoutes.ts';
import adminRoutes from './adminRoutes.ts';
import settingsRoutes from './settingsRoutes.ts';
import notificationRoutes from './notificationRoutes.ts';
import reminderRoutes from './reminderRoutes.ts';
import landingRoutes from './landingRoutes.ts';

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/products', productRoutes);
router.use('/payments', paymentRoutes);
router.use('/staff', staffRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/auth', authRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reminders', reminderRoutes);
router.use('/landing', landingRoutes);

export default router;
