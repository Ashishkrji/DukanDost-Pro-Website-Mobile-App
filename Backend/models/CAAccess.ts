import mongoose from 'mongoose';

const caAccessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  accessType: { type: String, enum: ['READ_ONLY', 'TAX_ONLY'], default: 'READ_ONLY' },
  notes: String
}, { timestamps: true });

const CAAccess = mongoose.model('CAAccess', caAccessSchema);
export default CAAccess;
