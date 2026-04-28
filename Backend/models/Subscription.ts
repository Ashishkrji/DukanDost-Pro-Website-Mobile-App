import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    enum: ['Starter', 'Pro', 'Business'],
    required: true
  },
  billingType: {
    type: String,
    enum: ['monthly', 'yearly', 'manual', '1 Month', '1 Year', '2 Years', '4 Years', '10 Years'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: false
  },
  orderId: {
    type: String,
    required: true
  },
  razorpaySignature: {
    type: String,
    required: false
  },
  paymentStatus: {
    type: String,
    enum: ['captured', 'failed', 'refunded', 'pending'],
    default: 'captured'
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  refundRequested: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
