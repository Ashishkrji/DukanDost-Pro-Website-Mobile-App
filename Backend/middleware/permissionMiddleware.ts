import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorMiddleware';

export const restrictTo = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Middleware to check if the user has the required subscription plan
 */
export const restrictPlan = (...plans: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // If user is a staff, we check the plan of their parent (owner)
    const userPlan = req.user.plan;
    
    if (!plans.includes(userPlan)) {
      return next(new AppError(`This feature is only available on ${plans.join(' or ')} plans`, 403));
    }
    next();
  };
};

/**
 * Permission matrix for fine-grained control
 */
export const permissions = {
  BILLING_CREATE: ['admin', 'staff', 'user', 'super_admin'],
  INVENTORY_MANAGE: ['admin', 'staff', 'user', 'super_admin'],
  REPORTS_VIEW: ['admin', 'user', 'super_admin'], // Staff can't see full reports
  SETTINGS_MANAGE: ['admin', 'user', 'super_admin'],
  STAFF_MANAGE: ['admin', 'user', 'super_admin'],
  PLAN_UPGRADE: ['admin', 'user', 'super_admin'],
  ADMIN_PANEL: ['super_admin'],
};

export const hasPermission = (permissionKey: keyof typeof permissions) => {
  return (req: any, res: Response, next: NextFunction) => {
    const allowedRoles = permissions[permissionKey];
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Permission denied for this operation', 403));
    }
    next();
  };
};
