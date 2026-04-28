import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Check, X, Shield, Zap, Building2, ArrowRight, Lock, Star, Sparkles, Crown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    { 
      name: "Starter", 
      monthly: "0", 
      yearly: "0",
      tagline: "Perfect for New Shops Getting Started",
      desc: "True Free Plan", 
      btnLabel: "Get Started Free",
      features: [
        "100 Customers", 
        "Basic Invoicing", 
        "Mobile App Access", 
        "Credit Ledger", 
        "Standard Reports"
      ],
      notIncluded: [
        "Unlimited Customers",
        "GST Billing", 
        "Inventory Management", 
        "Staff Access", 
        "WhatsApp Reminders",
        "Advanced Reports"
      ]
    },
    { 
      name: "Pro", 
      monthly: "299", 
      yearly: "249",
      tagline: "Best for Growing Shops and Daily Operations",
      desc: "Most Popular", 
      highlight: true, 
      btnLabel: "Start Pro",
      features: [
        "Unlimited Customers", 
        "GST Billing & Invoicing", 
        "Inventory Management", 
        "Staff Access (3 Users)", 
        "WhatsApp Reminders", 
        "Advanced Reports", 
        "UPI QR + Payment Links"
      ],
      notIncluded: [
        "API Access", 
        "Multi-Shop Sync",
        "AI Intelligence"
      ]
    },
    { 
      name: "Business", 
      monthly: "999", 
      yearly: "849",
      tagline: "Built for Multi-Shop Owners and Serious Growth",
      desc: "Premium Enterprise", 
      btnLabel: "Get Business Plan",
      dark: true,
      features: [
        "Everything in Pro Plan", 
        "Multi-Shop Sync", 
        "Custom Branding", 
        "Priority Support", 
        "API Access", 
        "Unlimited Users",
        "Advanced AI Intelligence",
        "Dedicated Account Manager",
        "WhatsApp Business API"
      ],
      notIncluded: []
    }
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Pricing' }]} />
        <PageHeader 
          centered
          badge="PRICING PLANS"
          title="Scale your business with zero friction."
          subtitle="Simple, transparent pricing designed for Indian business owners. Start free, grow big."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-20">
           <span className={cn("text-sm font-bold uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? "text-[#000]" : "text-slate-400")}>Monthly</span>
           <button 
             onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
             className="w-16 h-8 bg-slate-100 rounded-full p-1 relative transition-colors border border-slate-200"
           >
              <div className={cn("w-6 h-6 bg-[#FF6B00] rounded-full transition-all duration-300 shadow-lg shadow-orange-100", billingCycle === 'yearly' ? "translate-x-8" : "translate-x-0")} />
           </button>
           <span className={cn("text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2", billingCycle === 'yearly' ? "text-[#000]" : "text-slate-400")}>
              Yearly <span className="bg-green-100 text-green-600 text-[8px] px-2 py-1 rounded-full">-20% OFF</span>
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32">
           {plans.map((plan, i) => (
             <div key={i} className={cn(
               "p-10 rounded-[3rem] border transition-all duration-500 relative flex flex-col",
               plan.highlight 
                ? "border-[#FF6B00] shadow-2xl shadow-orange-100 scale-105 z-10 bg-white" 
                : plan.dark 
                  ? "bg-[#0A0B1A] border-slate-900 text-white" 
                  : "bg-white border-slate-100 hover:border-orange-200"
             )}>
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF6B00] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Sparkles size={12} /> MOST POPULAR
                  </div>
                )}
                
                <div className="mb-8">
                   <h4 className={cn("text-2xl font-black mb-2", plan.dark ? "text-white" : "text-black")}>{plan.name}</h4>
                   <p className={cn("text-[10px] font-bold uppercase tracking-widest", plan.dark ? "text-slate-400" : "text-slate-500")}>{plan.tagline}</p>
                </div>

                <div className={cn("flex items-baseline gap-2 mb-8 pb-8 border-b", plan.dark ? "border-white/10" : "border-slate-50")}>
                   <span className={cn("text-5xl font-display font-black", plan.dark ? "text-white" : "text-black")}>
                     ₹{billingCycle === 'monthly' ? plan.monthly : (plan.name === 'Starter' ? '0' : Math.floor(parseInt(plan.monthly) * 10))}
                   </span>
                   <span className="text-slate-400 font-bold text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                   {plan.features.map(f => (
                     <li key={f} className={cn("flex items-center gap-3 text-sm font-bold", plan.dark ? "text-white/90" : "text-slate-700")}>
                        <Check size={16} className="text-[#FF6B00] shrink-0" /> {f}
                     </li>
                   ))}
                   {plan.notIncluded.map(f => (
                     <li key={f} className="flex items-center gap-3 text-slate-300 text-sm font-medium opacity-40">
                        <Lock size={14} className="text-slate-200 shrink-0" /> {f}
                     </li>
                   ))}
                </ul>

                {plan.dark ? (
                  <button 
                    onClick={() => window.open(`https://wa.me/910000000000?text=${encodeURIComponent('Hello, I am interested in the DukanDost Pro Business Plan.')}`, '_blank')}
                    className="mt-auto w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all bg-white text-slate-900 hover:bg-slate-100 hover:-translate-y-1"
                  >
                    Contact for Business Plan
                  </button>
                ) : (
                  <Link to="/signup" className="mt-auto">
                    <button className={cn(
                      "w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all",
                      plan.highlight 
                        ? "bg-[#FF6B00] text-white shadow-xl shadow-orange-100 hover:bg-[#E65A00] hover:-translate-y-1" 
                        : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00]"
                    )}>
                      {plan.btnLabel}
                    </button>
                  </Link>
                )}
             </div>
           ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-48 mb-32">
           <div className="text-center mb-20">
              <SectionTag>FULL COMPARISON</SectionTag>
              <h2 className="text-4xl md:text-6xl font-display font-black text-black tracking-tighter mb-6">Compare Plans Side-by-Side</h2>
              <p className="text-slate-500 text-lg font-medium">Every feature mapped out so you can choose the best for your business.</p>
           </div>
           
           <div className="overflow-hidden bg-white border border-slate-100 rounded-[3rem] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="py-10 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Features</th>
                        <th className="py-10 px-8 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Starter (Free)</th>
                        <th className="py-10 px-8 text-[11px] font-black text-[#FF6B00] uppercase tracking-[0.2em]">Pro</th>
                        <th className="py-10 px-8 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Business</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {[
                        { f: "Customers Limit", s: "100", p: "Unlimited", b: "Unlimited" },
                        { f: "Basic Invoicing", s: "Yes", p: "Yes", b: "Yes" },
                        { f: "GST Billing & Filing", s: "No", p: "Yes", b: "Yes" },
                        { f: "Inventory Tracking", s: "Basic", p: "Advanced", b: "Advanced" },
                        { f: "WhatsApp Reminders", s: "No", p: "Yes", b: "Yes" },
                        { f: "Staff Members", s: "1 (Owner)", p: "3 Users", b: "Unlimited" },
                        { f: "Advanced Reports", s: "No", p: "Yes", b: "Yes" },
                        { f: "Multi-Shop Sync", s: "No", p: "No", b: "Yes" },
                        { f: "AI Intelligence", s: "No", p: "No", b: "Yes" },
                        { f: "API Access", s: "No", p: "No", b: "Yes" },
                        { f: "Support", s: "Community", p: "Priority", b: "24/7 Dedicated" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-8 px-8 text-sm font-bold text-slate-700">{row.f}</td>
                          <td className="py-8 px-8 text-sm font-medium text-slate-500">
                            {row.s === 'Yes' ? <Check size={16} className="text-emerald-500" /> : row.s === 'No' ? <X size={16} className="text-slate-200" /> : row.s}
                          </td>
                          <td className="py-8 px-8 text-sm font-black text-[#FF6B00]">
                            {row.p === 'Yes' ? <Check size={16} className="text-[#FF6B00]" /> : row.p}
                          </td>
                          <td className="py-8 px-8 text-sm font-bold text-slate-900">
                            {row.b === 'Yes' ? <Check size={16} className="text-slate-900" /> : row.b}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      <CTASection 
        title="Ready to Grow Your Business?"
        subtitle="Join 10,000+ businesses who have already upgraded to a smarter way of working."
        btnText="START FREE TRIAL"
        btnPath="/signup"
      />
    </MainLayout>
  );
}
