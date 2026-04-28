import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowRight, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="flex items-center gap-3 mb-12">
    <Link to="/" className="text-slate-400 hover:text-[#FF6B00] transition-colors">
      <Home size={16} />
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ChevronRight size={14} className="text-slate-300" />
        {item.path ? (
          <Link to={item.path} className="text-[10px] font-bold text-slate-400 hover:text-[#FF6B00] uppercase tracking-widest transition-colors">
            {item.name}
          </Link>
        ) : (
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">
            {item.name}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export const PageHeader = ({ badge, title, subtitle, centered = false }: any) => (
  <div className={cn("mb-20", centered ? "text-center max-w-3xl mx-auto" : "max-w-4xl")}>
    {badge && (
      <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-orange-50 text-[#FF6B00] border border-orange-100 mb-8">
        {badge}
      </span>
    )}
    <h1 className="text-4xl md:text-7xl font-display font-semibold text-[#000] mb-8 leading-[1.1] tracking-tighter">
      {title}
    </h1>
    {subtitle && (
      <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

export const CTASection = ({ title, subtitle, btnText = "GET STARTED NOW", btnPath = "/signup" }: any) => (
  <section className="py-32">
    <div className="max-w-5xl mx-auto px-6">
      <div className="bg-[#000] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Shield size={200} className="text-white" />
         </div>
         <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-8 leading-tight">
               {title}
            </h2>
            <p className="text-white/70 text-lg font-medium mb-12 max-w-2xl mx-auto">
               {subtitle}
            </p>
            <Link to={btnPath}>
               <button className="bg-[#FF6B00] text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#E65A00] hover:-translate-y-1 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 mx-auto">
                  {btnText} <ArrowRight size={18} />
               </button>
            </Link>
         </div>
      </div>
    </div>
  </section>
);

export const FeatureCard = ({ icon: Icon, title, description, color = "orange" }: any) => (
  <div className="p-12 rounded-[4rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
    <div className={cn(
      "w-16 h-16 rounded-[2rem] flex items-center justify-center mb-10 shadow-sm transition-all",
      color === "orange" ? "bg-orange-50 text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white" : "bg-slate-100 text-slate-600 group-hover:bg-[#000] group-hover:text-white"
    )}>
      <Icon size={32} />
    </div>
    <h4 className="text-2xl font-display font-semibold text-[#000] mb-6">{title}</h4>
    <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
  </div>
);

export const SectionTag = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn(
    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-orange-50 text-[#FF6B00] border border-orange-100 mb-8 inline-block",
    className
  )}>
    {children}
  </span>
);
