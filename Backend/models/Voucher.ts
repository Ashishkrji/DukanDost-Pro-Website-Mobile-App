import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },          // cap for percentage discounts
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  expiry: { type: Date },
  description: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Expired'],
    default: 'Active',
  },
  applicableCategories: [{ type: String }],
  // Track who used it
  usedBy: [{
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    usedAt: { type: Date, default: Date.now },
    orderId: { type: String },
  }],
}, { timestamps: true });

// Auto-expire
voucherSchema.pre('save', function (next) {
  if (this.expiry && new Date(this.expiry) < new Date()) {
    this.status = 'Expired';
  }
  if (this.usageCount >= this.usageLimit) {
    this.status = 'Expired';
  }
  next();
});

export default mongoose.model('Voucher', voucherSchema);
