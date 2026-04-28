import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'DukanDost Pro' },
    companyName: { type: String, default: 'DukanDost Technologies' },
    supportEmail: { type: String, default: 'support@dukandost.com' },
    contactNumber: { type: String, default: '+91 9876543210' },
    defaultCurrency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    logoUrl: { type: String },
    gstEnabled: { type: Boolean, default: true }
  },
  email: {
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUsername: { type: String },
    smtpPassword: { type: String },
    senderEmail: { type: String },
    senderName: { type: String }
  },
  security: {
    minPasswordLength: { type: Number, default: 8 },
    requireUppercase: { type: Boolean, default: true },
    requireNumber: { type: Boolean, default: true },
    requireSpecialChar: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 3600 }, // in seconds
    loginAttemptLimit: { type: Number, default: 5 },
    twoFactorEnabled: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Ensure only one settings document exists
platformSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);
export default PlatformSettings;
