import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Shield, Lock, Server, Cloud, UserCheck, EyeOff, CheckCircle, Database } from 'lucide-react';

export default function Security() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Security' }]} />
        <PageHeader 
          badge="TRUST & SAFETY"
          title="Your data security is our nodal priority."
          subtitle="We employ bank-grade encryption and multi-layer protection systems to ensure your business data remains private, secure, and always accessible."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-32">
           {[
             { icon: Lock, title: "256-bit Encryption", desc: "All data transmitted and stored is protected by industry-standard AES-256 encryption." },
             { icon: Server, title: "Secure Cloud", desc: "We host on top-tier cloud infrastructure with 99.99% uptime and redundant storage." },
             { icon: Database, title: "Daily Backups", desc: "Your database is backed up every 24 hours to multiple geographic locations." },
             { icon: UserCheck, title: "Role-Based Access", desc: "Control exactly what your staff can see or edit with granular permission settings." },
             { icon: EyeOff, title: "Privacy First", desc: "We never sell your data. Your business information is only accessible by you." },
             { icon: Cloud, title: "Disaster Recovery", desc: "Built-in systems to restore your business operations instantly in case of failure." }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                   <item.icon size={32} />
                </div>
                <h4 className="text-2xl font-display font-semibold mb-6">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="bg-[#000] rounded-[4rem] p-16 md:p-32 my-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Shield size={300} className="text-white" /></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <SectionTag>COMPLIANCE</SectionTag>
                 <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-8">Bank-Grade Protection for Every Business.</h2>
                 <p className="text-slate-400 text-lg mb-12">DukanDost Pro follows international security standards and Indian data localization laws to keep your financial records safe from any unauthorized access.</p>
                 <div className="space-y-6">
                    {["ISO 27001 Certified Infrastructure", "GDPR & Data Protection Compliant", "End-to-End SSL Encryption", "Two-Factor Authentication (2FA)"].map(f => (
                      <div key={f} className="flex items-center gap-4 text-white font-semibold">
                         <CheckCircle size={20} className="text-[#FF6B00]" /> {f}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-8">
                 <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center hover:bg-white/10 transition-colors">
                       <Shield size={40} className="text-[#FF6B00] mb-4" />
                       <p className="text-white font-semibold text-sm">Real-time Monitoring</p>
                    </div>
                    <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center hover:bg-white/10 transition-colors">
                       <Database size={40} className="text-[#FF6B00] mb-4" />
                       <p className="text-white font-semibold text-sm">Encrypted Storage</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mb-32">
           <div className="text-center mb-20">
              <SectionTag>FAQS</SectionTag>
              <h2 className="text-3xl md:text-5xl font-display font-semibold">Security Questions</h2>
           </div>
           <div className="max-w-4xl mx-auto space-y-8">
              {[
                { q: "Where is my data stored?", a: "Your data is stored in Tier-IV data centers in India, ensuring high speed and compliance with local data laws." },
                { q: "Who can access my data?", a: "Only you and the users you explicitly authorize. Even DukanDost staff cannot view your financial records without your direct permission." },
                { q: "Can I download my data?", a: "Yes, you can export your entire business data in Excel or PDF format at any time with a single click." }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-3xl bg-slate-50 border border-slate-100">
                   <h4 className="text-lg font-semibold mb-4">{item.q}</h4>
                   <p className="text-slate-500 font-medium">{item.a}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <CTASection 
        title="Your business is safe with us."
        subtitle="Focus on your growth while we handle the security. Start your free trial today."
      />
    </MainLayout>
  );
}
