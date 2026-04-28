import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Zap, Rocket, Bug, Star, Package, ChevronRight, Clock } from 'lucide-react';

const ChangelogEntry = ({ version, date, type, title, items }: any) => (
  <div className="relative pl-12 md:pl-20 py-12 border-l-2 border-slate-50 last:border-0 group">
     {/* Timeline Marker */}
     <div className="absolute top-12 left-[-11px] w-5 h-5 rounded-full bg-white border-4 border-slate-100 group-hover:border-[#FF6B00] transition-colors" />
     
     <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
           <span className="text-sm font-bold text-[#FF6B00] font-mono tracking-tighter">v{version}</span>
           <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} /> {date}</span>
           <span className={cn(
             "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
             type === 'Major' ? "bg-orange-600 text-white" : "bg-orange-50 text-[#FF6B00]"
           )}>{type} Release</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-[#000]">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
           {items.map((section: any, i: number) => (
             <div key={i} className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                   {section.icon && <section.icon size={12} className="text-[#FF6B00]" />}
                   {section.label}
                </div>
                <ul className="space-y-3">
                   {section.items.map((item: string, j: number) => (
                     <li key={j} className="flex items-start gap-3 text-sm font-medium text-slate-600 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
                        {item}
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
     </div>
  </div>
);

export default function Changelog() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Changelog' }]} />
        <PageHeader 
          badge="PRODUCT ROADMAP"
          title="Nodal Improvements & Updates."
          subtitle="We ship updates every week. Follow the evolution of DukanDost Pro as we build the future of Indian retail."
        />

        <div className="max-w-4xl mx-auto my-32">
           <ChangelogEntry 
             version="2.4.0"
             date="April 25, 2026"
             type="Major"
             title="The Growth Dashboard & Multi-Shop Sync"
             items={[
               { label: "New Features", icon: Star, items: ["Global Dashboard for multi-location owners", "Real-time P&L visualizer", "Dark Mode UI preview"] },
               { label: "Improvements", icon: Zap, items: ["50% faster GST report generation", "Optimized image uploads for inventory", "Enhanced mobile touch targets"] }
             ]}
           />

           <ChangelogEntry 
             version="2.3.5"
             date="April 10, 2026"
             type="Patch"
             title="Automated WhatsApp Reminders"
             items={[
               { label: "New Features", icon: Star, items: ["WhatsApp Business API integration", "Custom reminder templates"] },
               { label: "Fixes", icon: Bug, items: ["Fixed printing issues on 3-inch thermal printers", "Resolved session timeout bugs on iOS"] }
             ]}
           />

           <ChangelogEntry 
             version="2.3.0"
             date="March 28, 2026"
             type="Minor"
             title="Nodal Inventory Engine"
             items={[
               { label: "New Features", icon: Package, items: ["Low stock prediction algorithm", "Batch & Expiry date management"] },
               { label: "Updates", icon: Zap, items: ["Updated GST rates for FY 2026-27", "New export formats for Tally integration"] }
             ]}
           />
        </div>

        <div className="text-center py-20 border-t border-slate-100">
           <button className="bg-slate-50 text-slate-400 px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-not-allowed">
              LOAD OLDER VERSIONS
           </button>
        </div>
      </div>

      <CTASection 
        title="Want to see what's coming next?"
        subtitle="Follow us on social media or subscribe to our developer roadmap to stay updated."
        btnText="VIEW ROADMAP"
        btnPath="/updates"
      />
    </MainLayout>
  );
}
