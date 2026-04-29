import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // linked if type is PURCHASE
  notes: { type: String, trim: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for faster queries
inventorySchema.index({ userId: 1, productId: 1, date: -1 });

export default mongoose.model('Inventory', inventorySchema);
