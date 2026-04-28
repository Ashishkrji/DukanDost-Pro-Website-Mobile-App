import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { title = "Success!", message = "Operation completed successfully.", nextPath = "/dashboard" } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto redirect after 5 seconds
      // navigate(nextPath);
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, nextPath]);

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-[fadeIn_0.5s_ease]">
        
        <div className="flex justify-center">
          <div className="relative">
             <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-40 animate-pulse" />
             <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 relative z-10 border border-green-100">
                <CheckCircle2 size={48} />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-semibold text-[#000]">{title}</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">{message}</p>
        </div>

        <div className="pt-6">
           <Link to={nextPath}>
             <button className="w-full bg-[#1A1A2E] text-white py-4 rounded-2xl font-semibold shadow-2xl hover:bg-[#000] transition-all flex items-center justify-center gap-3 group">
               <span>CONTINUE TO DASHBOARD</span>
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </Link>
           <p className="mt-6 text-xs text-slate-400 font-semibold tracking-widest uppercase">Redirecting you automatically in 5 seconds...</p>
        </div>

        <div className="pt-20 flex flex-col items-center gap-4 text-slate-200">
           <ShieldCheck size={28} />
           <p className="text-[10px] font-semibold uppercase tracking-[0.4em]">Verified Transaction Secure</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
