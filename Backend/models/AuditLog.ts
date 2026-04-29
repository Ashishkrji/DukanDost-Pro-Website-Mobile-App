import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g. 'CREATE_INVOICE', 'DELETE_PRODUCT', 'STAFF_LOGIN'
  },
  entity: {
    type: String,
    required: true, // e.g. 'Invoice', 'Product', 'Customer'
  },
  entityId: mongoose.Schema.Types.ObjectId,
  changes: {
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
