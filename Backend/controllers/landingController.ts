import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial.ts';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    let testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });

    // Seed some data if empty
    if (testimonials.length === 0) {
      const seedData = [
        { name: "Rahul Sharma", title: "Sharma Electronics · Delhi", quote: "Reduced billing time by 70% and improved monthly collections. Best investment for my business.", rating: 5, avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
        { name: "Priya Gupta", title: "Gupta Textiles · Mumbai", quote: "Finally replaced 3 apps with one smart system. Inventory alerts are a life-saver.", rating: 4.8, avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
        { name: "Amit Patel", title: "Patel General Store · Ahmedabad", quote: "WhatsApp reminders are automatic — I collect dues without making a single awkward call.", rating: 4.9, avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
        { name: "Suresh Kumar", title: "SK Medicals · Bangalore", quote: "GST filing used to be a nightmare. Now, all my reports are ready in one click.", rating: 5, avatarSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop" },
        { name: "Anjali Singh", title: "Fashion Hub · Lucknow", quote: "The barcode scanning feature is so fast! My staff learned the system in just 10 minutes.", rating: 4.7, avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
        { name: "Vikram Reddy", title: "Reddy Provisions · Hyderabad", quote: "My recovery rate has reached 95% with automated WhatsApp alerts. Life is much easier.", rating: 4.9, avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
        { name: "Meera Iyer", title: "Iyer Organic Cafe · Chennai", quote: "DukanDost Pro gives me a clear picture of my business health every single day. Highly recommended!", rating: 4.8, avatarSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
        { name: "Deepak Verma", title: "Verma Auto Parts · Jaipur", quote: "Multi-location inventory sync is a game changer. I can monitor my stores from my home.", rating: 5, avatarSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
        { name: "Rajesh Das", title: "Das Stationery · Kolkata", quote: "The low stock alerts have saved me so many times. I never run out of bestsellers anymore.", rating: 4.6, avatarSrc: "https://images.unsplash.com/photo-1521119956141-10512e88a509?w=400&h=400&fit=crop" },
        { name: "Karan Malhotra", title: "Malhotra Sweets · Amritsar", quote: "Managing seasonal rushes is easy now. Quick billing and inventory tracking keep the queues short.", rating: 5, avatarSrc: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop" }
      ];
      await Testimonial.insertMany(seedData);
      testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching testimonials' });
  }
};
