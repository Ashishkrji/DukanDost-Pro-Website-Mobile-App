import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Star, Check, Zap, Crown, Shield, Headphones, 
  ChevronRight, Sparkles, CreditCard, Lock, 
  CheckCircle2, AlertCircle, Loader2, Store, Users, BarChart3, Package,
  Briefcase, Send, Clock
} from 'lucide-react';
import { Button, Card, PageHeader, Badge } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import axios from 'axios';

const RAZORPAY_KEY_ID = import.meta.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890'; 

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PLAN_DATA = {
  starter: {
    name: 'Starter Plan',
    monthlyPrice: 0,
    tagline: 'Perfect for New Shops Getting Started',
    badge: 'Always Free',
    features: [
      '100 Customers',
      'Basic Invoicing',
      'Mobile App Access',
      'Credit Ledger',
      'Standard Reports'
    ]
  },
  pro: {
    name: 'Pro Plan',
    monthlyPrice: 149,
    tagline: 'Best for Growing Shops and Daily Operations',
    badge: 'Most Popular',
    features: [
      'Unlimited Customers',
      'GST Billing & Invoicing',
      'Inventory Management',
      'Staff Access (3 Users)',
      'WhatsApp Reminders',
      'Advanced Reports',
      'UPI QR + Payment Links'
    ]
  },
  business: {
    name: 'Business Plan',
    monthlyPrice: 499,
    tagline: 'Enterprise Features for Scaling Businesses',
    badge: 'Ultimate Power',
    features: [
      'Everything in Pro Plan',
      'Multi-Shop Management',
      'Auto WhatsApp Reminders',
      'Staff Access (Unlimited)',
      'Dedicated Account Manager',
      'Priority 24/7 Support',
      'Smart Collection Insights'
    ]
  }
};

const DURATIONS = [
  { id: 1, label: '1 Month', multiplier: 1, discount: 0, tag: null },
  { id: 12, label: '1 Year', multiplier: 12, discount: 20, tag: '20% OFF' },
  { id: 24, label: '2 Years', multiplier: 20, discount: 16.6, tag: '2 MONTHS FREE / YR' },
  { id: 48, label: '4 Years', multiplier: 40, discount: 16.6, tag: 'BEST VALUE' },
  { id: 120, label: '10 Years', multiplier: 100, discount: 16.6, tag: 'DECADAL SAVER' },
];

// ─── Components ─────────────────────────────────────────────────────────────

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | null>(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    ownerName: '',
    shopName: '',
    contactNumber: '',
    query: ''
  });
  const { showToast } = useStore();
  const { user, setUser, subscriptionDetails, token } = useAuthStore();

  useEffect(() => {
    if (user && showBusinessModal) {
      setBusinessForm({
        ownerName: user.fullName || '',
        shopName: user.businessName || '',
        contactNumber: user.phone || '',
        query: ''
      });
    }
  }, [user, showBusinessModal]);

  const handleStartPlan = (planKey: 'pro' | 'business') => {
    setSelectedPlan(planKey);
    if (planKey === 'business') {
      setShowBusinessModal(true);
    } else {
      setShowDurationModal(true);
    }
  };

  const handleBusinessInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/subscription/business-inquiry`, {
        ...businessForm,
        email: user?.email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setInquirySuccess(true);
        showToast('Inquiry Submitted Successfully', 'success');
      }
    } catch (err) {
      showToast('Failed to submit inquiry', 'error');
    } finally {
      setInquiryLoading(false);
    }
  };

  const handlePayment = async (duration: typeof DURATIONS[0]) => {
    if (!selectedPlan) return;
    const plan = PLAN_DATA[selectedPlan];
    
    // Calculate amount based on logic
    // 1 month = base
    // 12 months = base * 12 * 0.8 (20% off)
    // 24+ months = base * (duration - (2 * (duration/12))) 
    // Actually simpler logic for durations > 12: pay for 10 months per year
    let amount = 0;
    if (duration.id === 1) {
      amount = plan.monthlyPrice;
    } else if (duration.id === 12) {
      amount = Math.round(plan.monthlyPrice * 12 * 0.8);
    } else {
      const years = duration.id / 12;
      amount = plan.monthlyPrice * 10 * years;
    }
    
    setLoadingPlan(selectedPlan);
    setShowDurationModal(false);
    
    // Load Razorpay Script
    const scriptRes = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!scriptRes) {
      showToast('Razorpay SDK failed to load.', 'error');
      setLoadingPlan(null);
      return;
    }

    try {
      const { data: orderData } = await axios.post('/api/subscription/create-order', {
        planName: selectedPlan === 'pro' ? 'Pro' : 'Business',
        billingType: duration.label,
        durationMonths: duration.id,
        amount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('dd_token')}` }
      });

      if (!orderData.success) throw new Error('Order creation failed');

      const options = {
        key: orderData.key || RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'DukanDost Pro',
        description: `${plan.name} - ${duration.label}`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            const { data: verifyData } = await axios.post('/api/subscription/verify-payment', {
              ...response,
              planName: selectedPlan === 'pro' ? 'Pro' : 'Business',
              billingType: duration.label,
              durationMonths: duration.id,
              amount
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('dd_token')}` }
            });

            if (verifyData.success) {
              setPaymentState('success');
              if (user) {
                setUser({ ...user, plan: verifyData.plan as any });
              }
            } else {
              setPaymentState('failure');
            }
          } catch (err) {
            setPaymentState('failure');
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: { color: '#FF6B00' },
        modal: { ondismiss: () => setLoadingPlan(null) }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      showToast('Could not initiate payment.', 'error');
      setLoadingPlan(null);
    }
  };

  if (paymentState === 'success') {
    return <Navigate to="/success" state={{ 
      title: "Subscription Activated Successfully", 
      message: "Your premium features are now unlocked. Welcome to the elite tier of DukanDost Pro!",
      nextPath: "/dashboard" 
    }} />;
  }

  if (paymentState === 'failure') {
    return <Navigate to="/payment-failure" state={{ 
      message: "Something went wrong during the transaction. Please try again or contact support." 
    }} />;
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16 px-4 animate-in fade-in duration-700">
      {/* ── SECTION 0 — MANAGE SUBSCRIPTION (Premium Only) ── */}
      {user?.plan !== 'Starter' && (
        <Card className="p-8 border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Crown size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge status="success" className="bg-orange-500 border-none text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Active {user?.plan}</Badge>
                {subscriptionDetails?.cancelAtPeriodEnd && <Badge status="danger" className="animate-pulse px-4 py-1.5 rounded-full text-xs font-bold">Cancelling Soon</Badge>}
              </div>
              <h2 className="text-3xl font-black mb-2">Manage Your Subscription</h2>
              <p className="text-slate-400 font-medium">
                Your premium features are active until <span className="text-white font-bold">{subscriptionDetails?.endDate ? new Date(subscriptionDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'next billing'}</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {!subscriptionDetails?.cancelAtPeriodEnd ? (
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-[11px]"
                  onClick={async () => {
                    if (confirm('Are you sure you want to cancel? Your premium features will remain active until the end of your billing cycle.')) {
                      try {
                        await axios.post('/api/subscription/cancel-plan', {}, {
                          headers: { Authorization: `Bearer ${localStorage.getItem('dd_token')}` }
                        });
                        showToast('Subscription will cancel at period end.');
                        window.location.reload();
                      } catch {
                        showToast('Failed to cancel subscription', 'error');
                      }
                    }
                  }}
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Button className="bg-primary text-white h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-[11px]">Renew Now</Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ── SECTION 1 — HERO ── */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-[#FF6B00] text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
          <Sparkles size={12} className="animate-pulse" />
          Premium Features Available
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Choose the Right Plan for<br />Your <span className="text-[#FF6B00]">Business Growth</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto mb-6">
          Upgrade your business operations with premium tools built for serious growth, better collections, smarter billing, and complete business control.
        </p>
      </div>

      {/* ── SECTION 3 — PRICING PLANS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* STARTER PLAN */}
        <Card className="relative overflow-hidden border-2 border-slate-100 transition-all duration-500 hover:scale-[1.02] bg-white">
          <div className="absolute top-5 right-5">
            <Badge status="info">{PLAN_DATA.starter.badge}</Badge>
          </div>
          <div className="p-8 pb-0">
            <h3 className="font-display text-2xl font-black text-slate-900 mb-4">{PLAN_DATA.starter.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-5xl font-black text-slate-900">₹0</span>
              <span className="text-slate-400 font-bold">/month</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-8">
              {PLAN_DATA.starter.tagline}
            </p>
          </div>
          <div className="p-8 pt-0 space-y-8">
            <div className="space-y-4">
              {PLAN_DATA.starter.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <div className="w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-slate-400" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <Button 
              className="w-full h-14 font-black uppercase tracking-widest text-sm rounded-2xl bg-slate-50 text-slate-400 cursor-not-allowed"
              disabled
            >
              {user?.plan === 'Starter' ? 'Current Plan' : 'Active Forever'}
            </Button>
          </div>
        </Card>

        {/* PRO PLAN */}
        <Card className={cn(
          "relative overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02]",
          "border-[#FF6B00] shadow-2xl shadow-[#FF6B00]/10"
        )}>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6B00]" />
          <div className="absolute top-5 right-5">
            <Badge status="warning">{PLAN_DATA.pro.badge}</Badge>
          </div>
          <div className="p-8 pb-0">
            <h3 className="font-display text-2xl font-black text-slate-900 mb-4">{PLAN_DATA.pro.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-5xl font-black text-slate-900">
                ₹{PLAN_DATA.pro.monthlyPrice}
              </span>
              <span className="text-slate-400 font-bold">/month</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-8">
              {PLAN_DATA.pro.tagline}
            </p>
          </div>
          <div className="p-8 pt-0 space-y-8">
            <div className="space-y-4">
              {PLAN_DATA.pro.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <div className="w-5 h-5 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#FF6B00]" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <Button 
              className="w-full h-14 font-black uppercase tracking-widest text-sm rounded-2xl bg-[#FF6B00] hover:bg-[#E56000] text-white shadow-xl shadow-[#FF6B00]/20"
              onClick={() => handleStartPlan('pro')}
              disabled={!!loadingPlan || user?.plan === 'Pro' || user?.plan === 'Business'}
            >
              {loadingPlan === 'pro' ? <Loader2 className="animate-spin" /> : user?.plan === 'Pro' || user?.plan === 'Business' ? 'Plan Active' : 'Upgrade to Pro'}
            </Button>
          </div>
        </Card>

        {/* BUSINESS PLAN */}
        <Card className={cn(
          "relative overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02]",
          "border-slate-900 bg-[#0A0B1A] text-white"
        )}>
          <div className="absolute top-5 right-5">
            <Badge status="success">{PLAN_DATA.business.badge}</Badge>
          </div>
          <div className="p-8 pb-0">
            <h3 className="font-display text-2xl font-black text-white mb-4">{PLAN_DATA.business.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-5xl font-black text-white">
                ₹{PLAN_DATA.business.monthlyPrice}
              </span>
              <span className="text-slate-400 font-bold">/month</span>
            </div>
            <p className="text-slate-300 text-sm font-medium mb-8">
              {PLAN_DATA.business.tagline}
            </p>
          </div>
          <div className="p-8 pt-0 space-y-8">
            <div className="space-y-4">
              {PLAN_DATA.business.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-white/90 font-medium text-sm">
                  <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#FF6B00]" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <Button 
              className="w-full h-14 font-black uppercase tracking-widest text-sm rounded-2xl bg-white text-slate-900 hover:bg-slate-100 shadow-xl"
              onClick={() => handleStartPlan('business')}
              disabled={!!loadingPlan || user?.plan === 'Business'}
            >
              {loadingPlan === 'business' ? <Loader2 className="animate-spin" /> : user?.plan === 'Business' ? 'Plan Active' : 'Start Business'}
            </Button>
          </div>
        </Card>
      </div>

      {/* ── SECTION 4 — TRUST SECTION ── */}
      <div className="bg-slate-50 rounded-[40px] p-12 border border-slate-100">
        <h2 className="font-display text-3xl font-black text-slate-900 text-center mb-12 tracking-tight">Why Businesses Upgrade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <CreditCard />, title: 'Faster payment collection', desc: 'Auto-reminders and UPI links ensure you get paid 3x faster.' },
            { icon: <Zap />, title: 'Better inventory control', desc: 'Real-time stock tracking with intelligent low-stock alerts.' },
            { icon: <Shield />, title: 'Reduced billing mistakes', desc: '100% accurate GST billing that keeps your records clean.' },
            { icon: <Users />, title: 'Team management made simple', desc: 'Role-based access for your staff with full activity tracking.' },
            { icon: <BarChart3 />, title: 'Advanced reports', desc: 'Visual analytics to help you make smarter business decisions.' },
            { icon: <Package />, title: 'One platform', desc: 'No more juggling 5 different apps. Everything is here.' },
          ].map(p => (
            <div key={p.title} className="flex gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF6B00] shadow-sm flex-shrink-0">
                {p.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{p.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 5 — PAYMENT TRUST BADGES ── */}
      <div className="py-8 border-y border-slate-100">
        <div className="flex flex-wrap justify-center items-center gap-12">
          {[
            'Secure Razorpay Payments',
            'GST Invoice Available',
            'Cancel Anytime',
            'No Hidden Charges',
            'Safe & Encrypted Checkout',
            'Dedicated Support'
          ].map(badge => (
            <div key={badge} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <CheckCircle2 size={14} className="text-green-500" />
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 6 — FAQ ── */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-display text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">Frequently Asked Questions</h2>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of the current billing cycle.' },
          { q: 'Is GST invoice provided?', a: 'Absolutely! We provide GST-compliant tax invoices for every payment. You can download them directly from your billing history.' },
          { q: 'Can I switch plans later?', a: 'Yes, you can upgrade from Pro to Business plan at any time. The remaining balance of your current plan will be adjusted pro-rata.' },
          { q: 'Is yearly plan cheaper?', a: 'Yes! The yearly plan offers a significant 20% discount compared to monthly billing — effectively giving you 2 months free.' },
          { q: 'Do I get onboarding support?', a: 'Yes, all premium users get 1-on-1 onboarding support. Business plan users get a dedicated account manager for priority assistance.' },
          { q: 'Is Razorpay payment secure?', a: 'Razorpay is Indias leading payment gateway with PCI-DSS compliance and bank-grade security for 100% safe transactions.' },
        ].map(faq => (
          <details key={faq.q} className="group bg-white border border-slate-100 rounded-2xl transition-all">
            <summary className="p-6 flex items-center justify-between cursor-pointer font-bold text-slate-900 list-none">
              {faq.q}
              <ChevronRight size={18} className="text-slate-400 transition-transform group-open:rotate-90" />
            </summary>
            <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="text-center pt-10">
        <p className="text-slate-400 text-sm font-medium mb-4">Questions? We’re here to help.</p>
        <Button variant="outline" className="rounded-full px-10">Contact Support</Button>
      </div>
      {/* Business Inquiry Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-[#0A0B1A] p-10 text-white relative">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Briefcase size={120} />
              </div>
              <div className="relative z-10">
                <Badge status="warning" className="bg-orange-500 border-none text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Enterprise Edition</Badge>
                <h3 className="text-3xl font-black tracking-tight mb-2">Scale with Business Plan</h3>
                <p className="text-slate-400 font-medium max-w-md">Our enterprise team will help you set up multi-shop management, custom workflows, and dedicated support.</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowBusinessModal(false);
                  setInquirySuccess(false);
                }}
                className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-20"
              >
                ✕
              </button>
            </div>

            <div className="p-10">
              {inquirySuccess ? (
                <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900">Inquiry Received!</h4>
                    <p className="text-slate-500 font-bold mt-4 leading-relaxed px-4">
                      Apka query succesfully submit ho gya hai.<br />
                      <span className="text-[#FF6B00]">Apse 24-48 hours me contact karegi team hamari.</span>
                    </p>
                  </div>
                  <Button 
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest"
                    onClick={() => {
                      setShowBusinessModal(false);
                      setInquirySuccess(false);
                    }}
                  >
                    Got it, Thanks!
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBusinessInquiry} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Owner Name</label>
                      <input 
                        required
                        value={businessForm.ownerName} 
                        onChange={(e) => setBusinessForm({...businessForm, ownerName: e.target.value})}
                        placeholder="Enter your full name"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Name</label>
                      <input 
                        required
                        value={businessForm.shopName} 
                        onChange={(e) => setBusinessForm({...businessForm, shopName: e.target.value})}
                        placeholder="Enter shop/business name"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile No</label>
                      <input 
                        required
                        value={businessForm.contactNumber} 
                        onChange={(e) => setBusinessForm({...businessForm, contactNumber: e.target.value})}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Query (Optional)</label>
                      <input 
                        value={businessForm.query} 
                        onChange={(e) => setBusinessForm({...businessForm, query: e.target.value})}
                        placeholder="How can we help you?"
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Rapid Response Guaranteed</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Our team monitors these requests 24/7. We prioritize Business Plan inquiries for immediate onboarding.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button 
                      type="submit" 
                      className="flex-1 h-16 bg-[#FF6B00] hover:bg-[#E56000] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20"
                      loading={inquiryLoading}
                      icon={<Send size={18} />}
                    >
                      Submit Inquiry
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 h-16 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
                      onClick={() => window.open(`https://wa.me/919876543210?text=Hi, I am interested in DukanDost Pro Business Plan for my business: ${businessForm.shopName}`, '_blank')}
                      icon={<Users size={18} />}
                    >
                      Direct WhatsApp
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Duration Selection Modal */}
      {showDurationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Choose Plan Duration</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
                  Selected: <span className="text-[#FF6B00]">{selectedPlan?.toUpperCase()}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowDurationModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {DURATIONS.map((d) => {
                const planPrice = PLAN_DATA[selectedPlan!].monthlyPrice;
                let totalAmount = 0;
                if (d.id === 1) totalAmount = planPrice;
                else if (d.id === 12) totalAmount = Math.round(planPrice * 12 * 0.8);
                else totalAmount = planPrice * 10 * (d.id / 12);

                return (
                  <button
                    key={d.id}
                    onClick={() => handlePayment(d)}
                    className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-200 rounded-2xl transition-all group"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-black text-slate-900">{d.label}</p>
                        {d.tag && (
                          <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            {d.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {d.id === 1 ? 'Monthly billing' : `₹${Math.round(totalAmount/d.id)} per month`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 group-hover:text-[#FF6B00]">₹{totalAmount.toLocaleString('en-IN')}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-bold">
                        Secure Payment <ChevronRight size={10} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-8 bg-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-slate-100 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">100% Secure Checkout</p>
                <p className="text-[11px] text-slate-500 font-medium">Verified by Razorpay. Zero hidden charges.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
