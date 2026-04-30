import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Target, Eye, Users, Shield, Zap, Heart, Sparkles, Layout, Database } from 'lucide-react';

export default function About() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'About Us' }]} />
        <PageHeader 
          badge="OUR STORY"
          title="Building the Operating System for Bharat's Businesses."
          subtitle="DukanDost Pro is not just an app; it's a digital partner designed to simplify, scale, and secure the daily operations of every small business owner in India."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-32">
          <div className="space-y-10">
             <SectionTag>WHY WE EXIST</SectionTag>
             <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#000] leading-tight">Beyond paper ledgers and fragmented apps.</h2>
             <p className="text-slate-500 text-lg leading-relaxed">
                For decades, Indian shopkeepers have balanced their dreams on paper ledgers and multiple disconnected apps. One for Khata, one for Billing, another for Inventory. This fragmentation leads to errors, missed payments, and wasted time.
             </p>
             <p className="text-slate-500 text-lg leading-relaxed">
                <strong>DukanDost Pro</strong> was built to solve this. We combined the ease of digital khata with the precision of GST billing and the intelligence of AI analytics into a single, seamless "Nodal" ecosystem.
             </p>
          </div>
          <div className="bg-slate-50 rounded-[4rem] p-12 flex items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={200} className="text-[#FF6B00]" /></div>
             <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-[#FF6B00] rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-orange-100">
                   <Zap size={48} />
                </div>
                <h3 className="text-3xl font-display font-black mb-2">100%</h3>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Integrated Nodal Tech</p>
             </div>
          </div>
        </div>

        {/* The Nodal Advantage Section */}
        <div className="mb-32">
           <div className="text-center max-w-3xl mx-auto mb-20">
              <SectionTag>THE NODAL ADVANTAGE</SectionTag>
              <h2 className="text-4xl font-display font-bold mt-6">One Platform. Total Control.</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Layout, 
                  title: "All-in-One Dashboard", 
                  desc: "Manage Khata, Inventory, and Billing from a single window. No more switching between apps." 
                },
                { 
                  icon: Sparkles, 
                  title: "AI-Powered Insights", 
                  desc: "Our AI assistant analyzes your sales patterns to predict stock needs and identifies high-risk credits automatically." 
                },
                { 
                  icon: Database, 
                  title: "Nodal Persistence", 
                  desc: "Your data is synced in real-time across devices with bank-grade security and offline support." 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all group">
                   <div className="w-14 h-14 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                      <item.icon size={28} />
                   </div>
                   <h4 className="text-xl font-display font-semibold mb-4">{item.title}</h4>
                   <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
           {[
             { icon: Eye, title: "Our Vision", desc: "To empower 10 million small businesses with tools that make 'Dhanda' easy and efficient." },
             { icon: Heart, title: "Our Values", desc: "We value transparency, nodal integrity, and the success of the local shopkeeper above all." },
             { icon: Users, title: "Our Community", desc: "Join a growing network of business owners who are redefining traditional trade." }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[3rem] border border-slate-100 hover:border-orange-200 transition-all group">
                <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                   <item.icon size={32} />
                </div>
                <h4 className="text-2xl font-display font-semibold mb-6">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <CTASection 
        title="Ready to modernize your Dukan?"
        subtitle="Experience the power of Nodal Management. Start your digital journey with DukanDost Pro today."
      />
    </MainLayout>
  );
}
