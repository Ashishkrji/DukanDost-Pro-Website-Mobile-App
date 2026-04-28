import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection } from '../../components/layout/PageComponents';
import { RefreshCcw, ShieldCheck, Clock, HelpCircle, FileText, CheckCircle } from 'lucide-react';

const PolicyBox = ({ icon: Icon, title, desc }: any) => (
  <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white hover:shadow-2xl transition-all group">
     <div className="w-14 h-14 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
        <Icon size={28} />
     </div>
     <h3 className="text-xl font-display font-semibold text-[#000] mb-4">{title}</h3>
     <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
  </div>
);

export default function RefundPolicy() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Refund Policy' }]} />
        <PageHeader 
          badge="SATISFACTION GUARANTEE"
          title="Simple & Transparent Refunds."
          subtitle="We stand behind our nodal management system. If you're not completely satisfied, we're here to make it right."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-32">
           <PolicyBox 
             icon={Clock} 
             title="14-Day Free Trial" 
             desc="Test every single feature of DukanDost Pro for 14 days without spending a single rupee. No credit card required." 
           />
           <PolicyBox 
             icon={ShieldCheck} 
             title="No-Questions Asked" 
             desc="Cancel your subscription anytime within the first 7 days of your first payment for a full refund." 
           />
           <PolicyBox 
             icon={RefreshCcw} 
             title="Instant Processing" 
             desc="Approved refunds are processed instantly and reflect in your original payment method within 5-7 business days." 
           />
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-100/50 mb-32">
           <h2 className="text-3xl font-display font-semibold text-[#000] mb-12">Detailed Refund Policy</h2>
           <div className="space-y-12">
              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">1. SUBSCRIPTION CANCELLATION</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">You can cancel your DukanDost Pro subscription at any time through your dashboard settings. Upon cancellation, you will continue to have access to the platform until the end of your current billing period.</p>
              </section>

              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">2. ELIGIBILITY FOR REFUND</h4>
                 <ul className="space-y-4">
                    {[
                      "First-time subscriptions cancelled within 7 days of payment.",
                      "Accidental double-payments for the same billing period.",
                      "Technical failures that prevent nodal platform access for more than 48 hours.",
                      "Unused credits in custom enterprise wallets."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-500 font-medium">
                         <CheckCircle size={20} className="text-[#FF6B00] shrink-0 mt-0.5" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </section>

              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">3. NON-REFUNDABLE CASES</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">Refunds are not provided for partial months of service, annual plan cancellations after 7 days, or accounts terminated due to violations of our Terms of Service.</p>
              </section>
           </div>
        </div>

        <div className="p-12 md:p-20 bg-orange-50 rounded-[4rem] border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-12 mb-32">
           <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-display font-semibold text-orange-900 mb-4">Have a special request?</h3>
              <p className="text-orange-800/80 font-medium">We understand that every business situation is unique. If you have concerns about your billing, please reach out to our dedicated support managers.</p>
           </div>
           <button className="bg-[#FF6B00] text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E65A00] transition-all shadow-xl shadow-orange-200">
              TALK TO BILLING
           </button>
        </div>
      </div>

      <CTASection 
        title="Experience zero-risk business growth."
        subtitle="Join 10,000+ owners who trust DukanDost Pro for their shop's nodal management."
      />
    </MainLayout>
  );
}
