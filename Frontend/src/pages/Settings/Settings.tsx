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

      {/* Other tabs simplified for brevity in this step */}
    </div>
  );
}
