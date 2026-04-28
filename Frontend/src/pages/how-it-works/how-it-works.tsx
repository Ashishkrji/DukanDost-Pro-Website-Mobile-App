import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { UserPlus, Store, Zap, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';

const StepCard = ({ number, title, description, benefits, icon: Icon }: any) => (
  <div className="flex flex-col lg:flex-row items-center gap-20 my-32">
     <div className="lg:w-[45%] space-y-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-[#FF6B00] text-white rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-xl shadow-orange-100">
              {number}
           </div>
           <SectionTag>STEP {number}</SectionTag>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-semibold leading-tight">{title}</h2>
        <p className="text-slate-500 text-lg leading-relaxed">{description}</p>
        <div className="grid grid-cols-2 gap-4 pt-4">
           {benefits.map((b: string, i: number) => (
             <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                <CheckCircle2 size={14} className="text-[#FF6B00]" /> {b}
             </div>
           ))}
        </div>
     </div>
     <div className="lg:w-[55%] w-full bg-slate-50 rounded-[4rem] p-12 aspect-[16/10] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <Icon size={400} className="text-[#FF6B00] translate-x-20 translate-y-20 rotate-12" />
        </div>
        <div className="relative z-10 w-full h-full bg-white rounded-[3rem] shadow-2xl border-4 border-white flex flex-col p-10">
           <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center"><Icon size={20} /></div>
              <div className="w-32 h-2 bg-slate-100 rounded-full" />
           </div>
           <div className="space-y-6 flex-1">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between">
                   <div className="w-48 h-2 bg-slate-50 rounded-full" />
                   <div className="w-16 h-4 bg-orange-100 rounded-full" />
                </div>
              ))}
           </div>
           <div className="mt-10 h-12 bg-orange-600 rounded-2xl w-full" />
        </div>
     </div>
  </div>
);

export default function HowItWorks() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'How It Works' }]} />
        <PageHeader 
          badge="THE WORKFLOW"
          title="From manual ledgers to nodal precision."
          subtitle="Modernizing your shop with DukanDost Pro is simple, fast, and secure. Follow these steps to get started."
        />

        <div className="relative">
           {/* Vertical Connector Line */}
           <div className="absolute left-8 top-32 bottom-32 w-px bg-slate-100 hidden lg:block" />

           <StepCard 
             number="01"
             icon={UserPlus}
             title="Create Your Account"
             description="Sign up with your phone number or email in less than 60 seconds. Our secure onboarding process ensures your business data is protected from the start."
             benefits={["OTP Verification", "Mobile/Web access", "Bank-grade encryption"]}
           />

           <StepCard 
             number="02"
             icon={Store}
             title="Setup Your Business"
             description="Add your shop details, upload your current inventory, and import your existing customer data. We support bulk imports from Excel and other popular ledger apps."
             benefits={["Bulk Data Import", "GST Configuration", "Staff Role Setup"]}
           />

           <StepCard 
             number="03"
             icon={Zap}
             title="Go Live & Scale"
             description="Start recording transactions, generating bills, and tracking credit instantly. Monitor your business performance from anywhere with our real-time nodal dashboard."
             benefits={["Real-time Sync", "Automated Reports", "One-click Reminders"]}
           />
        </div>

        {/* Integration Section */}
        <div className="my-48 text-center bg-slate-50 rounded-[5rem] p-20 border border-slate-100">
           <SectionTag>SEAMLESS INTEGRATION</SectionTag>
           <h2 className="text-3xl md:text-5xl font-display font-semibold mb-10">Connect Your Business Ecosystem</h2>
           <div className="flex flex-wrap justify-center gap-12 mt-12 grayscale opacity-40">
              {['PAYTM', 'PHONEPE', 'GOOGEPAY', 'BHARATPE', 'WHATSAPP'].map(p => (
                <span key={p} className="text-xl font-bold tracking-tighter">{p}</span>
              ))}
           </div>
           <p className="text-slate-400 mt-16 font-medium max-w-xl mx-auto">DukanDost Pro integrates with all major payment gateways and messaging platforms to keep your business moving fast.</p>
        </div>
      </div>

      <CTASection 
        title="Ready to transform your shop?"
        subtitle="Modernizing your business has never been this easy. Start your journey today."
      />
    </MainLayout>
  );
}
