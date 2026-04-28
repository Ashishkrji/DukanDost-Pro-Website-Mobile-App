import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { BookOpen, PlayCircle, FileText, ArrowRight, CheckCircle, Search, Lightbulb, Zap } from 'lucide-react';

const GuideCard = ({ title, time, type, icon: Icon }: any) => (
  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-slate-100 transition-all group cursor-pointer">
     <div className="w-14 h-14 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
        <Icon size={28} />
     </div>
     <div className="space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <span>{type}</span>
           <span className="w-1 h-1 bg-slate-200 rounded-full" />
           <span>{time}</span>
        </div>
        <h3 className="text-xl font-display font-semibold text-[#000] group-hover:text-[#FF6B00] transition-colors leading-tight">
           {title}
        </h3>
        <div className="pt-6 flex items-center gap-3 text-[#FF6B00] font-bold text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
           READ GUIDE <ArrowRight size={14} />
        </div>
     </div>
  </div>
);

export default function Guides() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Guides' }]} />
        <PageHeader 
          badge="LEARNING CENTER"
          title="Master DukanDost with ease."
          subtitle="From your first invoice to advanced inventory automation, our comprehensive guides help you unlock the full power of nodal precision."
        />

        {/* Featured Guide */}
        <div className="my-20 p-12 md:p-20 bg-slate-50 rounded-[4rem] border border-slate-100 relative overflow-hidden group cursor-pointer hover:bg-white hover:shadow-2xl transition-all">
           <div className="absolute top-0 right-0 p-12 opacity-5"><BookOpen size={200} className="text-[#FF6B00]" /></div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-2/3 space-y-8">
                 <SectionTag>FEATURED GUIDE</SectionTag>
                 <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#000] leading-tight">The Complete Guide to Modernizing Your Small Business in 2026.</h2>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed">Discover how digital transformation can help you save time, reduce errors, and increase your profit margins by 20%.</p>
                 <button className="bg-[#FF6B00] text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E65A00] transition-all shadow-xl shadow-orange-100">
                    START READING
                 </button>
              </div>
              <div className="lg:w-1/3 flex items-center justify-center">
                 <div className="w-48 h-64 bg-white rounded-3xl shadow-2xl border-4 border-slate-100 flex flex-col p-6 space-y-4">
                    <div className="w-full h-1/2 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B00]"><BookOpen size={48} /></div>
                    <div className="space-y-2">
                       <div className="w-full h-2 bg-slate-100 rounded-full" />
                       <div className="w-3/4 h-2 bg-slate-100 rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
           <GuideCard 
             title="How to set up your first shop profile" 
             time="5 min" 
             type="Getting Started" 
             icon={Lightbulb} 
           />
           <GuideCard 
             title="Advanced GST Billing & Filing" 
             time="15 min" 
             type="Tutorial" 
             icon={FileText} 
           />
           <GuideCard 
             title="Automating low stock alerts" 
             time="8 min" 
             type="Inventory" 
             icon={Zap} 
           />
           <GuideCard 
             title="Managing customer credit like a pro" 
             time="10 min" 
             type="Customer CRM" 
             icon={CheckCircle} 
           />
           <GuideCard 
             title="Video: Creating custom invoices" 
             time="4 min" 
             type="Video Tutorial" 
             icon={PlayCircle} 
           />
           <GuideCard 
             title="Importing data from other apps" 
             time="7 min" 
             type="Data" 
             icon={ArrowRight} 
           />
        </div>
      </div>

      <CTASection 
        title="Still need assistance?"
        subtitle="Our support specialists are here to walk you through any feature of the platform."
        btnText="TALK TO AN EXPERT"
        btnPath="/contact"
      />
    </MainLayout>
  );
}
