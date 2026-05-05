import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  salary: { type: Number, required: true },
  salaryType: { type: String, enum: ['Monthly', 'Daily', 'Weekly'], default: 'Monthly' },
  salaryComponents: {
    basic: Number,
    hra: Number,
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
  status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
  attendance: { type: String, enum: ['Aaya', 'Nahi Aaya', 'Pending'], default: 'Pending' },
  initials: { type: String }
}, { timestamps: true });

staffSchema.pre('save', function(next) {
  if (this.name) {
    this.initials = this.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  next();
});

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
