import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Breadcrumb, PageHeader, CTASection } from '../../components/layout/PageComponents';
import { Briefcase, Heart, Coffee, Globe, ArrowRight, Zap } from 'lucide-react';

const JobCard = ({ title, dept, location }: any) => (
  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:border-[#FF6B00]/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
    <div className="text-center md:text-left">
      <h4 className="text-lg font-semibold text-[#1A1A2E] mb-1">{title}</h4>
      <div className="flex items-center justify-center md:justify-start gap-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dept}</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{location}</span>
      </div>
    </div>
    <button className="bg-slate-50 text-[#1A1A2E] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all">
      Apply Now
    </button>
  </div>
);

export default function Careers() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Breadcrumb items={[{ name: 'CAREERS' }]} />
        <PageHeader 
          badge="WE'RE HIRING"
          title="Build the Future of Retail with DukanDost Pro"
          subtitle="Join a team of innovators, dreamers, and builders dedicated to transforming how millions of small businesses operate."
        />

        {/* Culture Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Heart, title: "People First", desc: "We care about your growth, health, and happiness as much as our business." },
            { icon: Globe, title: "Remote Friendly", desc: "Work from anywhere or join our hubs. We value output over seat-time." },
            { icon: Zap, title: "Fast Paced", desc: "Move fast, ship often, and solve real-world problems at scale." }
          ].map((item, i) => (
            <div key={i} className="text-center p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
               <div className="w-14 h-14 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <item.icon size={28} />
               </div>
               <h4 className="text-lg font-semibold text-[#1A1A2E] mb-4">{item.title}</h4>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mb-32">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-display font-semibold text-[#1A1A2E]">Open Positions</h2>
              <div className="hidden md:flex gap-4">
                 {['Engineering', 'Product', 'Design', 'Sales'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-[#FF6B00] hover:text-[#FF6B00] cursor-pointer transition-all">{tag}</span>
                 ))}
              </div>
           </div>
           
           <div className="space-y-6">
              <JobCard title="Senior Fullstack Engineer" dept="Engineering" location="Remote / Noida" />
              <JobCard title="Product Designer (UI/UX)" dept="Design" location="Remote / Bangalore" />
              <JobCard title="Growth Marketing Manager" dept="Marketing" location="Mumbai" />
              <JobCard title="Customer Success Specialist" dept="Support" location="Noida" />
           </div>
        </div>

        {/* Perks Section */}
        <div className="bg-[#1A1A2E] rounded-[4rem] p-12 md:p-24 mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Coffee size={200} />
           </div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-8 leading-tight">Perks & Benefits</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   "Competitive Salary & Equity",
                   "Comprehensive Health Insurance",
                   "Remote Work Stipend",
                   "Flexible Vacation Policy",
                   "Learning & Development Fund",
                   "Daily Lunch & Snack Bar"
                 ].map(item => (
                   <li key={item} className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                      <Zap size={16} className="text-[#FF6B00]" /> {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
      <CTASection 
        title="Don't See a Perfect Fit?"
        subtitle="We're always looking for talented people to join our mission. Send us your resume and we'll keep you in mind."
        btnText="SEND RESUME"
      />
    </MainLayout>
  );
}
