import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, SectionTag } from '../../components/layout/PageComponents';
import { Mail, Phone, MapPin, Clock, MessageSquare, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'Contact' }]} />
        <PageHeader 
          badge="GET IN TOUCH"
          title="We're here to help you grow."
          subtitle="Have questions about DukanDost Pro? Our dedicated support team is ready to assist you 24/7."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 my-32">
          {/* Contact Form */}
          <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-100/50">
             <h3 className="text-2xl font-display font-semibold mb-10">Send us a message</h3>
             <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors font-medium" placeholder="John" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors font-medium" placeholder="Doe" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                   <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors font-medium" placeholder="john@business.com" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                   <textarea rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors font-medium resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button className="w-full bg-[#FF6B00] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E65A00] transition-all shadow-xl shadow-orange-100">
                   SEND MESSAGE
                </button>
             </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
             <div className="space-y-12">
                {[
                  { icon: Mail, title: "Email Support", desc: "support@dukandostpro.com", detail: "Response within 2 hours" },
                  { icon: Phone, title: "Phone Support", desc: "+91 800-DUKAN-PRO", detail: "Mon-Sat, 9am - 8pm" },
                  { icon: MapPin, title: "Headquarters", desc: "Sector 5, HSR Layout", detail: "Bangalore, India 560102" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                     <div className="w-16 h-16 bg-orange-50 text-[#FF6B00] rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-500">
                        <item.icon size={28} />
                     </div>
                     <div>
                        <h4 className="text-xl font-display font-semibold mb-2">{item.title}</h4>
                        <p className="text-[#000] font-semibold text-lg mb-1">{item.desc}</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.detail}</p>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Support Active</span>
                </div>
                <h4 className="text-lg font-semibold mb-4">Want to chat right now?</h4>
                <p className="text-slate-500 text-sm font-medium mb-8">Our agents are online and ready to help you with your setup.</p>
                <button className="flex items-center gap-3 text-[#FF6B00] font-bold text-xs uppercase tracking-widest group">
                   START LIVE CHAT <MessageSquare size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {/* Placeholder for Map */}
        <div className="w-full h-[500px] bg-slate-100 rounded-[4rem] relative overflow-hidden group">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                 <Globe size={48} className="text-slate-300 mx-auto" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Interactive Map Loading...</p>
              </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </MainLayout>
  );
}
