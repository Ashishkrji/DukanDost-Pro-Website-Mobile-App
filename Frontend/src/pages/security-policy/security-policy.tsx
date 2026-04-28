import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Breadcrumb, PageHeader } from '../../components/layout/PageComponents';
import { Shield, Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

const PolicySection = ({ title, content }: any) => (
  <div className="mb-16">
    <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 flex items-center gap-3">
       <div className="w-1.5 h-6 bg-[#FF6B00] rounded-full" /> {title}
    </h3>
    <div className="text-slate-500 text-sm font-medium leading-relaxed space-y-6">
       {content.map((p: string, i: number) => (
         <p key={i}>{p}</p>
       ))}
    </div>
  </div>
);

export default function SecurityPolicy() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Breadcrumb items={[{ name: 'SECURITY POLICY' }]} />
        <PageHeader 
          badge="GOVERNANCE"
          title="Security & Vulnerability Policy"
          subtitle="How we manage security threats, protect user data, and handle vulnerability disclosures."
        />

        <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[3rem] p-12 md:p-20 shadow-sm">
           <div className="flex items-center gap-6 mb-16 pb-12 border-b border-slate-50">
              <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center">
                 <Lock size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">POLICY VERSION</p>
                 <p className="text-sm font-semibold text-[#1A1A2E]">v2.1 (May 2026)</p>
              </div>
           </div>

           <PolicySection 
             title="1. Infrastructure Security"
             content={[
               "DukanDost Pro is hosted on enterprise-grade cloud providers with physical security, environmental controls, and 24/7 monitoring.",
               "We use multi-factor authentication (MFA) for all internal access to production systems and databases.",
               "Regular penetration testing is conducted by third-party security firms to identify potential weaknesses in our infrastructure."
             ]}
           />

           <PolicySection 
             title="2. Application Security"
             content={[
               "We follow secure coding practices and conduct code reviews for every production deployment.",
               "All user passwords are hashed using industry-standard salted bcrypt algorithms. We never store passwords in plain text.",
               "Automated vulnerability scanning is integrated into our CI/CD pipeline to catch security issues early."
             ]}
           />

           <PolicySection 
             title="3. Vulnerability Disclosure"
             content={[
               "We welcome reports from security researchers. If you believe you've found a security vulnerability in DukanDost Pro, please notify us immediately.",
               "Please send your report to security@dukandost.pro with detailed steps to reproduce the issue.",
               "We commit to acknowledging your report within 24 hours and providing regular updates during the remediation process."
             ]}
           />

           <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100 mt-20 flex items-start gap-6">
              <Shield size={24} className="text-[#FF6B00] shrink-0" />
              <div>
                 <h4 className="font-semibold text-[#1A1A2E] mb-2">Data Protection Officer</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">For legal or compliance inquiries related to security, please contact our DPO at compliance@dukandost.pro.</p>
              </div>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
