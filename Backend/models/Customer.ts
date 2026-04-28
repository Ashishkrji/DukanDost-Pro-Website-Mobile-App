import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true },
  address: { type: String },
  city: { type: String },
  balance: { type: Number, default: 0 },       // positive = they owe us (Lena)
  creditLimit: { type: Number, default: 10000 },
  initials: { type: String },
  color: { type: String, default: 'bg-slate-100 text-slate-700' },
  status: {
    type: String,
    enum: ['Up-to-date', 'Udhaar', 'Overdue'],
    default: 'Up-to-date',
  },
  lastTransactionDate: { type: Date },
  gstin: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

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
