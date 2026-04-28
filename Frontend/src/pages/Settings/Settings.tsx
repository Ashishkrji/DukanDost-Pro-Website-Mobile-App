import { useState } from 'react';
import { Settings as SettingsIcon, User, Store, Bell, Shield, CreditCard, Smartphone, Globe, Save, Check, QrCode } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLanguageStore, languages, Language } from '@/store/languageStore';
import { Button, Card, PageHeader, InputField, Tabs } from '@/components/ui';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'business', label: 'Business' },
  { id: 'language', label: 'Language' },
  { id: 'payments', label: 'Payments' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
];

export default function Settings() {
  const { user, updateUser } = useStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email || '');
  const [businessName, setBusinessName] = useState(user.businessName);
  const [gstin, setGstin] = useState(user.GSTIN);
  const [address, setAddress] = useState(user.address || '');
  const [upiId, setUpiId] = useState(user.upiId || '');

  const [notifications, setNotifications] = useState({
    payment: true,
    stock: true,
    customer: true,
    report: false,
    whatsapp: true,
  });

  const handleSaveProfile = () => {
    updateUser({ name, phone, email });
  };

  const handleSaveBusiness = () => {
    updateUser({ businessName, GSTIN: gstin, address });
  };

  const handleSavePaymentSettings = async () => {
    try {
      const res = await axios.post('/api/payments/settings', {
        upiId,
        accountHolderName: name,
        businessName,
        mobileNumber: phone,
        preferredMethod: 'UPI'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('dd_token')}` }
      });
      if (res.data.success) {
        useStore.getState().showToast('Payment settings saved successfully!', 'success');
      }
    } catch (err) {
      useStore.getState().showToast('Failed to save payment settings', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Settings"
        subtitle="Account aur business ki settings manage karein."
        icon={<SettingsIcon size={20} />}
      />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-200">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">{name}</h3>
              <p className="text-slate-500 text-sm">{phone}</p>
              <button className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700">
                Change Photo →
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
              <User size={16} /> Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <InputField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} type="tel" required />
              <InputField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} type="email" />
              <InputField label="City" placeholder="Delhi" />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveProfile} icon={<Save size={15} />}>Save Profile</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Business Settings */}
      {activeTab === 'business' && (
        <Card className="p-6">
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
              <Store size={16} /> Business Information
            </h4>
            <InputField label="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
            <InputField label="GSTIN Number" value={gstin} onChange={e => setGstin(e.target.value)} placeholder="09AABCU9603R1ZM" />
            <InputField label="Business Address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, PIN" />
            <InputField label="UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="business@ybl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Business Category" placeholder="Kirana Store" />
              <InputField label="Opening Time" type="time" defaultValue="08:00" />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveBusiness} icon={<Save size={15} />}>Save Business Info</Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="font-display font-bold text-red-600 mb-4">⚠️ Danger Zone</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="sm">Export All Data</Button>
              <Button variant="danger" size="sm">Delete Account</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Bell size={16} /> Notification Preferences
          </h4>
          <div className="space-y-4">
            {[
              { key: 'payment', label: 'Payment Received', desc: 'Jab koi payment aaye' },
              { key: 'stock', label: 'Low Stock Alert', desc: 'Jab stock 5 se kam ho' },
              { key: 'customer', label: 'New Customer', desc: 'Naya grahak add hone par' },
              { key: 'report', label: 'Daily Report', desc: 'Roz ki bikri ka summary' },
              { key: 'whatsapp', label: 'WhatsApp Alerts', desc: 'Important alerts WhatsApp par' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={cn(
                    'w-12 h-6 rounded-full transition-all duration-200 relative',
                    notifications[item.key as keyof typeof notifications] ? 'bg-[#FF6B00]' : 'bg-slate-200'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200',
                    notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-0.5'
                  )} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => updateUser({})} icon={<Save size={15} />}>Save Preferences</Button>
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Shield size={16} /> Security Settings
          </h4>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-green-600" />
                <div>
                  <p className="font-bold text-green-800">Account Secure</p>
                  <p className="text-xs text-green-600">2FA enabled · Last login 2 hours ago</p>
                </div>
              </div>
            </div>
            <InputField label="Current Password" type="password" placeholder="••••••••" />
            <InputField label="New Password" type="password" placeholder="••••••••" />
            <InputField label="Confirm New Password" type="password" placeholder="••••••••" />
            <div className="flex justify-end">
              <Button onClick={() => updateUser({})} icon={<Shield size={15} />}>Update Password</Button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h5 className="font-semibold text-slate-900 mb-3">Active Sessions</h5>
              {[
                { device: 'Chrome · Windows 11', location: 'Delhi, India', current: true },
                { device: 'Android App', location: 'Delhi, India', current: false },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{session.device}</p>
                    <p className="text-xs text-slate-500">{session.location}</p>
                  </div>
                  {session.current ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Current</span>
                  ) : (
                    <button className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Language Settings */}
      {activeTab === 'language' && (
        <Card className="p-6">
          <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Globe size={16} /> Language & Region
          </h4>
          <p className="text-slate-500 text-xs mb-6">Apni pasandida bhasha chunein jo pure dashboard par dikhegi.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(languages).map(([code, config]) => {
              const isSelected = currentLanguage === code;
              return (
                <button
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                    isSelected 
                      ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200" 
                      : "bg-white border-slate-200 hover:border-orange-300 hover:bg-slate-50"
                  )}
                >
                  <div className="text-left">
                    <p className={cn("font-bold text-sm", isSelected ? "text-orange-900" : "text-slate-900")}>
                      {config.nativeName}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">{config.name}</p>
                  </div>
                  {isSelected && <Check size={16} className="text-orange-600" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h5 className="font-semibold text-slate-900 mb-2">Regional Formatting</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Currency Format</p>
                <p className="text-sm font-semibold text-slate-900">Indian Rupee (₹)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Format</p>
                <p className="text-sm font-semibold text-slate-900">DD/MM/YYYY</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Settings */}
      {activeTab === 'payments' && (
        <Card className="p-6">
          <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 mb-6">
            <CreditCard size={16} /> Payment Settings
          </h4>
          <div className="space-y-6">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-4 items-start">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                <QrCode size={20} />
              </div>
              <div>
                <p className="font-bold text-orange-900 text-sm">UPI aur Store QR Setup</p>
                <p className="text-xs text-orange-700 leading-relaxed mt-0.5">
                  Apna UPI ID add karein taaki customers direct aapke bank account mein paise bhej sakein. Zero platform fees.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="UPI ID" 
                value={upiId} 
                onChange={e => setUpiId(e.target.value)} 
                placeholder="example@upi" 
                required 
              />
              <InputField 
                label="Account Holder Name" 
                placeholder="Shop Owner Name" 
                defaultValue={user.name}
              />
              <InputField 
                label="Business Display Name" 
                placeholder="Store Name for QR" 
                defaultValue={user.businessName}
              />
              <InputField 
                label="Mobile Number for QR" 
                placeholder="10 digit number" 
                defaultValue={user.phone}
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preferred Payment Method</h5>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Bank Transfer', 'QR Payment'].map(method => (
                  <button
                    key={method}
                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-orange-400 transition-all"
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSavePaymentSettings} icon={<Save size={15} />}>Save Payment Settings</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
