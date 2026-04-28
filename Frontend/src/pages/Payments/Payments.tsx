import { useState, useEffect } from 'react';
import { 
  QrCode, Search, Share2, Download, ArrowUpRight, 
  CheckCircle2, Filter, CreditCard, Clock, AlertCircle, 
  TrendingUp, BarChart3, Printer, ExternalLink
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { 
  Button, Badge, Card, PageHeader, 
  SearchInput, StatCard, Tabs, EmptyState 
} from '@/components/ui';
import axios from 'axios';

export default function Payments() {
  const { payments, fetchPayments, showToast } = useStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get('/api/payments/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('dd_token')}` }
        });
        setPaymentSettings(res.data.settings);
        fetchPayments();
      } catch (err) {
        console.error('Failed to fetch payment settings:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const upiId = paymentSettings?.upiId || user?.upiId || 'not-configured@upi';
  const accountHolder = paymentSettings?.accountHolderName || user?.fullName || 'Business Owner';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountHolder)}&cu=INR`;

  const successful = payments.filter(p => p.status === 'Success');
  const pending = payments.filter(p => p.status === 'Pending');
  const failed = payments.filter(p => p.status === 'Failed');
  const totalToday = successful.reduce((s, p) => s + p.amount, 0);

  const tabs = [
    { id: 'All', label: 'Sab (All)', count: payments.length },
    { id: 'Success', label: 'Successful', count: successful.length },
    { id: 'Pending', label: 'Pending', count: pending.length },
    { id: 'Failed', label: 'Failed', count: failed.length },
  ];

  const filtered = payments.filter(p => {
    const name = p.customer || '';
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All' || p.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `store-qr-${user?.businessName}.png`;
      link.href = url;
      link.click();
      showToast('QR Code downloaded successfully!');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Payments & QR"
        subtitle="Manage your business payments, QR codes and track collection analytics."
        icon={<QrCode size={20} className="text-[#FF6B00]" />}
      />

      {/* SECTION 1 — TOP STATS & ALERTS */}
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[280px] p-6 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D5F] text-white overflow-hidden relative border-none">
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Today's Collection</p>
              <h2 className="text-4xl font-black mb-4">₹{totalToday.toLocaleString('en-IN')}</h2>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Successful</p>
                  <p className="text-sm font-bold text-green-400">{successful.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Pending</p>
                  <p className="text-sm font-bold text-amber-400">{pending.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Failed</p>
                  <p className="text-sm font-bold text-red-400">{failed.length}</p>
                </div>
              </div>
            </div>
            <TrendingUp size={120} className="absolute -bottom-4 -right-4 text-white/5 -rotate-12" />
          </Card>

          <Card className="flex-1 min-w-[280px] p-6 border-l-4 border-l-amber-500 bg-amber-50/30">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
              <AlertCircle size={18} /> Payment Alerts
            </h4>
            <div className="space-y-2">
              <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {pending.length} pending payments require follow-up
              </p>
              <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ₹{pending.reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')} overdue from customers
              </p>
              <p className="text-xs text-green-700 font-bold flex items-center gap-2 mt-4">
                <CheckCircle2 size={14} /> Last payment received 2 hours ago
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION 2 — STORE QR CODE CARD */}
        <Card className="lg:col-span-1 p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-full flex justify-between items-center mb-8">
            <h3 className="font-display font-black text-slate-900 uppercase tracking-tight">Store QR Code</h3>
            <Badge status={paymentSettings ? 'success' : 'warning'}>
              {paymentSettings ? 'Linked' : 'Not Linked'}
            </Badge>
          </div>

          <div className="relative group cursor-pointer">
            <div className="absolute -inset-4 bg-orange-100 rounded-[2.5rem] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
            <div className="bg-white p-6 rounded-[2rem] shadow-xl relative z-10 border border-slate-100">
              <QRCodeCanvas value={upiUrl} size={200} level="H" />
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <h2 className="font-display font-black text-xl text-slate-900">{user?.businessName || 'Your Dukaan'}</h2>
            <p className="text-sm font-bold text-[#FF6B00] uppercase tracking-widest">{upiId}</p>
            <p className="text-xs text-slate-400 font-medium">{accountHolder}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-10">
            <Button variant="secondary" size="sm" icon={<Download size={14} />} className="rounded-xl font-bold" onClick={handleDownloadQR}>
              Download
            </Button>
            <Button variant="secondary" size="sm" icon={<Printer size={14} />} className="rounded-xl font-bold" onClick={() => window.print()}>
              Print QR
            </Button>
            <Button variant="primary" size="sm" icon={<Share2 size={14} />} className="col-span-2 rounded-xl font-bold">
              Share with Customers
            </Button>
          </div>

          <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Customers can scan and pay directly <br /> to your UPI account via any app.
          </p>
        </Card>

        {/* SECTION 4 — PAYMENT ANALYTICS (Gated for Pro/Business) */}
        <Card className="lg:col-span-2 p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-black text-slate-900 uppercase tracking-tight">Collection Analytics</h3>
            <div className="flex gap-2">
              {['7D', '30D', '90D'].map(p => (
                <button key={p} className="px-3 py-1 text-[10px] font-black border border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{p}</button>
              ))}
            </div>
          </div>

          {user?.plan === 'Starter' ? (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 size={32} />
              </div>
              <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight">Unlock Analytics</h4>
              <p className="text-sm text-slate-500 max-w-xs mb-6">Upgrade to Pro to see detailed collection trends, monthly revenue charts and customer payment habits.</p>
              <Button size="sm" onClick={() => useStore.getState().openUpgradePopup('Pro', 'Payment Analytics')}>Upgrade to Pro</Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                <TrendingUp size={48} className="animate-pulse" />
                <span className="font-bold uppercase tracking-widest text-xs ml-3">Daily Collection Chart Loading...</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Growth</p>
                  <p className="text-xl font-black text-green-900">+24%</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Avg Pay</p>
                  <p className="text-xl font-black text-blue-900">₹840</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-1">Retention</p>
                  <p className="text-xl font-black text-purple-900">88%</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* SECTION 3 — PAYMENT HISTORY TABLE */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-slate-900 uppercase tracking-tight">Payment History</h3>
            <p className="text-xs text-slate-500 font-medium">Detailed log of all online and manual collections.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <SearchInput value={searchTerm} onChange={setSearchTerm} className="flex-1 md:w-64" />
            <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filter</Button>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer / Invoice</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
                        {p.customerInitials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{p.customer}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">INV#{p.id.substring(0,6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-slate-900">₹{p.amount.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status="neutral" className="bg-slate-100 text-[10px]">{p.mode}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={p.status === 'Success' ? 'success' : p.status === 'Pending' ? 'warning' : 'danger'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-900">{p.date.split(', ')[0]}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{p.date.split(', ')[1]}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-300 hover:text-[#FF6B00] transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20">
                    <EmptyState 
                      title="No matching payments" 
                      description="Koi payment records nahi mile. Search criteria change karke dekhein."
                      icon={<CreditCard size={40} className="text-slate-100" />}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
