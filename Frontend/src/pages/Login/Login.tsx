import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ChevronRight,
  Smartphone,
  Check,
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

// --- Components ---

const Input = ({ 
  label, 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error,
  ...props 
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center px-1">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{label}</label>
        {isPassword && (
          <Link to="/forgot-password" size={18} className="text-[10px] font-semibold text-[#FF6B00] uppercase tracking-widest hover:underline transition-colors">
            Forgot Password?
          </Link>
        )}
      </div>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF6B00] transition-colors">
          <Icon size={18} />
        </div>
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF6B00] transition-all",
            error && "border-red-500 bg-red-50 focus:ring-red-100 focus:border-red-500"
          )}
          {...props}
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-[10px] font-semibold text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default function Login() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "phone") return; // Coming soon

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use Auth Store
      useAuthStore.getState().setAuth(data.data.user, data.token);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === "Failed to fetch") {
        setError("Unable to connect to the server. Please ensure the backend is running on port 5000.");
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] flex overflow-hidden font-sans">
      
      {/* Left Section: Form */}
      <div className="w-full lg:w-[45%] p-8 md:p-16 flex flex-col justify-center relative bg-white z-10">
        <div className="absolute top-8 left-8">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#000] font-semibold text-xs uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} /> Back to website
           </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <ShieldCheck size={20} />
              </div>
              <span className="font-display font-semibold text-2xl tracking-tighter text-[#000]">DukanDost <span className="text-[#FF6B00]">Pro</span></span>
            </div>
            <h1 className="text-3xl font-display font-semibold text-[#000] mb-3">Welcome Back</h1>
            <p className="text-slate-500 font-medium text-sm">Login to manage your business, customers, orders, and growth from one powerful dashboard.</p>
          </div>

          {/* Auth Toggles */}
          <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
            <button 
              onClick={() => setAuthMethod("email")}
              className={cn(
                "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all",
                authMethod === "email" ? "bg-white text-[#FF6B00] shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Email Login
            </button>
            <button 
              onClick={() => setAuthMethod("phone")}
              className={cn(
                "flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2",
                authMethod === "phone" ? "bg-white text-[#FF6B00] shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Mobile OTP <span className="text-[8px] bg-orange-100 px-1.5 py-0.5 rounded text-[#FF6B00]">SOON</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-[shake_0.5s_ease-in-out]">
               <AlertCircle size={18} className="mt-0.5" />
               <p className="text-xs font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {authMethod === "email" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input label="Email Address" name="email" type="email" icon={Mail} placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
              <Input label="Password" name="password" type="password" icon={Lock} placeholder="••••••••" value={formData.password} onChange={handleChange} required />

              <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center pt-0.5">
                       <input 
                         id="remember"
                         type="checkbox" 
                         name="remember" 
                         checked={formData.remember} 
                         onChange={handleChange} 
                         className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-50 transition-all checked:border-[#FF6B00] checked:bg-[#FF6B00]" 
                       />
                       <Check className="absolute left-1 top-1 h-3 w-3 text-white pointer-events-none opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <label htmlFor="remember" className="text-xs font-semibold text-slate-500 leading-tight cursor-pointer">
                       Remember me
                    </label>
                  </div>
              </div>

               <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#FF6B00] text-white py-4 rounded-2xl font-semibold shadow-xl shadow-orange-100 hover:bg-[#E65A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>SECURE LOGIN</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              {/* Social Login UI Ready */}
              <div className="relative pt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-widest">
                  <span className="bg-white px-4 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                 <button type="button" disabled className="w-full flex items-center justify-center gap-3 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl cursor-not-allowed group opacity-70">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                    <span className="text-xs font-bold text-slate-400">Continue with Google</span>
                    <span className="text-[8px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-bold ml-1">COMING SOON</span>
                 </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center space-y-6">
               <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto text-[#FF6B00]">
                  <Smartphone size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Mobile OTP Login Coming Soon</h3>
                  <p className="text-sm text-slate-500 max-w-[280px] mx-auto">We're currently perfecting our secure SMS authentication. Please use Email Login for now.</p>
               </div>
               <button 
                 onClick={() => setAuthMethod("email")}
                 className="text-xs font-semibold text-[#FF6B00] uppercase tracking-widest hover:underline"
               >
                 Go back to Email Login
               </button>
            </div>
          )}
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account? <Link to="/signup" className="text-[#FF6B00] font-semibold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>

       {/* Right Section: Visual */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#1A1A2E] p-24 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />
        
        <div className="relative z-10 w-full max-w-2xl">
           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
                    <ShieldAlert size={28} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-display font-semibold text-white">Secure Access Point</h2>
                    <p className="text-slate-400 font-medium">Protecting your data with 256-bit encryption.</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-3xl font-display font-semibold text-white mb-1">99.9%</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">System Uptime</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-3xl font-display font-semibold text-white mb-1">10k+</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Users</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-slate-400 text-sm font-medium italic">"DukanDost has completely transformed how we handle our global transactions. The security is top-notch."</p>
                 <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full" alt="Avatar" />
                    <div>
                       <p className="text-xs font-bold text-white">Alex Rivera</p>
                       <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Founder, TechStack</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}} />
    </div>
  );
}
