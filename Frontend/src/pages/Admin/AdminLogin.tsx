import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Mail, Eye, EyeOff, 
  ChevronRight, AlertCircle, ShieldCheck, 
  ArrowLeft, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAdminAuth } = useAdminAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/login`, {
        email,
        password
      });

      if (response.data.success) {
        setAdminAuth(response.data.data.admin, response.data.token);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unauthorized access. You do not have admin permission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header & Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-[#0A0B1A] text-[#FF6B00] shadow-2xl mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black text-[#0A0B1A] tracking-tighter uppercase">Admin Portal</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-slate-400">
            <ShieldCheck size={14} className="text-green-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Admin Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dukandostpro.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B00] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B00] transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded-md border-slate-200 text-[#FF6B00] focus:ring-[#FF6B00]" />
                  <label htmlFor="remember" className="text-xs font-bold text-slate-500">Remember session</label>
                </div>
                <button type="button" className="text-xs font-bold text-[#FF6B00] hover:underline uppercase tracking-widest">Forgot Access?</button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A0B1A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Secure Admin Login
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              This panel is protected and monitored. 256-bit SSL encrypted. 
              Unauthorized login attempts are logged and tracked by IP.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0A0B1A] transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Gateway
          </button>
        </div>
      </div>
    </div>
  );
}
