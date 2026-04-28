import { Request, Response, NextFunction } from 'express';

const PLAN_FEATURES: any = {
  'Starter': ['Basic Invoicing', 'Customer Ledger', 'Mobile App', 'Standard Reports', 'Manual WhatsApp'],
  'Pro': ['Unlimited Customers', 'GST Billing', 'Inventory', 'Staff Access', 'UPI QR', 'Advanced Reports', 'Manual WhatsApp Reminder'],
  'Business': ['Multi-Shop Sync', 'API Access', 'AI Features', 'Auto WhatsApp', 'WhatsApp Business API', 'Priority Support']
};

export const checkFeatureAccess = (feature: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    const userPlan = req.user.plan || 'Starter';
    
    // Pro inherits Starter features, Business inherits Pro and Starter
    const accessibleFeatures = [...PLAN_FEATURES['Starter']];
    
    if (userPlan === 'Pro' || userPlan === 'Business') {
      accessibleFeatures.push(...PLAN_FEATURES['Pro']);
    }
    
    if (userPlan === 'Business') {
      accessibleFeatures.push(...PLAN_FEATURES['Business']);
    }

    if (!accessibleFeatures.includes(feature)) {
      return res.status(403).json({
        success: false,
        message: `This feature is not available on your ${userPlan} plan. Please upgrade to unlock.`,
        requiredPlan: feature === 'GST Billing' ? 'Pro' : 'Business'
      });
    }
    
    next();
  };
};
