import mongoose from 'mongoose';

const ledgerEntrySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  transactionType: {
    type: String,
    enum: ['Udhaar Diya', 'Payment Mila', 'Maal Kharida', 'Payment Diya'],
    required: true,
  },
  amount: { type: Number, required: true, min: 0.01 },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'QR Payment', 'Other'],
    default: 'Cash',
  },
  notes: { type: String, trim: true },
  balanceAfterEntry: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

ledgerEntrySchema.index({ userId: 1, date: -1 });
ledgerEntrySchema.index({ customerId: 1, date: -1 });
ledgerEntrySchema.index({ vendorId: 1, date: -1 });

export default mongoose.model('LedgerEntry', ledgerEntrySchema);

