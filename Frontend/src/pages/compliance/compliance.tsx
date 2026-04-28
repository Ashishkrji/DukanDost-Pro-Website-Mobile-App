import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Shield, CheckCircle, FileText, Globe, Scale, Lock, Landmark, Cpu } from 'lucide-react';

export default function Compliance() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Compliance' }]} />
        <PageHeader 
          badge="REGULATORY HUB"
          title="Nodal Compliance & Standards."
          subtitle="DukanDost Pro is built on a foundation of regulatory excellence, ensuring your business stays compliant with Indian laws and international standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-32">
           {[
             { icon: Landmark, title: "GST Regulatory Framework", desc: "Our platform is strictly aligned with the latest GST Council directives, ensuring all your invoices and reports are compliance-ready for FY 2026-27." },
             { icon: Shield, title: "Data Localization (RBI)", desc: "We adhere to RBI directives on data localization. All financial and transactional data is stored and processed exclusively within Indian territory." },
             { icon: Scale, title: "Consumer Protection Act", desc: "DukanDost Pro's billing systems are designed to comply with the latest Consumer Protection (E-Commerce) Rules and transparent pricing laws." },
             { icon: Lock, title: "Information Technology Act", desc: "Our nodal security infrastructure complies with Section 43A of the IT Act, ensuring reasonable security practices for sensitive personal data." }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[4rem] bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                   <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-semibold text-[#000] mb-6">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Certifications Snapshot */}
        <div className="my-48 p-16 md:p-32 bg-[#000] rounded-[5rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Cpu size={250} className="text-white" /></div>
           <div className="relative z-10 text-center">
              <SectionTag>CERTIFICATIONS</SectionTag>
              <h2 className="text-3xl md:text-6xl font-display font-semibold text-white mb-16 tracking-tighter">Verified Trust & Security</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                 {['ISO 27001', 'SOC 2 TYPE II', 'GDPR', 'PCI-DSS'].map((cert, i) => (
                   <div key={i} className="space-y-6">
                      <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto group hover:bg-white/10 transition-colors">
                         <CheckCircle size={40} className="text-[#FF6B00]" />
                      </div>
                      <p className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">{cert}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="max-w-4xl mx-auto mb-32">
           <div className="text-center mb-20">
              <SectionTag>RESOURCES</SectionTag>
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#000]">Compliance Documents</h2>
           </div>
           <div className="space-y-6">
              {[
                { title: "GST Compliance Guide 2026", size: "2.4 MB", type: "PDF" },
                { title: "Data Security Whitepaper", size: "1.8 MB", type: "PDF" },
                { title: "Privacy Impact Assessment", size: "3.1 MB", type: "DOCX" }
              ].map((doc, i) => (
                <div key={i} className="p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-orange-200 transition-colors group cursor-pointer">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-orange-50 text-[#FF6B00] rounded-xl flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-all"><FileText size={24} /></div>
                      <div>
                         <h4 className="font-semibold text-[#000]">{doc.title}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.size} • {doc.type}</p>
                      </div>
                   </div>
                   <button className="text-[#FF6B00] font-bold text-xs uppercase tracking-widest hover:underline">DOWNLOAD</button>
                </div>
              ))}
           </div>
        </div>
      </div>

      <CTASection 
        title="Compliant today, scaling tomorrow."
        subtitle="Let us handle the regulatory complexities while you focus on building your business empire."
      />
    </MainLayout>
  );
}
