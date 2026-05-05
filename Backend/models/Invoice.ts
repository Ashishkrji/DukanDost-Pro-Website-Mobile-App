import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  sku: { type: String },
  batchNumber: { type: String },
  serialNumbers: [String],
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  invoiceNumber: { type: String, unique: true },
  type: {
    type: String,
    enum: ['INVOICE', 'QUOTATION', 'ESTIMATE', 'PROFORMA', 'CHALLAN', 'PURCHASE_ORDER', 'CREDIT_NOTE', 'DEBIT_NOTE'],
    default: 'INVOICE'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: function(this: any) { return this.type !== 'PURCHASE_ORDER'; }
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: function(this: any) { return this.type === 'PURCHASE_ORDER'; }
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
    enum: ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED', 'DRAFT', 'PENDING', 'APPROVED', 'RECEIVED'],
    default: 'UNPAID',
  },
  dueDate: { type: Date },
  paidDate: { type: Date },
  notes: { type: String },
  isGST: { type: Boolean, default: false },
  originalDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, // For converting Quote -> Invoice or Returns

  // Recurring Billing (M8)
  isRecurring: { type: Boolean, default: false },
  recurrence: {
    frequency: { type: String, enum: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'] },
    nextGenerationDate: { type: Date },
    lastGeneratedDate: { type: Date },
    status: { type: String, enum: ['Active', 'Paused', 'Ended'], default: 'Active' }
  },

  // E-Invoice (M12)
  einvoiceDetails: {
    irn: { type: String },
    ackNumber: { type: String },
    ackDate: { type: String },
    qrCode: { type: String }, // Base64 or URL
    status: { type: String, enum: ['PENDING', 'GENERATED', 'CANCELLED', 'FAILED'], default: 'PENDING' },
    error: { type: String }
  }
}, { timestamps: true });

invoiceSchema.index({ userId: 1 });
invoiceSchema.index({ type: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ vendorId: 1 });
invoiceSchema.index({ createdAt: -1 });

// Auto-generate number based on type
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await (this.constructor as any).countDocuments({ type: this.type });
    const year = new Date().getFullYear();
    const prefix = this.type.substring(0, 3);
    this.invoiceNumber = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);
