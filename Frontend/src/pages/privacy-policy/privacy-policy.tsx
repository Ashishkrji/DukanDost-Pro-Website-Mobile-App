import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { ShieldCheck, Eye, Lock, FileText, Globe, Clock, Shield, Zap, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const PolicySection = ({ title, icon: Icon, children }: any) => (
  <div className="py-16 border-b border-slate-100 last:border-0 group">
    <div className="flex gap-8">
       <div className="w-12 h-12 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-500">
          <Icon size={24} />
       </div>
       <div className="space-y-6">
          <h3 className="text-2xl font-display font-semibold text-[#000]">{title}</h3>
          <div className="text-slate-500 text-lg leading-relaxed space-y-4">
             {children}
          </div>
       </div>
    </div>
  </div>
);

export default function PrivacyPolicy() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Privacy Policy' }]} />
        <PageHeader 
          badge="LEGAL & PRIVACY"
          title="Data Integrity is the core of DukanDost Pro."
          subtitle="We protect your business data with bank-grade encryption and a strict zero-sharing policy. Your 'Khata' and 'Kamaai' data is for your eyes only."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 my-24 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
           {[
             { label: "Last Updated", val: "April 30, 2026", icon: Clock },
             { label: "Data Sovereignty", val: "Owned by You", icon: ShieldCheck },
             { label: "AI Safety", val: "Private Processing", icon: Sparkles },
             { label: "Encryption", val: "AES-256 Bit", icon: Lock }
           ].map((stat, i) => (
             <div key={i} className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-[#FF6B00]">
                   <stat.icon size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
                </div>
                <p className="text-sm font-bold text-[#000]">{stat.val}</p>
             </div>
           ))}
        </div>

        <div className="max-w-4xl mx-auto">
           <PolicySection title="Information Collection" icon={FileText}>
              <p>We collect essential information to manage your business nodal account. This includes your name, business details, GSTIN, and contact information.</p>
              <p>Transactional data (billing, ledgers, inventory) is collected and stored on our secure cloud servers to enable features like multi-device sync and automated reporting.</p>
           </PolicySection>

           <PolicySection title="AI & Data Processing" icon={Sparkles}>
              <p>DukanDost Pro uses AI models (via OpenRouter/Llama/Gemini) to provide business insights and health scores.</p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                 <li>Your data is processed ephemerally for the purpose of generating insights.</li>
                 <li>We DO NOT use your private ledger data to train public AI models.</li>
                 <li>All AI requests are anonymized to ensure individual customer identities are protected.</li>
              </ul>
           </PolicySection>

           <PolicySection title="How We Use Your Data" icon={Zap}>
              <p>Your data is used strictly for the operational needs of your business:</p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                 <li>Generating GST-compliant invoices and shareable PDFs.</li>
                 <li>Managing customer credit limits and 'Udhaar' reminders.</li>
                 <li>Calculating profitability and inventory demand forecasts.</li>
                 <li>Authenticating access across your web and mobile devices.</li>
              </ul>
              <p className="font-bold text-[#FF6B00]">DukanDost Pro will NEVER sell your customer database or sales data to third-party marketing agencies.</p>
           </PolicySection>

           <PolicySection title="Security Standards" icon={Shield}>
              <p>We implement the "Nodal Security Protocol" which includes:</p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                 <li>256-bit SSL encryption for all data in transit.</li>
                 <li>Multi-factor authentication (MFA) options for owner accounts.</li>
                 <li>Real-time database mirroring to prevent data loss.</li>
                 <li>Regular third-party vulnerability assessments.</li>
              </ul>
           </PolicySection>

           <PolicySection title="Compliance" icon={Globe}>
              <p>Our data practices are compliant with the Digital Personal Data Protection Act (DPDP) 2023 of India. We store your data on servers located within India to ensure full regulatory compliance and local data sovereignty.</p>
           </PolicySection>
        </div>
      </div>

      <CTASection 
        title="Your business, your rules."
        subtitle="DukanDost Pro is built on trust. Contact us if you need more details about our security protocols."
        btnText="DOWNLOAD SECURITY DOC"
        btnPath="/contact"
      />
    </MainLayout>
  );
}
