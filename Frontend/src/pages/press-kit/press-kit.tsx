import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Breadcrumb, PageHeader, CTASection } from '../../components/layout/PageComponents';
import { Download, Shield, Layout, Image as ImageIcon, FileText, Zap } from 'lucide-react';

const AssetCard = ({ icon: Icon, title, desc, actionText = "Download" }: any) => (
  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:border-orange-200 transition-all group">
    <div className="w-12 h-12 bg-white text-[#FF6B00] rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
       <Icon size={24} />
    </div>
    <h4 className="text-lg font-semibold text-[#1A1A2E] mb-2">{title}</h4>
    <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">{desc}</p>
    <button className="flex items-center gap-2 text-[#FF6B00] text-xs font-bold uppercase tracking-widest hover:translate-y-[-2px] transition-transform">
       {actionText} <Download size={14} />
    </button>
  </div>
);

export default function PressKit() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Breadcrumb items={[{ name: 'PRESS KIT' }]} />
        <PageHeader 
          badge="MEDIA RESOURCES"
          title="Everything You Need to Tell Our Story"
          subtitle="Download official brand assets, logos, and media resources for DukanDost Pro."
        />

        {/* Brand Assets */}
        <div className="mb-32">
           <h2 className="text-2xl font-display font-semibold text-[#1A1A2E] mb-12">Brand Assets</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssetCard 
                icon={Shield} 
                title="Official Logos" 
                desc="Includes primary logo, icon only, and wordmark in SVG, PNG, and EPS formats."
              />
              <AssetCard 
                icon={Layout} 
                title="Product Screenshots" 
                desc="High-resolution screenshots of the dashboard, billing, and mobile app interface."
              />
              <AssetCard 
                icon={ImageIcon} 
                title="Founder Headshots" 
                desc="Official high-resolution photos of our leadership team for media use."
              />
           </div>
        </div>

        {/* Press Releases */}
        <div className="mb-32">
           <h2 className="text-2xl font-display font-semibold text-[#1A1A2E] mb-12">Recent Press Releases</h2>
           <div className="space-y-6">
              {[
                { date: "MAY 01, 2026", title: "DukanDost Pro Crosses 10,000 Active Business Milestone" },
                { date: "APR 15, 2026", title: "Announcing AI-Powered Sales Forecasting for Small Retailers" },
                { date: "MAR 10, 2026", title: "DukanDost Pro Named Startup of the Year in Retail Tech" }
              ].map((item, i) => (
                <div key={i} className="p-10 bg-white border border-slate-100 rounded-[3rem] hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                   <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{item.date}</span>
                      <h4 className="text-xl font-semibold text-[#1A1A2E] group-hover:text-[#FF6B00] transition-colors">{item.title}</h4>
                   </div>
                   <button className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-[#FF6B00] transition-colors">
                      View Release <FileText size={16} />
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Brand Guidelines */}
        <div className="bg-[#1A1A2E] rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center">
           <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 to-transparent opacity-50" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-display font-semibold text-white mb-6">Brand Guidelines</h2>
              <p className="text-slate-400 text-lg font-medium mb-12">Please review our brand guidelines before using our assets to ensure consistent representation of DukanDost Pro.</p>
              <button className="bg-white text-[#1A1A2E] px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mx-auto">
                 DOWNLOAD GUIDELINES <Download size={18} />
              </button>
           </div>
        </div>
      </div>
      <CTASection 
        title="Media Inquiries?"
        subtitle="For press inquiries, interview requests, or further information, please reach out to our media relations team."
        btnText="CONTACT MEDIA TEAM"
        btnPath="/contact"
      />
    </MainLayout>
  );
}
