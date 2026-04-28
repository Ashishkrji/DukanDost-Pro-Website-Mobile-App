import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true // e.g. "Owner, Sharma Electronics"
  },
  quote: {
    type: String,
    required: true
  },
  avatarSrc: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  rating: {
    type: Number,
    default: 5
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Testimonial', TestimonialSchema);
