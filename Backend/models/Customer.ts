import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  alternateNumber: { type: String, trim: true },
  email: { type: String, trim: true },
  address: { type: String },
  shopName: { type: String, trim: true },
  gstNumber: { type: String, trim: true },
  totalCredit: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  remainingBalance: { type: Number, default: 0 }, // positive = they owe us (Lena)
  balance: { type: Number, default: 0 },          // alias for remainingBalance
  creditLimit: { type: Number, default: 10000 },
  initials: { type: String },
  color: { type: String, default: 'bg-slate-100 text-slate-700' },
  status: {
    type: String,
    enum: ['Up-to-date', 'Udhaar', 'Overdue'],
    default: 'Up-to-date',
  },
  lastTransactionDate: { type: Date },
  notes: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure phone is unique PER USER
customerSchema.index({ userId: 1, phone: 1 }, { unique: true });
customerSchema.index({ userId: 1, name: 1 });
customerSchema.index({ remainingBalance: -1 });

// Auto-compute initials before save
customerSchema.pre('save', function (next) {
  if (!this.initials && this.name) {
    const parts = this.name.trim().split(' ');
    this.initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : this.name.substring(0, 2).toUpperCase();
  }
  next();
});

export default mongoose.model('Customer', customerSchema);
