import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Target, Eye, Users, Shield, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'About Us' }]} />
        <PageHeader 
          badge="OUR STORY"
          title="Empowering the backbone of Indian Economy."
          subtitle="We are on a mission to modernize 10 million small businesses in India with world-class digital tools designed for precision and growth."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-32">
          <div className="space-y-10">
             <SectionTag>WHY WE EXIST</SectionTag>
             <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#000] leading-tight">Solving real problems for the local shopkeeper.</h2>
             <p className="text-slate-500 text-lg leading-relaxed">
                For decades, small business owners in India have managed their shops using paper ledgers and manual calculations. While the world moved to the cloud, the local shopkeeper was left behind with complex, expensive, or incomplete software.
             </p>
             <p className="text-slate-500 text-lg leading-relaxed">
                DukanDost Pro was born out of a simple vision: to create a nodal management system that is as easy as writing in a notebook but as powerful as an enterprise ERP.
             </p>
          </div>
          <div className="bg-slate-50 rounded-[4rem] p-12 flex items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={200} className="text-[#FF6B00]" /></div>
             <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-[#FF6B00] rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-orange-100">
                   <Target size={48} />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-4">10M+ Businesses</h3>
                <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Our 2030 Target</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
           {[
             { icon: Eye, title: "Our Vision", desc: "To be the most trusted digital partner for every small business in India." },
             { icon: Heart, title: "Our Values", desc: "Precision, Transparency, and User-First design in everything we build." },
             { icon: Users, title: "Our Community", desc: "A thriving ecosystem of 10,000+ owners sharing growth strategies." }
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
        title="Be a part of our journey."
        subtitle="Join thousands of business owners who are scaling their shops with Nodal Precision."
      />
    </MainLayout>
  );
}
