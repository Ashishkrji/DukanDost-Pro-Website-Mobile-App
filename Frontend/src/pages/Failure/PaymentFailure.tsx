import React from "react";
import { Link, useLocation } from "react-router-dom";
import { XCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function PaymentFailure() {
  const location = useLocation();
  const { message = "Payment was not successful. Please check your card details and try again." } = location.state || {};

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-[fadeIn_0.5s_ease]">
        
        <div className="flex justify-center">
          <div className="relative">
             <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-40 animate-pulse" />
             <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 relative z-10 border border-red-100">
                <XCircle size={48} />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-display font-semibold text-[#000]">Payment Failed</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">{message}</p>
        </div>

        <div className="pt-6 space-y-4">
           <Link to="/subscription">
             <button className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-semibold shadow-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group">
               <span>RETRY PAYMENT</span>
               <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             </button>
           </Link>
           <Link to="/dashboard" className="block text-slate-400 hover:text-slate-600 font-bold text-sm uppercase tracking-widest">
             Return to Dashboard
           </Link>
        </div>

        <div className="pt-20 flex flex-col items-center gap-4 text-slate-100">
           <AlertCircle size={28} />
           <p className="text-[10px] font-semibold uppercase tracking-[0.4em]">Secure Transaction Support Available</p>
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
