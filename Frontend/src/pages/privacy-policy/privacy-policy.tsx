import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { ShieldCheck, Eye, Lock, FileText, Globe, Clock, Shield, Zap } from 'lucide-react';
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
          title="Your data privacy is our nodal foundation."
          subtitle="At DukanDost Pro, we believe your business data belongs solely to you. We are committed to transparency and world-class data protection standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 my-24 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
           {[
             { label: "Last Updated", val: "April 20, 2026", icon: Clock },
             { label: "Data Owner", val: "The Business Owner", icon: ShieldCheck },
             { label: "Encryption", val: "AES-256 Bit", icon: Lock },
             { label: "Localization", val: "India-Based Servers", icon: Globe }
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
           <PolicySection title="Data Collection" icon={FileText}>
              <p>We collect information that you provide directly to us when you create an account, such as your name, business name, phone number, and email address.</p>
              <p>When you use the DukanDost Pro platform, we collect transactional data including billing records, customer credit entries, and inventory levels to provide our nodal management services.</p>
           </PolicySection>

           <PolicySection title="How We Use Your Data" icon={Zap}>
              <p>Your data is used exclusively to power the features of the DukanDost Pro platform. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                 <li>Generating GST-compliant invoices</li>
                 <li>Calculating business analytics and growth reports</li>
                 <li>Sending automated payment reminders to your customers</li>
                 <li>Providing technical support and troubleshooting</li>
              </ul>
              <p className="font-bold text-[#FF6B00]">We DO NOT sell your business or customer data to third-party advertisers or data brokers.</p>
           </PolicySection>

           <PolicySection title="Data Protection" icon={Shield}>
              <p>We implement bank-grade security measures to protect your information. This includes 256-bit SSL encryption for data in transit and AES encryption for data at rest.</p>
              <p>Access to our servers is strictly controlled and monitored 24/7. We conduct regular security audits and penetration testing to ensure the nodal integrity of our systems.</p>
           </PolicySection>

           <PolicySection title="User Rights" icon={Eye}>
              <p>You have full control over your business data. At any time, you can:</p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                 <li>Export your entire database in Excel or PDF format</li>
                 <li>Request deletion of your account and all associated records</li>
                 <li>Correct or update any business information</li>
                 <li>Grant or revoke staff access permissions</li>
              </ul>
           </PolicySection>
        </div>
      </div>

      <CTASection 
        title="Still have questions about your privacy?"
        subtitle="Our legal team is available to clarify any doubts you may have regarding our data policies."
        btnText="TALK TO LEGAL"
        btnPath="/contact"
      />
    </MainLayout>
  );
}
