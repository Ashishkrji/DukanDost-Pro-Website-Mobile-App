import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const Input = ({ 
  label, 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error,
  ...props 
}: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] transition-all",
          error && "border-red-500 bg-red-50 focus:ring-red-100 focus:border-red-500"
        )}
        {...props}
      />
    </div>
    {error && <p className="text-[10px] font-semibold text-red-500 ml-1">{error}</p>}
  </div>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#000] font-semibold text-xs uppercase tracking-widest transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center text-[#FF6B00] shadow-inner">
               <Lock size={32} />
            </div>
          </div>
          
          <h1 className="text-3xl font-display font-semibold text-[#000] mb-3">Reset Your Password</h1>
          <p className="text-slate-500 font-medium text-sm">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
        </div>

        {success ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl text-center space-y-6">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-semibold">Check Your Email</h3>
                <p className="text-sm text-slate-500">We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. It should arrive in a few minutes.</p>
             </div>
             <div className="pt-4">
                <Link to="/login">
                  <button className="w-full bg-[#1A1A2E] text-white py-4 rounded-2xl font-semibold hover:bg-[#000] transition-colors">
                    RETURN TO LOGIN
                  </button>
                </Link>
             </div>
             <p className="text-xs text-slate-400 font-medium pt-4">Didn't receive the email? <button onClick={() => setSuccess(false)} className="text-[#FF6B00] font-bold hover:underline">Try again</button></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                 <AlertCircle size={18} className="mt-0.5" />
                 <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </div>
            )}

            <Input 
              label="Email Address" 
              type="email" 
              icon={Mail} 
              placeholder="john@example.com" 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              required 
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-semibold shadow-xl shadow-orange-100 hover:bg-[#E65A00] transition-all disabled:opacity-50 group"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>SENDING LINK...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>SEND RESET LINK</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className="text-center pt-4">
               <p className="text-xs text-slate-500 font-medium">
                 Wait, I remember my password! <Link to="/login" className="text-[#FF6B00] font-bold hover:underline">Take me back</Link>
               </p>
            </div>
          </form>
        )}

        <div className="mt-20 flex flex-col items-center gap-4 text-slate-300">
           <ShieldCheck size={24} />
           <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">Secure Verification System</p>
        </div>
      </div>
    </div>
  );
}
