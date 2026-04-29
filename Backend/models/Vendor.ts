import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, trim: true },
  address: { type: String },
  gstNumber: { type: String, trim: true },
  totalPurchased: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 }, // positive = we owe them (Dena)
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure phone is unique PER USER
vendorSchema.index({ userId: 1, phone: 1 }, { unique: true });

export default mongoose.model('Vendor', vendorSchema);
