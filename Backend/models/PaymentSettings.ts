import mongoose from 'mongoose';

const PaymentSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  upiId: {
    type: String,
    required: true,
    trim: true
  },
  accountHolderName: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  paymentNotes: String,
  preferredMethod: {
    type: String,
    enum: ['UPI', 'Bank Transfer', 'QR Payment'],
    default: 'UPI'
  },
  qrCodeUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('PaymentSettings', PaymentSettingsSchema);
