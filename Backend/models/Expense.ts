import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  category: { 
    type: String, 
    required: true,
    enum: ['Rent', 'Electricity', 'Water', 'Salary', 'Transport', 'Marketing', 'Maintenance', 'Utilities', 'Other'],
    default: 'Other'
  },
  amount: { type: Number, required: true, min: 0.01 },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Other'],
    default: 'Cash',
  },
  notes: { type: String, trim: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

expenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
