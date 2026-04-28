import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE'],
    default: 'PRESENT',
  },
  note: { type: String },
  checkinTime: { type: String },
  checkoutTime: { type: String },
}, { _id: false });

const salaryPaymentSchema = new mongoose.Schema({
  month: { type: String, required: true }, // "2026-04"
  amount: { type: Number, required: true },
  paidDate: { type: Date },
  isPaid: { type: Boolean, default: false },
  mode: { type: String, enum: ['CASH', 'BANK', 'UPI'], default: 'CASH' },
}, { _id: false });

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String },
  role: { type: String, required: true },
  salary: { type: Number, required: true, min: 0 },
  attendance: [attendanceSchema],
  salaryHistory: [salaryPaymentSchema],
  joiningDate: { type: Date },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active',
  },
  initials: { type: String },
  address: { type: String },
  aadhaar: { type: String },
}, { timestamps: true });

staffSchema.pre('save', function (next) {
  if (!this.initials && this.name) {
    const parts = this.name.trim().split(' ');
    this.initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : this.name.substring(0, 2).toUpperCase();
  }
  next();
});

export default mongoose.model('Staff', staffSchema);
