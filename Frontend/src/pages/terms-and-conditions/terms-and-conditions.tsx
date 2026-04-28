import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection } from '../../components/layout/PageComponents';
import { Gavel, Scale, FileCheck, HelpCircle } from 'lucide-react';

const TermsSection = ({ title, id, children }: any) => (
  <div id={id} className="py-12 border-b border-slate-50 last:border-0 scroll-mt-32">
     <h3 className="text-xl font-display font-semibold text-[#000] mb-6 flex items-center gap-3">
        <span className="text-[#FF6B00] text-sm">#</span> {title}
     </h3>
     <div className="text-slate-500 text-base leading-relaxed space-y-4 font-medium">
        {children}
     </div>
  </div>
);

export default function TermsAndConditions() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Terms & Conditions' }]} />
        <PageHeader 
          badge="LEGAL AGREEMENT"
          title="Terms of Service & Usage"
          subtitle="Please read these terms carefully before using DukanDost Pro. By accessing our nodal platform, you agree to be bound by these conditions."
        />

        <div className="flex flex-col lg:flex-row gap-20 my-20">
           {/* Sidebar Navigation */}
           <div className="lg:w-1/4 hidden lg:block sticky top-32 h-fit">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Navigation</h5>
              <div className="space-y-4">
                 {[
                   { name: "Acceptance of Terms", id: "acceptance" },
                   { name: "User Eligibility", id: "eligibility" },
                   { name: "Subscription & Payments", id: "payments" },
                   { name: "Acceptable Use", id: "usage" },
                   { name: "Data Accuracy", id: "accuracy" },
                   { name: "Termination", id: "termination" }
                 ].map(item => (
                   <a 
                     key={item.id} 
                     href={`#${item.id}`} 
                     className="block text-xs font-bold text-slate-500 hover:text-[#FF6B00] uppercase tracking-widest transition-colors"
                   >
                     {item.name}
                   </a>
                 ))}
              </div>
              <div className="mt-12 p-8 bg-orange-50 rounded-3xl border border-orange-100">
                 <HelpCircle className="text-[#FF6B00] mb-4" size={24} />
                 <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">Need Help?</p>
                 <p className="text-[10px] text-orange-800 leading-relaxed font-medium">If you have questions about our terms, please contact our legal desk.</p>
              </div>
           </div>

           {/* Content */}
           <div className="lg:w-3/4 max-w-3xl">
              <TermsSection title="Acceptance of Terms" id="acceptance">
                 <p>By accessing or using DukanDost Pro (the "Platform"), provided by DukanDost Tech Pvt Ltd ("Company", "we", "us"), you agree to comply with and be bound by these Terms and Conditions.</p>
                 <p>If you do not agree with any part of these terms, you must not use the Platform.</p>
              </TermsSection>

              <TermsSection title="User Eligibility" id="eligibility">
                 <p>You must be at least 18 years of age and possess the legal authority to enter into a binding agreement to use DukanDost Pro.</p>
                 <p>The Platform is intended for use by business entities and individual entrepreneurs operating within the jurisdiction of India.</p>
              </TermsSection>

              <TermsSection title="Subscription & Payments" id="payments">
                 <p>DukanDost Pro offers various subscription tiers. Fees are billed in advance on a monthly or annual basis and are non-refundable unless otherwise stated in our Refund Policy.</p>
                 <p>We reserve the right to change our pricing structure with at least 30 days' notice to active subscribers.</p>
              </TermsSection>

              <TermsSection title="Acceptable Use" id="usage">
                 <p>You agree to use the Platform only for lawful business purposes. You shall not:</p>
                 <ul className="list-disc pl-6 space-y-2">
                    <li>Use the Platform for any fraudulent or illegal activities.</li>
                    <li>Attempt to reverse engineer or breach the nodal security of the Platform.</li>
                    <li>Upload malicious software or viruses.</li>
                    <li>Interfere with the service of other users.</li>
                 </ul>
              </TermsSection>

              <TermsSection title="Data Accuracy" id="accuracy">
                 <p>You are solely responsible for the accuracy and legality of the data you enter into the Platform. DukanDost Pro provides management tools but is not responsible for errors caused by incorrect data entry.</p>
                 <p>It is your responsibility to ensure compliance with GST and other tax laws in your jurisdiction.</p>
              </TermsSection>

              <TermsSection title="Termination" id="termination">
                 <p>We may terminate or suspend your access to the Platform immediately, without prior notice or liability, for any reason, including if you breach the Terms.</p>
                 <p>Upon termination, your right to use the Platform will cease immediately. You will have 30 days to export your business data before it is permanently deleted.</p>
              </TermsSection>
           </div>
        </div>
      </div>

      <CTASection 
        title="Agreement is the first step to trust."
        subtitle="Read our Terms. Understand our platform. Grow your business with confidence."
      />
    </MainLayout>
  );
}
