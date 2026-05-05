import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true, trim: true },
  address: { type: String },
  phone: { type: String },
  gstNumber: { type: String },
  isActive: { type: Boolean, default: true },
  
  // Customization & Controls
  settings: {
    store: {
      isOpen: { type: Boolean, default: true },
      deliveryCharge: { type: Number, default: 0 },
      minFreeDelivery: { type: Number, default: 500 },
      banners: [{ type: String }],
      featuredCategories: [{ type: String }]
    },
    tax: {
      defaultGstRate: { type: Number, default: 18 },
      enableEInvoice: { type: Boolean, default: false }
    },
    whatsapp: {
      invoiceTemplate: { 
        type: String, 
        default: "Namaste! Your bill from {{shopName}} is ready. Total: ₹{{amount}}. View here: {{link}}" 
      },
      reminderTemplate: { 
        type: String, 
        default: "Reminder: You have a pending balance of ₹{{balance}} at {{shopName}}. Please clear it soon." 
      },
      bulkMarketingTemplate: {
        type: String,
        default: "Special Offer! Use code {{couponCode}} to get a discount on our online store: {{storeLink}}"
      }
    }
  }
}, { timestamps: true });

export default mongoose.model('Shop', shopSchema);
