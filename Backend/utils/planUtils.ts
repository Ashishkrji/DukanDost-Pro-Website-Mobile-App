import User from '../models/User.ts';

export const getStaffLimit = (plan: string): number => {
  switch (plan) {
    case 'Business':
      return Infinity;
    case 'Pro':
      return 3;
    default:
      return 0; // Starter doesn't support staff
  }
};

export const canAddStaff = async (ownerId: any, plan: string): Promise<boolean> => {
  const limit = getStaffLimit(plan);
  if (limit === Infinity) return true;
  
  const currentStaffCount = await User.countDocuments({ parentId: ownerId, role: 'staff' });
  return currentStaffCount < limit;
};
