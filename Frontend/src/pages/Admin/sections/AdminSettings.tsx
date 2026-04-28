import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { 
  Settings, Shield, Lock, Globe, Mail, 
  Save, RefreshCcw, Send, CheckCircle2,
  AlertCircle, Upload, Clock, Key
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { adminToken } = useAdminAuthStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (adminToken) {
      fetchSettings();
    }
  }, [adminToken]);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/settings`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setSettings(data.settings);
    } catch (err) {
      showToast('Failed to load settings', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (section: string, data: any) => {
    setLoading(true);
    try {
      const { data: res } = await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/settings`,
        { [section]: data },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (res.success) {
        setSettings(res.settings);
        showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated`, 'success');
      }
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const testSMTP = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/settings/test-email`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) showToast(data.message, 'success');
    } catch (err) {
      showToast('SMTP Test failed', 'error');
    }
  };

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Platform Data...</p>
      </div>
    );
  }

  // Double safety: ensure segments exist
  const general = settings?.general || {};
  const email = settings?.email || {};
  const security = settings?.security || {};

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {toast && (
        <div className={cn(
          "fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300",
          toast.type === 'success' ? "bg-[#0A0B1A] text-white" : "bg-red-600 text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Control Panel</h2>
          <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Global platform parameters & security protocols</p>
        </div>
        <Badge status="success" className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 border-none font-bold">System Online</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-sm text-slate-900 font-bold text-sm border-2 border-orange-500 transition-all text-left">
            <Globe size={18} className="text-[#FF6B00]" /> General Configuration
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-white/50 rounded-2xl text-slate-400 font-bold text-sm hover:bg-white hover:text-slate-600 transition-all text-left">
            <Mail size={18} /> Email (SMTP) Service
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-white/50 rounded-2xl text-slate-400 font-bold text-sm hover:bg-white hover:text-slate-600 transition-all text-left">
            <Shield size={18} /> Security & Session
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1: GENERAL SETTINGS */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">General Settings</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Platform identity & localization</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={fetchSettings} icon={<RefreshCcw size={14} />}>Reset</Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 group hover:border-orange-200 transition-colors cursor-pointer">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                  <Upload size={24} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Platform Logo</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Recommended: 512x512px SVG or PNG</p>
                  <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-3 hover:underline">Replace Artwork</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Site Name" value={general?.siteName} onChange={(v) => setSettings({...settings, general: {...general, siteName: v}})} />
                <InputGroup label="Company Name" value={general?.companyName} onChange={(v) => setSettings({...settings, general: {...general, companyName: v}})} />
                <InputGroup label="Support Email" value={general?.supportEmail} onChange={(v) => setSettings({...settings, general: {...general, supportEmail: v}})} />
                <InputGroup label="Contact Number" value={general?.contactNumber} onChange={(v) => setSettings({...settings, general: {...general, contactNumber: v}})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Default Currency</label>
                  <select 
                    value={general?.defaultCurrency || 'INR'} 
                    onChange={(e) => setSettings({...settings, general: {...general, defaultCurrency: e.target.value}})}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Timezone</label>
                  <select 
                    value={general?.timezone || 'Asia/Kolkata'}
                    onChange={(e) => setSettings({...settings, general: {...general, timezone: e.target.value}})}
                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  >
                    <option value="Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
              <Button onClick={() => handleSave('general', general)} loading={loading} className="px-8" icon={<Save size={16} />}>Update General Settings</Button>
            </div>
          </Card>

          {/* SECTION 2: EMAIL SETTINGS */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Email Gateway (SMTP)</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automated communications & alerts</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={testSMTP} icon={<Send size={14} />}>Test Connection</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="SMTP Host" value={email?.smtpHost} onChange={(v) => setSettings({...settings, email: {...email, smtpHost: v}})} placeholder="smtp.gmail.com" />
              <InputGroup label="SMTP Port" value={email?.smtpPort} onChange={(v) => setSettings({...settings, email: {...email, smtpPort: v}})} placeholder="587" />
              <InputGroup label="Username" value={email?.smtpUsername} onChange={(v) => setSettings({...settings, email: {...email, smtpUsername: v}})} />
              <InputGroup label="Password" value={email?.smtpPassword} onChange={(v) => setSettings({...settings, email: {...email, smtpPassword: v}})} type="password" />
              <InputGroup label="Sender Email" value={email?.senderEmail} onChange={(v) => setSettings({...settings, email: {...email, senderEmail: v}})} />
              <InputGroup label="Sender Name" value={email?.senderName} onChange={(v) => setSettings({...settings, email: {...email, senderName: v}})} />
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
              <Button onClick={() => handleSave('email', email)} loading={loading} className="px-8" icon={<Save size={16} />}>Save SMTP Config</Button>
            </div>
          </Card>

          {/* SECTION 3: SECURITY SETTINGS */}
          <Card className="p-8 border-none shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Security & Session</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Platform safety & access control</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <InputGroup label="Min Password Length" value={security?.minPasswordLength} onChange={(v) => setSettings({...settings, security: {...security, minPasswordLength: v}})} type="number" />
                  <InputGroup label="Session Timeout (sec)" value={security?.sessionTimeout} onChange={(v) => setSettings({...settings, security: {...security, sessionTimeout: v}})} type="number" />
                  <InputGroup label="Login Attempt Limit" value={security?.loginAttemptLimit} onChange={(v) => setSettings({...settings, security: {...security, loginAttemptLimit: v}})} type="number" />
                </div>
                <div className="space-y-4">
                  <ToggleItem label="Require Uppercase" desc="Forces at least one uppercase letter" value={security?.requireUppercase} onChange={(v) => setSettings({...settings, security: {...security, requireUppercase: v}})} />
                  <ToggleItem label="Require Numbers" desc="Forces at least one digit" value={security?.requireNumber} onChange={(v) => setSettings({...settings, security: {...security, requireNumber: v}})} />
                  <ToggleItem label="Require Special Chars" desc="Forces symbols like @, #, $" value={security?.requireSpecialChar} onChange={(v) => setSettings({...settings, security: {...security, requireSpecialChar: v}})} />
                  <ToggleItem label="Two-Factor Auth" desc="Enable 2FA for all admin accounts" value={security?.twoFactorEnabled} onChange={(v) => setSettings({...settings, security: {...security, twoFactorEnabled: v}})} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
              <Button onClick={() => handleSave('security', security)} loading={loading} className="px-8" icon={<Save size={16} />}>Commit Security Rules</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", placeholder = "" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
      <input 
        type={type} 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 placeholder:text-slate-300 transition-all"
      />
    </div>
  );
}

function ToggleItem({ label, desc, value, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-xs font-black text-slate-900 leading-none">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 truncate">{desc}</p>
      </div>
      <div 
        onClick={() => onChange(!value)}
        className={cn(
          "w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer p-1",
          value ? "bg-[#FF6B00]" : "bg-slate-300"
        )}
      >
        <div className={cn(
          "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
          value ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}
