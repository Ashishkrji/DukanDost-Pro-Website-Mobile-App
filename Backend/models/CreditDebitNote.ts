import mongoose from 'mongoose';

const creditDebitNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noteNumber: { type: String, required: true }, // CN-1001 or DN-1001
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true }, // CREDIT = Sales Return, DEBIT = Purchase Return
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  originalInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],
  reason: { type: String },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['ISSUED', 'CANCELLED'], default: 'ISSUED' }
}, { timestamps: true });

export default mongoose.model('CreditDebitNote', creditDebitNoteSchema);
