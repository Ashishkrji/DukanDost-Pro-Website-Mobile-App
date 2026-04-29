import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audienceType: { 
    type: String, 
    enum: ['All Customers', 'Overdue Only', 'Top Customers'], 
    default: 'All Customers' 
  },
  recipientCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Sending', 'Completed', 'Failed'], 
    default: 'Draft' 
  },
  sentAt: Date,
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
