import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight,
  Smartphone,
  Timer,
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone = "99999 99999" } = location.state || {};
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInput = (e: any, index: number) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      navigate("/success", { 
        state: { 
          title: "Account Verified!", 
          message: "Your phone number has been successfully verified. Welcome to DukanDost.",
          nextPath: "/dashboard" 
        } 
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-10">
        
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-[#FF6B00] rounded-md text-[9px] font-semibold uppercase tracking-widest border border-orange-200 mb-4">
              <Smartphone size={10} /> Future Integration UI
           </div>
           <h1 className="text-3xl font-display font-semibold text-[#000]">Verify Your Account</h1>
           <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[320px] mx-auto">
             We've sent a 6-digit verification code to <span className="text-[#000] font-bold">+91 {phone}</span>
           </p>
        </div>

        <div className="space-y-8">
           <div className="flex justify-between gap-3">
              {otp.map((digit, i) => (
                <input 
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xl font-semibold text-[#000] focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] transition-all"
                />
              ))}
           </div>

           {error && (
             <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-semibold">
                <AlertCircle size={14} />
                <span>Invalid code. Please try again.</span>
             </div>
           )}

           <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleVerify}
                disabled={loading || otp.some(d => !d)}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-semibold shadow-xl shadow-orange-100 hover:bg-[#E65A00] transition-all disabled:opacity-50 group"
              >
                {loading ? "VERIFYING..." : "VERIFY & CONTINUE"}
              </button>

              <div className="flex items-center gap-6">
                 {timer > 0 ? (
                   <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
                      <Timer size={14} />
                      <span>Resend in 0:{timer < 10 ? `0${timer}` : timer}</span>
                   </div>
                 ) : (
                   <button className="flex items-center gap-2 text-[#FF6B00] text-[11px] font-bold uppercase tracking-widest hover:underline">
                      <RefreshCcw size={14} />
                      <span>Resend OTP</span>
                   </button>
                 )}
              </div>
           </div>
        </div>

        <div className="pt-20 flex flex-col items-center gap-4 text-slate-200">
           <ShieldCheck size={28} />
           <p className="text-[10px] font-semibold uppercase tracking-[0.4em]">End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  );
}
