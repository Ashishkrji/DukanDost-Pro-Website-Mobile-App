import mongoose from 'mongoose';

const BusinessInquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopName: String,
  ownerName: String,
  contactNumber: String,
  email: String,
  query: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'onboarded', 'converted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('BusinessInquiry', BusinessInquirySchema);
