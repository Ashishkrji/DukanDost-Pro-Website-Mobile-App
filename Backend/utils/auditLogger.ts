import AuditLog from '../models/AuditLog.ts';

export const logAction = async ({
  userId,
  performedBy,
  action,
  entity,
  entityId,
  changes,
  req
}: any) => {
  try {
    await AuditLog.create({
      userId,
      performedBy,
      action,
      entity,
      entityId,
      changes,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent')
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
};
