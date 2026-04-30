import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection } from '../../components/layout/PageComponents';
import { RefreshCcw, ShieldCheck, Clock, HelpCircle, FileText, CheckCircle, CreditCard } from 'lucide-react';

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
          title="Transparent Billing. Fair Refunds."
          subtitle="We want you to focus on your business, not your bills. If DukanDost Pro doesn't meet your expectations, our refund process is simple and automated."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-32">
           <PolicyBox 
             icon={Clock} 
             title="14-Day Pro Trial" 
             desc="Explore all 'Pro' and 'Business' features for 14 days. No charges, no commitments, just growth." 
           />
           <PolicyBox 
             icon={ShieldCheck} 
             title="7-Day Refund Window" 
             desc="After your first paid subscription, you have 7 full days to request a 100% refund for any reason." 
           />
           <PolicyBox 
             icon={CreditCard} 
             title="Auto-Prorated Credits" 
             desc="If you upgrade your plan mid-month, we automatically prorate your unused credits towards the new plan." 
           />
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-slate-100/50 mb-32">
           <h2 className="text-3xl font-display font-semibold text-[#000] mb-12">Subscription & Refund Terms</h2>
           <div className="space-y-12">
              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">1. CANCELLATION POLICY</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">You can cancel your subscription at any time via the billing portal. Once cancelled, you will retain access to your plan until the end of the current billing cycle. No further charges will be made to your card.</p>
              </section>

              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">2. REFUND ELIGIBILITY</h4>
                 <ul className="space-y-4">
                    {[
                      "Monthly or Annual subscriptions cancelled within 7 days of initial purchase.",
                      "Duplicate charges due to technical payment gateway issues.",
                      "Plan upgrades where the previous billing was not correctly offset.",
                      "Accounts where critical features (Invoicing/Ledger) were inaccessible for over 72 hours."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-500 font-medium">
                         <CheckCircle size={20} className="text-[#FF6B00] shrink-0 mt-0.5" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </section>

              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">3. ENTERPRISE & CUSTOM PLANS</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">For custom multi-shop setups (Enterprise tier), refund terms are governed by the specific Service Level Agreement (SLA) signed during onboarding. Setup fees for custom domain mapping or hardware integration are non-refundable.</p>
              </section>

              <section className="space-y-6">
                 <h4 className="text-lg font-bold uppercase tracking-widest text-[#FF6B00]">4. HOW TO REQUEST</h4>
                 <p className="text-slate-500 leading-relaxed font-medium">To initiate a refund, please email <strong>billing@dukandost.pro</strong> with your registered business phone number and transaction ID. Refunds are typically processed within 48 hours and appear in your bank account in 5-7 business days.</p>
              </section>
           </div>
        </div>

        <div className="p-12 md:p-20 bg-orange-50 rounded-[4rem] border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-12 mb-32">
           <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-display font-semibold text-orange-900 mb-4">Billing Issue? We're Here to Help.</h3>
              <p className="text-orange-800/80 font-medium">If you've been charged incorrectly or have questions about your invoice, don't worry. Our billing team treats every case with priority.</p>
           </div>
           <button className="bg-[#FF6B00] text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E65A00] transition-all shadow-xl shadow-orange-200">
              CONTACT BILLING
           </button>
        </div>
      </div>

      <CTASection 
        title="Focus on sales, leave the billing to us."
        subtitle="Join 10,000+ businesses growing securely with DukanDost Pro."
      />
    </MainLayout>
  );
}
