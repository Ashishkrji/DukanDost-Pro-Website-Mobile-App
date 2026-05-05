import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0, min: 0 },
  minStock: { type: Number, default: 5 },     // threshold for low-stock alert
  gstRate: { type: Number, default: 0 },      // 0, 5, 12, 18, 28
  sku: { type: String, required: true, unique: true, trim: true },
  barcode: { type: String },
  unit: { type: String, default: 'pcs' },     // pcs, kg, litre, etc.
  icon: { type: String, default: '📦' },
  isVisible: { type: Boolean, default: true },// for online store visibility
  status: {
    type: String,
    enum: ['IN STOCK', 'LOW STOCK', 'OUT OF STOCK'],
    default: 'IN STOCK',
  },
  batches: [{
    batchNumber: String,
    expiryDate: Date,
    quantity: Number,
    mrp: Number
  }],
  warehouseStocks: [{
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    quantity: { type: Number, default: 0 }
  }],
  trackSerialNumbers: { type: Boolean, default: false },
  serialNumbers: [String], // for warranty tracking
}, { timestamps: true });

// Auto-update status based on stock
productSchema.pre('save', function (next) {
  if (this.stock === 0) {
    this.status = 'OUT OF STOCK';
  } else if (this.stock <= this.minStock) {
    this.status = 'LOW STOCK';
  } else {
    this.status = 'IN STOCK';
  }
  next();
});

export default mongoose.model('Product', productSchema);
