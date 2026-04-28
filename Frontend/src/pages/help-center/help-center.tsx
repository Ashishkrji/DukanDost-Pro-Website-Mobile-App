import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Search, BookOpen, MessageCircle, PlayCircle, LifeBuoy, FileText, Settings, CreditCard, ChevronRight, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const CategoryCard = ({ icon: Icon, title, articles, desc }: any) => (
  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-slate-100 transition-all group cursor-pointer">
     <div className="w-14 h-14 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
        <Icon size={28} />
     </div>
     <h3 className="text-xl font-display font-semibold text-[#000] mb-3">{title}</h3>
     <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{desc}</p>
     <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{articles} Articles</span>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all" />
     </div>
  </div>
);

export default function HelpCenter() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Help Center' }]} />
        
        {/* Search Hero */}
        <div className="text-center max-w-4xl mx-auto mb-32">
           <SectionTag>SUPPORT CENTER</SectionTag>
           <h1 className="text-4xl md:text-7xl font-display font-semibold text-[#000] mb-12 tracking-tighter">How can we help you today?</h1>
           <div className="relative max-w-2xl mx-auto group">
              <input 
                type="text" 
                placeholder="Search for articles, guides, or tutorials..." 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-6 focus:outline-none focus:border-[#FF6B00] focus:bg-white transition-all font-medium text-lg shadow-xl shadow-slate-100/50" 
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors" size={24} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                 <button className="bg-[#FF6B00] text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#E65A00] transition-all">SEARCH</button>
              </div>
           </div>
           <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Popular:</span>
              {['GST Setup', 'Import Data', 'Add Staff', 'Billing Help'].map(tag => (
                <button key={tag} className="text-[10px] font-bold text-slate-500 hover:text-[#FF6B00] uppercase tracking-widest border-b border-slate-200 hover:border-[#FF6B00] transition-all pb-0.5">{tag}</button>
              ))}
           </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
           <CategoryCard 
             icon={LifeBuoy} 
             title="Getting Started" 
             articles="12" 
             desc="Learn the basics of setting up your shop and creating your first bill." 
           />
           <CategoryCard 
             icon={FileText} 
             title="Billing & Invoicing" 
             articles="24" 
             desc="Everything about GST rules, invoice templates, and payment links." 
           />
           <CategoryCard 
             icon={Settings} 
             title="Account Settings" 
             articles="08" 
             desc="Manage your profile, staff roles, shop details, and security settings." 
           />
           <CategoryCard 
             icon={CreditCard} 
             title="Plans & Billing" 
             articles="15" 
             desc="Information about subscriptions, renewals, and our refund policy." 
           />
           <CategoryCard 
             icon={PlayCircle} 
             title="Video Tutorials" 
             articles="20" 
             desc="Step-by-step video guides to help you master DukanDost Pro." 
           />
           <CategoryCard 
             icon={MessageCircle} 
             title="Community" 
             articles="100+" 
             desc="Join discussions with other shop owners and share growth tips." 
           />
        </div>

        {/* Featured Guides */}
        <div className="mb-32">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-display font-semibold text-[#000]">Featured Guides</h2>
              <button className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest hover:underline flex items-center gap-2">VIEW ALL GUIDES <ArrowRight size={14} /></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "The Ultimate GST Compliance Checklist 2026", time: "15 min read", icon: BookOpen },
                { title: "Mastering Inventory Management for Retail", time: "10 min read", icon: FileText }
              ].map((guide, i) => (
                <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center gap-8 group cursor-pointer hover:bg-white hover:border-orange-200 transition-all">
                   <div className="w-14 h-14 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><guide.icon size={28} /></div>
                   <div>
                      <h4 className="text-xl font-display font-semibold mb-2 group-hover:text-[#FF6B00] transition-colors">{guide.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{guide.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <CTASection 
        title="Can't find what you're looking for?"
        subtitle="Our support team is available 24/7 via live chat and email to help you with any issue."
        btnText="CONTACT SUPPORT"
        btnPath="/contact"
      />
    </MainLayout>
  );
}
