import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import MainLayout from '../../components/layout/MainLayout';
import {
  Check,
  Star,
  Users,
  Shield,
  CreditCard,
  Receipt,
  Package,
  BarChart3,
  Play,
  ChevronDown,
  ChevronRight,
  Activity,
  Store,
  CheckCircle,
  ArrowRight,
  Lock,
  Bell,
  Zap,
  Plus,
  Equal,
  Sparkles,
} from 'lucide-react';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiVite, SiNodedotjs, SiMongodb, SiExpress } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { SectionTag } from '../../components/layout/PageComponents';
import LogoLoop from '@/components/ui/LogoLoop/LogoLoop';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack/ScrollStack';
import { ClientsSection } from '@/components/ui/testimonial-card';

const TECH_LOGOS = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiExpress />, title: "Express", href: "https://expressjs.com" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItemProps {
  key?: React.Key;
  question: string;
  answer: string;
}

interface FeatureCardProps {
  key?: React.Key;
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

interface PlanProps {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
  btnLabel: string;
}

interface TestimonialProps {
  initials: string;
  name: string;
  shop: string;
  city: string;
  text: string;
  result: string;
  avatarBg?: string;
}

interface StatProps {
  val: string;
  label: string;
  icon: React.ElementType;
}

interface StepProps {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

interface CompetitorProps {
  name: string;
  tagline: string;
  features: { label: string; has: boolean }[];
  missing: string;
  winner?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0 py-7">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group gap-4"
      >
        <span className="text-lg font-semibold text-black group-hover:text-primary transition-colors leading-snug">
          {question}
        </span>
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0',
            isOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400'
          )}
        >
          <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <p className="pt-5 pb-2 text-slate-500 text-[15px] leading-relaxed font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LocalFeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group bg-[#FAFAFA] border border-slate-100 rounded-2xl p-9 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-orange-100 transition-all duration-300"
  >
    <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-t-2xl" />
    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-primary mb-5">
      <Icon size={22} />
    </div>
    <h3 className="font-display text-[19px] font-bold text-black mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const DashboardMockup = () => (
  <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] relative overflow-hidden flex min-h-[480px] text-left">
    {/* Sidebar */}
    <div className="w-[180px] bg-[#0A0B1A] p-5 flex flex-col gap-6 flex-shrink-0">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold italic text-xs shadow-lg shadow-primary/20">D</div>
        <span className="text-white font-display text-[10px] font-black tracking-widest uppercase">DukanDost</span>
      </div>
      <div className="space-y-1">
        {[
          { label: 'Overview', icon: '🏠' },
          { label: 'Customers', icon: '👥' },
          { label: 'Inventory', icon: '📦' },
          { label: 'Invoices', icon: '🧾' },
          { label: 'Payments', icon: '💳' },
          { label: 'Reports', icon: '📈' },
        ].map((item, i) => (
          <div key={item.label} className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl text-[9px] font-bold transition-all duration-300 cursor-pointer",
            i === 0 ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-white hover:bg-white/5"
          )}>
            <span className="text-[12px]">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-3">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">Storage</p>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary" />
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 bg-[#FDFDFF] p-7 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-lg font-display font-black text-black tracking-tight leading-none mb-1">Business Overview</h4>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update: Just Now</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs">🔔</div>
          <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">RS</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">₹</div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+14%</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Revenue</p>
          <p className="text-xl font-display font-black text-black">₹42,850.00</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">👥</div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">+8</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Customers</p>
          <p className="text-xl font-display font-black text-black">156</p>
        </div>
      </div>

      <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col mb-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black text-black uppercase tracking-widest">Sales Performance</p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="flex-1 flex items-end gap-2 pb-2">
          {[40, 70, 45, 90, 65, 80, 55, 95, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group">
              <div className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40" style={{ height: `${h}%` }} />
              <div className="absolute bottom-0 left-0 right-0 bg-primary h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ bottom: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary text-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer hover:bg-primary-dark transition-all">
          <Plus size={14} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">New Bill</span>
        </div>
        <div className="bg-black text-white p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition-all">
          <Package size={14} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Add Stock</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: StatProps[] = [
  { val: '10K+', label: 'Active Businesses', icon: Store },
  { val: '2.5M+', label: 'Monthly Transactions', icon: CreditCard },
  { val: '99.99%', label: 'System Uptime', icon: Activity },
  { val: '24/7', label: 'Customer Support', icon: Bell },
];

const FEATURES: Omit<FeatureCardProps, 'delay'>[] = [
  { icon: Receipt, title: 'GST Billing & Invoicing', description: 'Create professional GST invoices in seconds. Share via WhatsApp, email, or print — fully compliant with Indian tax laws.' },
  { icon: Package, title: 'Inventory Management', description: 'Real-time stock tracking with low-stock alerts and automated purchase orders. Never lose a sale due to stockout again.' },
  { icon: Users, title: 'Customer Credit Ledger', description: 'Digital udhaar book with instant credit tracking, WhatsApp reminders, and full customer transaction history.' },
  { icon: BarChart3, title: 'Reports & Analytics', description: 'Deep insights into sales, profits, and customer behavior. Visual dashboards for smarter business decisions.' },
  { icon: CreditCard, title: 'Expense Tracking', description: 'Monitor every rupee spent. Identify cost-saving opportunities with automated expense categorization and cash flow reports.' },
  { icon: Shield, title: 'Multi-User Access', description: 'Add staff members and manage access securely. Role-based permissions ensure your sensitive data stays protected.' },
];

const COMPETITORS: CompetitorProps[] = [
  {
    name: 'OkCredit',
    tagline: 'Basic Ledger App',
    features: [
      { label: 'Customer credit tracking', has: true },
      { label: 'Payment reminders', has: true },
      { label: 'Basic ledger', has: true },
      { label: 'GST Billing', has: false },
      { label: 'Inventory', has: false },
      { label: 'Analytics', has: false },
    ],
    missing: 'Missing: Billing, Inventory, GST, Reports',
  },
  {
    name: 'Khatabook',
    tagline: 'Digital Khata App',
    features: [
      { label: 'Digital khata', has: true },
      { label: 'Debit/credit records', has: true },
      { label: 'Customer records', has: true },
      { label: 'GST Billing', has: false },
      { label: 'Inventory', has: false },
      { label: 'Advanced reports', has: false },
    ],
    missing: 'Missing: GST Billing, Inventory, Automation',
  },
  {
    name: 'MyBillBook',
    tagline: 'Billing App',
    features: [
      { label: 'GST billing', has: true },
      { label: 'Basic inventory', has: true },
      { label: 'Sales reports', has: true },
      { label: 'Credit ledger', has: false },
      { label: 'Payment reminders', has: false },
      { label: 'Growth tools', has: false },
    ],
    missing: 'Missing: Credit ledger, Automation, CRM',
  },
  {
    name: 'DukanDost Pro',
    tagline: 'Complete Business OS',
    features: [
      { label: 'GST Billing & Invoicing', has: true },
      { label: 'Inventory Management', has: true },
      { label: 'Customer Credit Ledger', has: true },
      { label: 'Advanced Analytics', has: true },
      { label: 'Payment Automation', has: true },
      { label: 'Multi-User Access + Growth Tools', has: true },
    ],
    missing: 'Everything above — in ONE platform',
    winner: true,
  },
];

const PAIN_POINTS = [
  { icon: '😫', title: 'Managing too many apps', desc: 'OkCredit + Khatabook + MyBillBook — 3 apps, 3 logins, 3 monthly fees. Enough.' },
  { icon: '🧾', title: 'Manual billing & calculation errors', desc: 'Hand-written bills, GST mistakes, and customer disputes costing you money daily.' },
  { icon: '💸', title: 'Missing customer payments', desc: 'Forgetting who owes what, awkward reminder calls, and cash flow suffering.' },
  { icon: '📦', title: 'Stock confusion & losses', desc: 'Running out of bestsellers or overstocking dead inventory with no alerts.' },
];

const SOLUTIONS_LIST = [
  'Automated GST billing in seconds',
  'Smart credit ledger with auto-reminders',
  'Live inventory with low-stock alerts',
  'Profit & loss reports in real-time',
  'WhatsApp payment collection links',
  'Multi-staff access with permissions',
];

const STEPS: StepProps[] = [
  { num: '01', title: 'Sign Up Free', desc: 'Create your account in 2 minutes. No credit card required. Instantly access your business dashboard.', icon: '🏪' },
  { num: '02', title: 'Add Your Business', desc: 'Set up customers, products, and billing. Import from Excel or Khatabook in minutes. Guided setup.', icon: '⚙️' },
  { num: '03', title: 'Start Managing', desc: 'Track everything from one smart dashboard. Bill, manage stock, collect payments. Watch business grow.', icon: '🚀' },
];

const TESTIMONIALS: TestimonialProps[] = [
  { initials: 'RS', name: 'Rahul Sharma', shop: 'Sharma Electronics', city: 'Delhi', text: 'Reduced billing time by 70% and improved monthly collections. I can\'t imagine running my shop without DukanDost Pro now.', result: '↑ 70% faster billing', avatarBg: '#FF6B00' },
  { initials: 'PG', name: 'Priya Gupta', shop: 'Gupta Textiles', city: 'Mumbai', text: 'Finally replaced 3 apps with one smart system. The inventory alerts alone saved me from running out of stock on my top items.', result: '3 apps → 1 platform', avatarBg: '#333' },
  { initials: 'AP', name: 'Amit Patel', shop: 'Patel General Store', city: 'Ahmedabad', text: 'Inventory mistakes dropped significantly. WhatsApp reminders are automatic — I collect dues without making a single awkward call.', result: '₹40K+ more collections/month', avatarBg: '#555' },
];

const PLANS: PlanProps[] = [
  {
    name: 'Starter',
    price: '₹0',
    desc: 'Perfect for new shops getting started',
    features: ['100 Customers', 'Basic Invoicing', 'Mobile App Access', 'Credit Ledger'],
    btnLabel: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '₹599',
    desc: 'Best for growing businesses',
    highlight: true,
    features: ['Unlimited Customers', 'GST Billing & Invoicing', 'Inventory Management', 'Staff Access (3 users)', 'WhatsApp Reminders', 'Advanced Reports'],
    btnLabel: 'Start Pro Trial',
  },
  {
    name: 'Business',
    price: '₹1,499',
    desc: 'For scaling enterprises',
    features: ['Multi-Shop Sync', 'Custom Branding', 'Priority Support', 'API Access', 'Unlimited Users'],
    btnLabel: 'Get Business',
  },
];

const FAQS: FAQItemProps[] = [
  { question: 'Is DukanDost Pro free to use?', answer: 'Yes! Our Starter plan is completely free forever with 100 customers, basic invoicing, and credit ledger features. Upgrade to Pro (₹599/month) or Business (₹1,499/month) anytime for advanced features.' },
  { question: 'Can I import data from OkCredit or Khatabook?', answer: 'Absolutely. We provide a seamless import tool that lets you migrate all your customer data, transaction history, and ledger entries from OkCredit, Khatabook, or any Excel file in minutes.' },
  { question: 'Can I use this on mobile?', answer: 'Yes! DukanDost Pro works perfectly on mobile, tablet, and desktop. Download our Android or iOS app, or use the full-featured web dashboard from any browser — your data syncs in real-time across all devices.' },
  { question: 'Is my business data secure?', answer: 'Your data is protected with AES-256 bank-grade encryption and stored on secure servers with automated daily cloud backups. We have 99.99% uptime and 24/7 security monitoring.' },
  { question: 'Do I need technical knowledge to use it?', answer: 'Not at all. DukanDost Pro is designed for shop owners, not tech experts. The interface supports Hindi and English, setup takes under 15 minutes, and our team provides free onboarding support.' },
];

const TRUSTED_BRANDS = ['Paytm', 'PhonePe', 'BharatPe', 'Amazon', 'Google', 'Microsoft'];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<any[]>([]);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/landing/testimonials');
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const [email, setEmail] = useState('');

  return (
    <MainLayout>
      {/* ── HERO ── */}
      <section id="home" className="relative pt-32 lg:pt-48 pb-20 overflow-hidden bg-white text-left">
        {/* Glow blobs based on reference */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[10%] right-[-100px] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            {/* Left Column: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-[45%]"
            >
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                All-in-one Business Management Platform
              </div>

              <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-extrabold text-black leading-[1.1] tracking-tighter mb-6">
                Everything Your<br />
                Business Needs,<br />
                <span className="text-primary">All in One Place.</span>
              </h1>

              <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                DukanDost Pro combines the best features of OkCredit, KhataBook, and MyBillBook — to help you manage customers, credit, invoicing, inventory, and more. Save time. Grow faster.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link to="/signup">
                  <button className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center gap-2">
                    Get Started Free
                  </button>
                </Link>
                <button className="bg-white border border-slate-200 text-black px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                  Book a Demo
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
                  ].map((url, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden flex items-center justify-center">
                       <img src={url} className="w-full h-full object-crop" alt="User Avatar" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-400">Trusted by 10,000+ businesses</p>
              </div>
            </motion.div>

            {/* Right Column: Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:w-[55%] relative"
            >
              <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-slate-100 rounded-full blur-3xl opacity-50" />
              <DashboardMockup />
              
              {/* Floating dot grid decoration */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 grid grid-cols-6 gap-2 opacity-10 pointer-events-none">
                 {Array.from({ length: 36 }).map((_, i) => (
                   <div key={i} className="w-1 h-1 bg-black rounded-full" />
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY LOGOS ── */}
      <div className="py-16 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12">
            Trusted by 10,000+ Small Businesses Across India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {TRUSTED_BRANDS.map((b) => (
              <span key={b} className="font-display text-2xl font-black tracking-tighter text-black hover:opacity-100 transition-all cursor-default">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ val, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center py-12 px-8 text-center bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-white border border-slate-100 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Icon size={26} />
                </div>
                <p className="font-display text-4xl md:text-5xl font-black text-black tracking-tighter leading-none mb-3">
                  {val.includes('+') ? (
                    <>{val.replace('+', '')}<span className="text-primary">+</span></>
                  ) : val.includes('%') ? (
                    <>{val.replace('%', '')}<span className="text-primary">%</span></>
                  ) : val.includes('/') ? (
                    <>{val.split('/')[0]}<span className="text-primary">/{val.split('/')[1]}</span></>
                  ) : (
                    val
                  )}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionTag>FEATURES</SectionTag>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-black mb-6 tracking-tighter">
              Everything You Need to<br />Run Your Business.
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              One platform. Complete control. Unlimited growth potential for every Indian business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <LocalFeatureCard key={f.title} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH PARTNERS / LOGO LOOP ── */}
      <section className="py-12 bg-white border-y border-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">
            Powered by Modern Industry Standards
          </p>
          <LogoLoop
            logos={TECH_LOGOS}
            speed={60}
            direction="left"
            logoHeight={40}
            gap={60}
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology stack"
          />
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionTag>COMPARISON</SectionTag>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-black mb-6 tracking-tighter">
              DukanDost Pro vs.<br />The Legacy Apps.
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Why use multiple apps when one powerful platform does everything better?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {COMPETITORS.map((comp) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'relative rounded-2xl p-7 border-[1.5px]',
                  comp.winner
                    ? 'bg-[#000] border-primary shadow-[0_16px_48px_rgba(255,107,0,0.2)] scale-[1.03]'
                    : 'bg-white border-slate-100'
                )}
              >
                {comp.winner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                    ⭐ Clear Winner
                  </div>
                )}
                <h3 className={cn('font-display text-[18px] font-extrabold mb-1', comp.winner ? 'text-white' : 'text-black')}>
                  {comp.winner ? (
                    <><span className="text-primary">Dukan</span>Dost Pro</>
                  ) : comp.name}
                </h3>
                <p className={cn('text-[11px] font-bold uppercase tracking-widest mb-5', comp.winner ? 'text-white/30' : 'text-slate-400')}>
                  {comp.tagline}
                </p>
                <ul className="flex flex-col gap-2.5 mb-5">
                  {comp.features.map((f) => (
                    <li key={f.label} className={cn('text-[13px] flex items-center gap-2.5', comp.winner ? 'text-white/75' : f.has ? 'text-slate-600' : 'text-slate-300')}>
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold',
                          comp.winner
                            ? 'bg-primary text-white'
                            : f.has
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-300'
                        )}
                      >
                        {f.has || comp.winner ? '✓' : '✗'}
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
                <p className={cn('text-[12px] pt-4 border-t italic', comp.winner ? 'text-white/25 border-white/10' : 'text-slate-400 border-slate-100')}>
                  {comp.missing}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM → SOLUTION ── */}
      <section id="solutions" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-20">
            <div className="lg:w-1/2">
              <SectionTag>PROBLEMS WE SOLVE</SectionTag>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-black mb-12 tracking-tighter leading-tight">
                Stop the Chaos.<br />Start Growing.
              </h2>
              <div className="flex flex-col gap-4">
                {PAIN_POINTS.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 bg-[#fff5f5] border border-[#fecaca] rounded-xl px-5 py-4"
                  >
                    <span className="text-[20px] mt-0.5 flex-shrink-0">{p.icon}</span>
                    <div>
                      <strong className="block text-[14px] font-semibold text-[#991b1b] mb-1">{p.title}</strong>
                      <span className="text-[13px] text-[#7f1d1d]">{p.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-primary rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                  <Shield size={160} className="text-white" />
                </div>
                <h3 className="font-display text-[28px] font-extrabold text-white leading-tight mb-4">
                  DukanDost Pro solves everything in one place.
                </h3>
                <p className="text-orange-100 text-[15px] leading-relaxed mb-10">
                  One login. One dashboard. Complete control over every aspect of your business — from the first bill to the last rupee collected.
                </p>
                <div className="flex flex-col gap-3.5">
                  {SOLUTIONS_LIST.map((s) => (
                    <div key={s} className="flex items-center gap-3 text-white text-[14px] font-medium">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold flex-shrink-0">✓</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionTag>SIMPLE STEPS</SectionTag>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-black tracking-tighter">
              Get Started in 3 Simple Steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="font-display text-[80px] font-extrabold text-slate-100 leading-none mb-[-20px] select-none">
                  {step.num}
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-8 relative">
                  <div className="text-[28px] mb-4">{step.icon}</div>
                  <h3 className="font-display text-[20px] font-bold text-black mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <ClientsSection
        id="testimonials"
        tagLabel="Happy Merchants"
        title="Merchants Love DukanDost Pro"
        description="Real shop owners. Real results. Real growth — powered by the all-in-one platform for modern Indian businesses."
        stats={[
          { value: '10K+', label: 'Active Shops' },
          { value: '₹2.5Cr+', label: 'Monthly Volume' },
          { value: '4.9/5', label: 'User Rating' },
        ]}
        testimonials={testimonials.length > 0 ? testimonials : [
          {
            name: "Rahul Sharma",
            title: "Sharma Electronics · Delhi",
            quote: "Reduced billing time by 70% and improved monthly collections. I can't imagine running my shop without DukanDost Pro now.",
            avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            rating: 5.0,
          },
          {
            name: "Priya Gupta",
            title: "Gupta Textiles · Mumbai",
            quote: "Finally replaced 3 apps with one smart system. The inventory alerts alone saved me from running out of stock on my top items.",
            avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            rating: 4.8,
          }
        ]}
        primaryActionLabel="Start Free Trial"
        secondaryActionLabel="View All Stories"
      />


      {/* ── COMPARISON SECTION (Best of All) ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <SectionTag>THE ALL-IN-ONE PLATFORM</SectionTag>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-black mb-6 tracking-tight">
              The Best of OkCredit, KhataBook & MyBillBook – <span className="text-primary">Now in One Place!</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium">
              Why use multiple apps when you can get everything in one powerful platform?
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
            {/* Card 1: OkCredit */}
            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">O</div>
                 <h3 className="text-xl font-bold text-emerald-600">OkCredit</h3>
               </div>
               <ul className="space-y-3 flex-1">
                 {['Customer Credit Management', 'Digital Ledger', 'Payment Reminders', 'Credit Tracking'].map(item => (
                   <li key={item} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                     <Check size={14} className="text-emerald-500" /> {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex items-center justify-center">
              <Plus className="text-slate-300 hidden lg:block" size={24} />
              <Plus className="text-slate-300 lg:hidden" size={24} />
            </div>

            {/* Card 2: KhataBook */}
            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">K</div>
                 <h3 className="text-xl font-bold text-red-600">KhataBook</h3>
               </div>
               <ul className="space-y-3 flex-1">
                 {['Business Ledger', 'Credit & Debit Entries', 'Payment Tracking', 'Customer Management'].map(item => (
                   <li key={item} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                     <Check size={14} className="text-red-500" /> {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex items-center justify-center">
              <Plus className="text-slate-300 hidden lg:block" size={24} />
              <Plus className="text-slate-300 lg:hidden" size={24} />
            </div>

            {/* Card 3: MyBillBook */}
            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">M</div>
                 <h3 className="text-xl font-bold text-orange-600">MyBillBook</h3>
               </div>
               <ul className="space-y-3 flex-1">
                 {['Invoicing & Billing', 'Inventory Management', 'Business Reports', 'Expense Tracking'].map(item => (
                   <li key={item} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                     <Check size={14} className="text-orange-500" /> {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="flex items-center justify-center">
              <Equal className="text-slate-300 hidden lg:block" size={24} />
              <Equal className="text-slate-300 lg:hidden rotate-90 lg:rotate-0" size={24} />
            </div>

            {/* Card 4: DukanDost Pro */}
            <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 shadow-xl shadow-indigo-200 relative transform lg:scale-105 border-4 border-white/20 flex flex-col">
               <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg rotate-12">
                 Best Value
               </div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold italic">D</div>
                 <h3 className="text-xl font-bold text-white">DukanDost Pro</h3>
               </div>
               <ul className="space-y-3 flex-1">
                 {['Everything in One App', 'More Power, More Control', 'Advanced Reports', 'Unlimited Growth'].map(item => (
                   <li key={item} className="flex items-center gap-3 text-white/90 text-sm font-bold">
                     <Check size={14} className="text-orange-400" /> {item}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-block bg-slate-50 border border-slate-100 px-8 py-3 rounded-full text-slate-400 text-[12px] font-bold uppercase tracking-[0.3em]">
               Problems We Solve
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY DUKANDOST / SCROLL STACK ── */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <SectionTag>WHY DUKANDOST</SectionTag>
            <h2 className="font-display text-5xl md:text-7xl font-extrabold text-black mb-8 tracking-tighter leading-[1.1]">
              Built for the <br /><span className="text-primary italic">Modern Merchant.</span>
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              We've re-engineered the retail experience from the ground up. Fast, secure, and incredibly easy to use.
            </p>
          </div>

          <ScrollStack 
            useWindowScroll={true} 
            itemDistance={600} 
            itemStackDistance={50}
            rotationAmount={0}
            blurAmount={0}
          >
            {/* Card 1: Billing */}
            <ScrollStackItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-4 md:p-8">
                <div>
                  <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-4xl font-display font-black mb-6 text-black tracking-tight">Hyper-Fast Billing</h3>
                  <p className="text-slate-500 text-xl leading-relaxed font-medium">
                    Create professional GST and non-GST invoices in under 10 seconds. Direct WhatsApp sharing and thermal print support.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['GST/Non-GST', 'WhatsApp Sync', 'Thermal Print', 'E-Way Bill'].map(t => (
                      <span key={t} className="px-4 py-2 bg-orange-50 text-primary text-xs font-bold rounded-full border border-orange-100 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-6xl font-black text-black mb-2 tracking-tighter">10s</div>
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Invoice Generation</div>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 2: Security */}
            <ScrollStackItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-4 md:p-8">
                <div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <Shield size={32} />
                  </div>
                  <h3 className="text-4xl font-display font-black mb-6 text-black tracking-tight">Iron-Clad Security</h3>
                  <p className="text-slate-500 text-xl leading-relaxed font-medium">
                    Your business data is encrypted and backed up daily on secure cloud servers. 99.9% uptime guaranteed.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['AES-256 Encryption', 'Daily Backups', 'GDPR Ready', 'Cloud Sync'].map(t => (
                      <span key={t} className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                      <div className="text-center">
                        <Lock size={64} className="text-blue-600 mb-4 mx-auto" />
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bank-Grade Protection</div>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 3: Inventory */}
            <ScrollStackItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-4 md:p-8">
                <div>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <Store size={32} />
                  </div>
                  <h3 className="text-4xl font-display font-black mb-6 text-black tracking-tight">Inventory Mastery</h3>
                  <p className="text-slate-500 text-xl leading-relaxed font-medium">
                    Track stock levels in real-time across multiple locations. Get low-stock alerts and manage expiry dates effortlessly.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['Multi-Location', 'Barcode Scan', 'Low Stock Alert', 'Expiry Tracking'].map(t => (
                      <span key={t} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-emerald-600/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                      <div className="text-center">
                        <Package size={64} className="text-emerald-600 mb-4 mx-auto" />
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Real-Time Tracking</div>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 4: Team */}
            <ScrollStackItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-4 md:p-8">
                <div>
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <Users size={32} />
                  </div>
                  <h3 className="text-4xl font-display font-black mb-6 text-black tracking-tight">Staff & Permissions</h3>
                  <p className="text-slate-500 text-xl leading-relaxed font-medium">
                    Manage your team with role-based access control. Monitor attendance and performance without being present.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['Role-Based Access', 'Daily Logs', 'Sales Tracking', 'Multi-User'].map(t => (
                      <span key={t} className="px-4 py-2 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100 uppercase tracking-widest">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative aspect-square md:aspect-[4/3] bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex items-center justify-center p-8">
                      <div className="text-center">
                        <Users size={64} className="text-purple-600 mb-4 mx-auto" />
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Secure Team Management</div>
                      </div>
                   </div>
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionTag>PRICING</SectionTag>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-black mb-6 tracking-tighter">
              A Plan for Every Stage of<br />Your <span className="text-primary italic">Journey.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Start free, grow fast, and scale with confidence. No hidden charges, just pure business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* STARTER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] border border-slate-100 flex flex-col bg-white hover:border-orange-200 transition-all duration-500 group"
            >
              <div className="mb-8">
                <h4 className="text-2xl font-black text-black mb-2">Starter</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Perfect for New Shops</p>
              </div>
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-slate-50">
                <span className="text-5xl font-display font-black text-black">₹0</span>
                <span className="text-slate-400 font-bold text-sm">/forever</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['100 Customers', 'Basic Invoicing', 'Mobile App Access', 'Credit Ledger', 'Standard Reports'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Check size={16} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <button className="w-full py-5 rounded-2xl bg-slate-50 text-slate-600 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-orange-50 hover:text-primary transition-all">
                  Get Started Free
                </button>
              </Link>
            </motion.div>

            {/* PRO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] border border-primary flex flex-col bg-white scale-105 z-10 shadow-2xl shadow-orange-100 relative group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Sparkles size={12} /> MOST POPULAR
              </div>
              <div className="mb-8">
                <h4 className="text-2xl font-black text-black mb-2">Pro</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Best for Growing Shops</p>
              </div>
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-slate-50">
                <span className="text-5xl font-display font-black text-black">₹299</span>
                <span className="text-slate-400 font-bold text-sm">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Unlimited Customers', 'GST Billing & Invoicing', 'Inventory Management', 'Staff Access (3 Users)', 'WhatsApp Reminders', 'Advanced Reports', 'UPI QR'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Check size={16} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <button className="w-full py-5 rounded-2xl bg-primary text-white shadow-xl shadow-orange-100 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-primary-dark hover:-translate-y-1 transition-all">
                  Start Pro
                </button>
              </Link>
            </motion.div>

            {/* BUSINESS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] border border-slate-900 flex flex-col bg-[#0A0B1A] text-white hover:-translate-y-1 transition-all duration-500 group"
            >
              <div className="mb-8">
                <h4 className="text-2xl font-black text-white mb-2">Business</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scaling Businesses</p>
              </div>
              <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
                <span className="text-5xl font-display font-black text-white">₹999</span>
                <span className="text-slate-400 font-bold text-sm">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Everything in Pro', 'Multi-Shop Sync', 'Custom Branding', 'Priority Support', 'API Access', 'Unlimited Users', 'Advanced AI Intelligence'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-white/90">
                    <Check size={16} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open(`https://wa.me/910000000000?text=${encodeURIComponent('Hello, I am interested in the DukanDost Pro Business Plan.')}`, '_blank')}
                className="w-full py-5 rounded-2xl bg-white text-slate-900 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-slate-100 transition-all hover:-translate-y-1"
              >
                Contact for Business Plan
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionTag>FAQ</SectionTag>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-black tracking-tighter">
              Frequently Asked Questions.
            </h2>
          </div>
          <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
            {FAQS.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <div className="py-20 bg-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 flex-wrap">
            <div>
              <h2 className="font-display text-[28px] font-extrabold text-black tracking-tight">
                Get Weekly Business Growth Tips
              </h2>
              <p className="text-slate-500 text-[15px] mt-2">
                Smart strategies, product updates, and growth insights — delivered free every week.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-5 py-3.5 border border-orange-200 bg-white rounded-xl text-[14px] text-black placeholder:text-slate-400 focus:outline-none focus:border-primary min-w-[280px] transition-colors"
              />
              <button className="bg-primary hover:bg-primary-dark text-white font-bold text-[13px] uppercase tracking-widest px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Subscribe Free <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <section id="contact-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0A0A0A] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* Text */}
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-primary bg-orange-950/60 px-4 py-1.5 rounded-full mb-5">
                  Ready to Grow?
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tighter leading-tight">
                  Ready to Replace 3 Apps With{' '}
                  <span className="text-primary">1 Powerful Platform?</span>
                </h2>
                <p className="text-white/55 text-[17px] font-medium mb-10 leading-relaxed">
                  Stop managing credit, billing, inventory, and reports separately. Run everything from one smarter platform built for serious business growth.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link to="/signup">
                    <button className="bg-primary text-white px-9 py-4.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center gap-2">
                      Start Free Trial <ArrowRight size={16} />
                    </button>
                  </Link>
                  <Link to="/contact">
                    <button className="bg-white/10 text-white border border-white/20 px-9 py-4.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                      Book Live Demo
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-5 mt-8 justify-center lg:justify-start">
                  {['Setup in 10 minutes', 'No credit card required', 'Free onboarding support'].map((b) => (
                    <span key={b} className="flex items-center gap-2 text-[13px] text-white/35">
                      <Check size={13} className="text-primary" /> {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact form */}
              <div className="w-full max-w-[400px] bg-white p-9 rounded-[2rem] shadow-2xl">
                <h4 className="font-display text-[20px] font-bold text-black mb-7">Send us a message</h4>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] text-black placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Email</label>
                    <input
                      type="email"
                      placeholder="rahul@myshop.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] text-black placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-[14px] text-black placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button className="w-full bg-[#0A0A0A] text-white py-4 rounded-xl font-bold text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-all mt-1 flex items-center justify-center gap-2">
                    Send Message <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is provided by MainLayout */}
    </MainLayout>
  );
}