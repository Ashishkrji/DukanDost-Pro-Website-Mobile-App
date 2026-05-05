import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryPayment extends Document {
  staffId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPaid: number;
  paymentDate: Date;
  paymentMode: string;
  status: 'PAID' | 'PENDING';
}

const SalaryPaymentSchema: Schema = new Schema({
  staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, default: 'Cash' },
  status: { type: String, enum: ['PAID', 'PENDING'], default: 'PAID' }
}, { timestamps: true });

export default mongoose.model<ISalaryPayment>('SalaryPayment', SalaryPaymentSchema);
