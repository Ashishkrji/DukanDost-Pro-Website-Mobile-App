import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, default: 0 },     // GST percentage (0, 5, 12, 18, 28)
  gstAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },    // price * qty + gstAmount
  sku: { type: String },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  invoiceNumber: { type: String, unique: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerName: { type: String },
  customerPhone: { type: String },
  customerGSTIN: { type: String },
  items: [itemSchema],
  subtotal: { type: Number, default: 0 },
  totalGST: { type: Number, default: 0 },
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'],
    default: 'UNPAID',
  },
  dueDate: { type: Date },
  paidDate: { type: Date },
  notes: { type: String },
  isGST: { type: Boolean, default: false },
}, { timestamps: true });

invoiceSchema.index({ userId: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ shopId: 1 });
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ createdAt: -1 });

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await (this.constructor as any).countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);
