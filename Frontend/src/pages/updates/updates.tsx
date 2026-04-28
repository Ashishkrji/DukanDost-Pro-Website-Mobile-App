import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Rocket, Sparkles, TrendingUp, Zap, Clock, ArrowRight } from 'lucide-react';

const UpdateCard = ({ type, title, desc, date, image }: any) => (
  <div className="flex flex-col md:flex-row gap-12 items-center py-20 border-b border-slate-100 last:border-0 group">
     <div className="w-full md:w-1/3 aspect-[4/3] bg-slate-50 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-slate-100 group-hover:-translate-y-2 transition-transform duration-700">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700" />
        <div className="absolute top-6 left-6">
           <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest shadow-sm">
              {type}
           </span>
        </div>
     </div>
     <div className="w-full md:w-2/3 space-y-6 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Clock size={12} /> {date}
        </div>
        <h2 className="text-3xl font-display font-semibold text-[#000] group-hover:text-[#FF6B00] transition-colors leading-tight">{title}</h2>
        <p className="text-slate-500 text-lg leading-relaxed font-medium">{desc}</p>
        <button className="flex items-center justify-center md:justify-start gap-3 text-[#FF6B00] font-bold text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
           LEARN MORE <ArrowRight size={18} />
        </button>
     </div>
  </div>
);

export default function Updates() {
  const updates = [
    {
      type: "LAUNCH",
      title: "DukanDost Pro v2.0 is officially here.",
      desc: "Our biggest update ever, featuring a completely redesigned nodal interface, multi-shop support, and enterprise-grade security tools for every shopkeeper.",
      date: "April 25, 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      type: "FEATURE",
      title: "Smart Inventory Predictive Alerts",
      desc: "Stop worrying about stock-outs. Our new AI-driven inventory engine predicts when you'll run low on items based on seasonal sales patterns.",
      date: "April 18, 2026",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800"
    },
    {
      type: "ANNOUNCEMENT",
      title: "Strategic Partnership with Paytm",
      desc: "We're teaming up with Paytm to provide seamless one-click payment reconciliation for all DukanDost Pro users across India.",
      date: "April 05, 2026",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Updates' }]} />
        <PageHeader 
          badge="NEWSROOM"
          title="Stay in the nodal loop."
          subtitle="All the latest announcements, feature launches, and company milestones from the DukanDost Pro team."
        />

        <div className="my-32">
           {updates.map((u, i) => <UpdateCard key={i} {...u} />)}
        </div>

        {/* Product Roadmap Snapshot */}
        <div className="my-48 p-16 md:p-32 bg-[#000] rounded-[5rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Rocket size={250} className="text-white" /></div>
           <div className="relative z-10 text-center">
              <SectionTag>FUTURE VISION</SectionTag>
              <h2 className="text-3xl md:text-6xl font-display font-semibold text-white mb-10 tracking-tighter">What's Next for DukanDost?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                 {[
                   { icon: Sparkles, title: "AI Business Coach", status: "Coming Q3 2026" },
                   { icon: TrendingUp, title: "Capital Loans", status: "In Beta" },
                   { icon: Zap, title: "Instant Logistics", status: "Planning" }
                 ].map((item, i) => (
                   <div key={i} className="space-y-4">
                      <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto text-[#FF6B00] mb-6">
                         <item.icon size={32} />
                      </div>
                      <h4 className="text-xl font-display font-semibold text-white">{item.title}</h4>
                      <p className="text-[#FF6B00] text-[10px] font-bold uppercase tracking-widest">{item.status}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <CTASection 
        title="Never miss a nodal update."
        subtitle="Subscribe to our press list and get official announcements delivered straight to your inbox."
        btnText="SUBSCRIBE NOW"
      />
    </MainLayout>
  );
}
