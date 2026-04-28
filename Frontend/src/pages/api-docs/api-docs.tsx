import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { PageHeader, Breadcrumb, CTASection, SectionTag } from '../../components/layout/PageComponents';
import { Code2, Terminal, Cpu, Zap, Globe, Key, Book, ArrowRight } from 'lucide-react';

const CodeBlock = ({ code }: { code: string }) => (
  <div className="bg-[#1a1a1a] rounded-3xl p-8 font-mono text-sm text-slate-300 relative overflow-hidden group border border-white/5">
     <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
     </div>
     <pre className="overflow-x-auto">
        <code>{code}</code>
     </pre>
  </div>
);

export default function ApiDocs() {
  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Breadcrumb items={[{ name: 'API Docs' }]} />
        <PageHeader 
          badge="DEVELOPER HUB"
          title="Build on the nodal ecosystem."
          subtitle="Integrate DukanDost Pro into your custom workflows with our powerful REST API. Reliable, fast, and secure."
        />

        <div className="flex flex-col lg:flex-row gap-20 my-32">
           {/* Sidebar */}
           <div className="lg:w-1/4 space-y-12">
              <div>
                 <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">GETTING STARTED</h5>
                 <ul className="space-y-4">
                    {['Introduction', 'Authentication', 'Rate Limits', 'Errors'].map(item => (
                      <li key={item} className="text-sm font-semibold text-slate-600 hover:text-[#FF6B00] cursor-pointer transition-colors">{item}</li>
                    ))}
                 </ul>
              </div>
              <div>
                 <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">CORE RESOURCES</h5>
                 <ul className="space-y-4">
                    {['Customers', 'Invoices', 'Inventory', 'Payments', 'Staff'].map(item => (
                      <li key={item} className="text-sm font-semibold text-slate-600 hover:text-[#FF6B00] cursor-pointer transition-colors">{item}</li>
                    ))}
                 </ul>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                 <Terminal size={24} className="text-[#FF6B00] mb-4" />
                 <p className="text-xs font-bold text-[#000] uppercase tracking-widest mb-2">SDKs Available</p>
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">Official libraries for Node.js, Python, and Go.</p>
                 <button className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest hover:underline flex items-center gap-2">VIEW ON GITHUB <ArrowRight size={12} /></button>
              </div>
           </div>

           {/* Content */}
           <div className="lg:w-3/4 space-y-24">
              <section id="introduction" className="space-y-8">
                 <SectionTag>INTRODUCTION</SectionTag>
                 <h2 className="text-3xl font-display font-semibold">The DukanDost API</h2>
                 <p className="text-slate-500 text-lg leading-relaxed">Our API is organized around REST. It has predictable resource-oriented URLs, accepts JSON-encoded request bodies, and returns JSON-encoded responses.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {[
                      { icon: Globe, title: "Base URL", val: "api.dukandost.pro/v1" },
                      { icon: Key, title: "Auth Method", val: "Bearer Token" }
                    ].map((item, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-6">
                         <div className="w-12 h-12 bg-white text-[#FF6B00] rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><item.icon size={24} /></div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                            <p className="text-sm font-mono font-bold text-[#000]">{item.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section id="authentication" className="space-y-8">
                 <SectionTag>AUTHENTICATION</SectionTag>
                 <h2 className="text-3xl font-display font-semibold">Authenticating your requests</h2>
                 <p className="text-slate-500 text-lg leading-relaxed">To authenticate your requests, you must include your API key in the `Authorization` header of all HTTP requests.</p>
                 <CodeBlock code={`curl https://api.dukandost.pro/v1/customers \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
              </section>

              <section id="endpoints" className="space-y-8">
                 <SectionTag>ENDPOINTS</SectionTag>
                 <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-display font-semibold">List All Customers</h2>
                    <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">GET</span>
                 </div>
                 <p className="text-slate-500 text-lg leading-relaxed">Returns a paginated list of all customers associated with your business account.</p>
                 <CodeBlock code={`{
  "object": "list",
  "data": [
    {
      "id": "cust_9yH2kP5m",
      "name": "Rahul Sharma",
      "business_name": "Sharma Electronics",
      "created_at": 1713958200
    }
  ],
  "has_more": false
}`} />
              </section>
           </div>
        </div>
      </div>

      <CTASection 
        title="Ready to build something amazing?"
        subtitle="Get your API keys from the developer dashboard and start building your custom integration today."
        btnText="GET API KEYS"
        btnPath="/login"
      />
    </MainLayout>
  );
}
