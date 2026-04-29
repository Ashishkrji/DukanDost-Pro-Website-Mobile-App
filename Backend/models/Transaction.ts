import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['DIYA', 'LIYA'],   // DIYA = we gave credit; LIYA = we received payment
    required: true,
  },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, default: Date.now },
  note: { type: String, trim: true, maxlength: 500 },
  // Bulk note support — multiple notes per transaction
  notes: [{
    text: { type: String, trim: true },
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: String, default: 'Owner' },
  }],
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  paymentMode: {
    type: String,
    enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'OTHER'],
    default: 'CASH',
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for fast queries
transactionSchema.index({ userId: 1 });
transactionSchema.index({ customerId: 1, date: -1 });
transactionSchema.index({ date: -1 });

export default mongoose.model('Transaction', transactionSchema);
