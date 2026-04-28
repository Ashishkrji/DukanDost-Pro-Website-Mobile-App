import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { 
  Receipt, 
  Package, 
  Users, 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap, 
  Clock, 
  SmartphoneNfc,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const FeatureBlock = ({ icon: Icon, title, description, benefits, reverse = false }: any) => (
  <div className={`flex flex-col lg:flex-row items-center gap-20 my-32 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <div className="lg:w-1/2 space-y-8">
       <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center">
          <Icon size={32} />
       </div>
       <h2 className="text-3xl md:text-5xl font-display font-semibold leading-tight">{title}</h2>
       <p className="text-slate-500 text-lg leading-relaxed">{description}</p>
       <ul className="space-y-4 pt-6">
          {benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-center gap-3 text-[#000] font-semibold text-sm">
               <CheckCircle2 size={18} className="text-[#FF6B00]" /> {benefit}
            </li>
          ))}
       </ul>
    </div>
    <div className="lg:w-1/2 w-full bg-slate-50 rounded-[4rem] p-12 aspect-square flex items-center justify-center relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-700">
          <Icon size={300} className="text-[#FF6B00]" />
       </div>
       <div className="relative z-10 w-full h-full border-4 border-white rounded-[3rem] bg-white shadow-2xl flex flex-col items-center justify-center p-12 text-center">
          <Icon size={80} className="text-[#FF6B00] mb-8" />
          <h3 className="text-xl font-display font-semibold mb-4">{title} View</h3>
          <div className="w-full space-y-3">
             <div className="w-full h-2 bg-slate-100 rounded-full" />
             <div className="w-3/4 h-2 bg-slate-100 rounded-full mx-auto" />
             <div className="w-1/2 h-4 bg-orange-50 rounded-full mx-auto mt-8" />
          </div>
       </div>
    </div>
  </div>
);

export default function Features() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Features' }]} />
        <PageHeader 
          badge="PRODUCT DEEP-DIVE"
          title="Everything you need to run your shop like a Pro."
          subtitle="Discover the powerful tools that make DukanDost Pro the nodal center of your business growth."
        />

        <FeatureBlock 
          icon={Receipt}
          title="Professional GST Billing"
          description="Generate compliance-ready invoices in seconds. Whether it's a simple retail bill or a complex GST invoice, DukanDost handles it with precision."
          benefits={["Automated GST calculation", "Customizable invoice templates", "Share via WhatsApp/SMS", "Offline billing support"]}
        />

        <FeatureBlock 
          reverse
          icon={Package}
          title="Smart Inventory Control"
          description="Never run out of stock again. Our smart tracking system monitors your inventory in real-time and alerts you when it's time to restock."
          benefits={["Low stock alerts", "Multi-godown management", "Batch & Expiry tracking", "Automated purchase orders"]}
        />

        <FeatureBlock 
          icon={Users}
          title="Advanced Customer CRM"
          description="Build stronger relationships with your customers. Track their credit history, sending automated reminders, and understand their buying patterns."
          benefits={["Digital Credit Ledger (Udhaar)", "Automated payment reminders", "Customer loyalty tracking", "Bulk SMS marketing"]}
        />

        <FeatureBlock 
          reverse
          icon={BarChart3}
          title="Visual Business Reports"
          description="Make data-driven decisions. Get instant access to P&L statements, sales reports, and expense analytics that help you identify growth areas."
          benefits={["Daily sales dashboard", "Profit & Loss statements", "Expense categories", "GST filing reports"]}
        />

        <div className="my-48 bg-[#000] rounded-[5rem] p-16 md:p-32 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Cpu size={200} className="text-white" /></div>
           <SectionTag>NODAL ARCHITECTURE</SectionTag>
           <h2 className="text-3xl md:text-6xl font-display font-semibold text-white mb-10 tracking-tighter">Built for High-Precision Performance</h2>
           <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16">Our proprietary nodal system ensures that your data is synced instantly across all devices with zero latency and 100% accuracy.</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Zap, title: "0.1s Latency", desc: "Fastest sync in the industry" },
                { icon: Shield, title: "AES-256", desc: "Bank-grade data encryption" },
                { icon: SmartphoneNfc, title: "Offline First", desc: "Work without internet" }
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-[#FF6B00]">
                      <item.icon size={24} />
                   </div>
                   <h4 className="text-white font-semibold">{item.title}</h4>
                   <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <CTASection 
        title="Experience the power of DukanDost Pro."
        subtitle="Start your 14-day free trial today. No credit card required."
      />
    </MainLayout>
  );
}
