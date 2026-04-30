import express from 'express';
import Subscription from '../models/Subscription';
import { adminLogin, getAdminProfile } from '../controllers/adminAuthController';
import { protectAdmin, restrictTo } from '../middleware/adminMiddleware';
import { 
  getAdminStats, 
  getAllUsers, 
  getBusinessInquiries, 
  updateInquiryStatus, 
  getPaymentLogs,
  updateUserPlanManually,
  getAllTickets,
  updateTicketStatus,
  getPlatformSettings,
  updatePlatformSettings,
  updateUser,
  deleteUser,
  testEmailConnection
} from '../controllers/adminController';
import { createNotification, getAllNotifications } from '../controllers/notificationController';

const router = express.Router();

// Public Admin Routes
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/me', getAdminProfile);
router.get('/stats', getAdminStats);
router.get('/revenue-trends', async (req: any, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const trends = await Subscription.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'captured' } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" }
      }},
      { $sort: { _id: 1 } }
    ]);

    const formatted = trends.map(t => ({
      name: new Date(t._id).toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: t.revenue
    }));

    res.json({ success: true, trends: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Trend error', error });
  }
});
router.get('/users', getAllUsers);
router.get('/inquiries', getBusinessInquiries);
router.patch('/inquiries/:id', updateInquiryStatus);
router.get('/payments', getPaymentLogs);
router.post('/manual-upgrade', updateUserPlanManually);

// Support Tickets
router.get('/tickets', getAllTickets);
router.patch('/tickets/:id', updateTicketStatus);

// User CRUD
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Platform Settings
router.get('/settings', getPlatformSettings);
router.patch('/settings', updatePlatformSettings);
router.post('/settings/test-email', testEmailConnection);

// Notifications
router.post('/notifications', createNotification);
router.get('/notifications', getAllNotifications);

// Example of super-admin only route
router.post('/create-sub-admin', restrictTo('super_admin'), (req, res) => {
  // Logic to create another admin
  res.json({ message: 'Sub-admin created' });
});

export default router;
