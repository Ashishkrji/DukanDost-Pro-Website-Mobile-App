import { useState } from 'react';
import { Settings as SettingsIcon, User, Store, Bell, Shield, CreditCard, Smartphone, Globe, Save, Check, QrCode, FileText, Image as ImageIcon, Palette } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, languages, Language } from '@/store/languageStore';
import { Button, Card, PageHeader, InputField, Tabs, Badge, SelectField } from '@/components/ui';
import { cn } from '@/lib/utils';
import axios from 'axios';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'business', label: 'Business' },
  { id: 'invoice', label: 'Invoices (Branding)' },
  { id: 'language', label: 'Language' },
  { id: 'payments', label: 'Payments' },
  { id: 'controls', label: 'Admin Controls' },
];

export default function Settings() {
  const { showToast } = useStore();
  const { user, updateUserProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Invoice Customization (M13)
  const [invoiceTheme, setInvoiceTheme] = useState('Professional');
  const [showLogo, setShowLogo] = useState(true);
  const [customTerms, setCustomTerms] = useState('Goods once sold will not be taken back.');
  const [bankDetails, setBankDetails] = useState('');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader title="Settings" subtitle="Account aur business ki settings manage karein." icon={<SettingsIcon size={20} />} />
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && (
        <Card className="p-6">
           <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><User size={18} /> Profile Info</h4>
           <div className="grid grid-cols-2 gap-4">
              <InputField label="Name" defaultValue={user?.fullName} />
              <InputField label="Phone" defaultValue={user?.phone} />
           </div>
           <Button className="mt-6">Update Profile</Button>
        </Card>
      )}

      {activeTab === 'invoice' && (
        <Card className="p-6">
           <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><FileText size={18} /> Invoice Branding (M13)</h4>
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <SelectField label="Invoice Theme" value={invoiceTheme} onChange={e => setInvoiceTheme(e.target.value)} options={[{value:'Professional',label:'Professional (Classic)'},{value:'Modern',label:'Modern (Sleek)'},{value:'Compact',label:'Compact (Thermal)'}]} />
                    <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                       <div>
                          <p className="text-sm font-bold">Shop Logo dikhayein?</p>
                          <p className="text-xs text-slate-500">Bill par aapka logo print hoga.</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-orange-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                       </label>
                    </div>
                 </div>
                 <div className="p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 aspect-video">
                    <ImageIcon size={32} />
                    <p className="mt-2 text-xs font-bold uppercase">Upload Shop Logo</p>
                    <p className="text-[10px]">PNG, JPG up to 1MB</p>
                 </div>
              </div>

              <InputField label="Custom Terms & Conditions" value={customTerms} onChange={e => setCustomTerms(e.target.value)} />
              <InputField label="Bank Details (Account No, IFSC)" value={bankDetails} onChange={e => setBankDetails(e.target.value)} placeholder="e.g. SBI A/C: 123456789, IFSC: SBIN0001" />
              
              <div className="flex justify-end pt-4 border-t">
                 <Button onClick={() => showToast('Invoice settings saved!')} icon={<Save size={15} />}>Save Branding</Button>
              </div>
           </div>
        </Card>
      )}

      {activeTab === 'controls' && (
        <div className="space-y-6">
           {/* Store Status */}
           <Card className="p-6">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-indigo-600"><Store size={18} /> Digital Dukan Customization</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <p className="text-sm font-black text-slate-900">Online Store Status</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dukan ko online ya offline karein</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <InputField label="Delivery Charge (₹)" type="number" defaultValue="40" />
                    <InputField label="Min Free Delivery Amount (₹)" type="number" defaultValue="500" />
                 </div>
              </div>
           </Card>

           {/* GST & Tax */}
           <Card className="p-6">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-orange-600"><Shield size={18} /> GST & Tax Controls</h4>
              <div className="space-y-4">
                 <SelectField 
                    label="Default GST Rate (%)" 
                    options={[{value:'0',label:'0% (Exempt)'},{value:'5',label:'5% (Food/Basic)'},{value:'12',label:'12%'},{value:'18',label:'18% (Standard)'},{value:'28',label:'28%'}]} 
                    defaultValue="18"
                 />
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                       <p className="text-sm font-black text-slate-900">Enable Automated E-Invoice</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automatic IRN & QR generation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" />
                       <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-orange-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                 </div>
              </div>
           </Card>

           {/* WhatsApp Templates */}
           <Card className="p-6">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-green-600"><Bell size={18} /> WhatsApp Templates</h4>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Invoice Message Template</label>
                    <textarea 
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none min-h-[100px]"
                       defaultValue="Namaste! Your bill from {{shopName}} is ready. Total: ₹{{amount}}. View here: {{link}}"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Payment Reminder Template</label>
                    <textarea 
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none min-h-[100px]"
                       defaultValue="Reminder: You have a pending balance of ₹{{balance}} at {{shopName}}. Please clear it soon."
                    />
                 </div>
              </div>
           </Card>

           <div className="flex justify-end">
              <Button size="lg" className="bg-slate-900 h-14 px-8 rounded-2xl font-black uppercase tracking-widest" icon={<Save size={20} />}>Save Admin Settings</Button>
           </div>
        </div>
      )}
    </div>
  );
}
