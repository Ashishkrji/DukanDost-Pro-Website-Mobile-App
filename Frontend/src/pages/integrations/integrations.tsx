import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Share2, Zap, Shield, Database, LayoutGrid, ArrowRight } from 'lucide-react';

const IntegrationCard = ({ icon: Icon, title, description, status }: any) => (
  <div className="p-10 rounded-[3rem] border border-slate-100 hover:border-orange-200 transition-all group bg-white">
    <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
      <Icon size={32} />
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-display font-semibold">{title}</h4>
        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {status}
        </span>
      </div>
      <p className="text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
      <div className="pt-4 flex items-center gap-2 text-[#FF6B00] font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:gap-4 transition-all">
        VIEW DOCS <ArrowRight size={14} />
      </div>
    </div>
  </div>
);

export default function Integrations() {
  const integrations = [
    { icon: Share2, title: "WhatsApp Business", description: "Send automated payment reminders, invoices, and order updates directly to your customers.", status: "Active" },
    { icon: Zap, title: "UPI Payments", description: "Collect payments instantly with dynamic QR codes and real-time reconciliation.", status: "Active" },
    { icon: Database, title: "Tally Prime", description: "Sync your business data with Tally for seamless accounting and GST filing.", status: "Soon" },
    { icon: Shield, title: "Banking Connect", description: "Connect your current account to monitor cash flow and automate payouts.", status: "Soon" },
    { icon: LayoutGrid, title: "Shopify Store", description: "Sync your online orders and inventory with your physical store khata.", status: "Soon" },
    { icon: Share2, title: "Excel Import", description: "Import your existing customer and stock data from Excel or CSV files.", status: "Active" }
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Integrations' }]} />
        <PageHeader 
          badge="ECOSYSTEM"
          title="Connect the tools you already use."
          subtitle="DukanDost Pro integrates seamlessly with India's most popular business tools to streamline your workflow."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-32">
          {integrations.map((item, i) => (
            <IntegrationCard key={i} {...item} />
          ))}
        </div>

        <div className="bg-[#0A0A0A] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden mb-32">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Zap size={300} className="text-white" />
           </div>
           <div className="relative z-10 space-y-8">
              <SectionTag>API ACCESS</SectionTag>
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-white leading-tight max-w-3xl mx-auto">Build your own custom workflows.</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                 Our robust API allows you to connect any external system to DukanDost Pro. Build custom dashboards, reports, or automation triggers.
              </p>
              <div className="pt-8">
                 <button className="bg-white text-[#000] px-10 py-5 rounded-2xl font-bold hover:bg-orange-500 hover:text-white transition-all">
                    EXPLORE API DOCS
                 </button>
              </div>
           </div>
        </div>
      </div>

      <CTASection 
        title="Need a specific integration?"
        subtitle="We are constantly adding new partners. Let us know which tool you'd like to see next."
      />
    </MainLayout>
  );
}
