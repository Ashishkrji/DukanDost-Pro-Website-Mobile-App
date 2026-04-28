import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Lightbulb, TrendingUp, DollarSign, Users, Target, Rocket, ArrowRight, Star } from 'lucide-react';

const TipCard = ({ icon: Icon, title, desc, category }: any) => (
  <div className="p-12 rounded-[4rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-2xl transition-all group">
     <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
        <Icon size={32} />
     </div>
     <div className="space-y-4">
        <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-[0.2em]">{category}</span>
        <h3 className="text-2xl font-display font-semibold text-[#000] leading-tight">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        <button className="pt-6 flex items-center gap-3 text-[#FF6B00] font-bold text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
           LEARN STRATEGY <ArrowRight size={14} />
        </button>
     </div>
  </div>
);

export default function BusinessTips() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Business Tips' }]} />
        <PageHeader 
          badge="GROWTH STRATEGIES"
          title="Nodal Tips for Shop Owners."
          subtitle="Actionable advice, industry insights, and proven strategies to help you grow your profit and scale your business across India."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-32">
           <TipCard 
             icon={TrendingUp} 
             title="Optimize Your Product Mix" 
             category="Inventory" 
             desc="Learn how to identify high-margin items and optimize your shelf space for maximum sales velocity." 
           />
           <TipCard 
             icon={Users} 
             title="Build Customer Loyalty" 
             category="Retention" 
             desc="Proven techniques to turn first-time visitors into lifelong customers using digital reminders and rewards." 
           />
           <TipCard 
             icon={DollarSign} 
             title="Reduce Hidden Expenses" 
             category="Finance" 
             desc="Identify and eliminate unnecessary costs in your supply chain and daily operations to boost your net profit." 
           />
           <TipCard 
             icon={Target} 
             title="Hyper-Local Marketing" 
             category="Marketing" 
             desc="How to use digital tools to attract customers from your local neighborhood without spending on expensive ads." 
           />
           <TipCard 
             icon={Star} 
             title="Upgrade Customer Experience" 
             category="Service" 
             desc="Simple changes to your shop's workflow that make the buying process faster and more pleasant for customers." 
           />
           <TipCard 
             icon={Rocket} 
             title="Scaling to Multiple Locations" 
             category="Growth" 
             desc="The nodal approach to expanding your business from one shop to a regional retail chain successfully." 
           />
        </div>

        <div className="my-48 bg-[#000] rounded-[5rem] p-16 md:p-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Lightbulb size={250} className="text-white" /></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <SectionTag>PRO TIP</SectionTag>
                 <h2 className="text-3xl md:text-6xl font-display font-semibold text-white mb-8 tracking-tighter">The 80/20 Rule for Retail</h2>
                 <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">Did you know that 80% of your profits usually come from just 20% of your customers? Our nodal analytics help you identify these VIP customers instantly.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 text-center backdrop-blur-3xl">
                 <div className="text-6xl font-display font-semibold text-[#FF6B00] mb-6">20%</div>
                 <p className="text-white font-semibold text-sm uppercase tracking-[0.2em]">Identify & Grow</p>
                 <div className="mt-12 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/5 h-full bg-[#FF6B00]" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <CTASection 
        title="Get the growth newsletter."
        subtitle="Join 15,000+ business owners receiving weekly strategies to scale their shops with precision."
        btnText="SIGN UP FOR TIPS"
      />
    </MainLayout>
  );
}
