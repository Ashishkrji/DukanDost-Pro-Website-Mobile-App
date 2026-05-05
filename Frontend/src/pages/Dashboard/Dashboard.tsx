import {
  TrendingUp, Wallet, CreditCard, Package, Bot, Send,
  MessageCircle, MoreVertical, ArrowRight, Filter, Download,
  ShoppingBag, Users, AlertTriangle, Zap
} from 'lucide-react';
import React, { useEffect } from 'react';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Card, StatCard, Badge } from '@/components/ui';
import { useLanguageStore } from '@/store/languageStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const COLORS = ['#FF6B00', '#00C853', '#6C3483', '#1A1A2E', '#0EA5E9', '#F59E0B'];

export default function Dashboard() {
  const { 
    transactions, customers, products, orders, showToast, user,
    fetchCustomers, fetchTransactions, fetchProducts, fetchStaff, fetchPayments, fetchNotifications,
    fetchVendors, vendors, fetchAnalytics, analytics
  } = useStore();

  const { t } = useLanguageStore();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCustomers(),
        fetchTransactions(),
        fetchProducts(),
        fetchStaff(),
        fetchPayments(),
        fetchNotifications(),
        fetchVendors(),
        fetchAnalytics()
      ]);
    };
    loadData();
  }, []);

  const overdueCustomers = (customers || []).filter(c => c.status === 'Overdue').slice(0, 4);
  const lowStockItems = (products || []).filter(p => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK');
  const pendingOrders = (orders || []).filter(o => o.status === 'Pending');

  const totalLena = analytics?.recovery?.totalOutstanding || 0;
  const totalDena = (vendors || []).reduce((s, v) => s + (v.balance || 0), 0);
  const todaySales = analytics?.pl?.totalSales || 0;

  const isOnline = useOnlineStatus();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      {!isOnline && (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-4 text-red-600 animate-pulse">
           <AlertTriangle size={24} />
           <div>
              <p className="font-bold">आप ऑफलाइन हैं (Offline Mode Active)</p>
              <p className="text-xs">आप अभी भी बिल बना सकते हैं। इंटरनेट आने पर डेटा सिंक हो जाएगा।</p>
           </div>
        </div>
      )}

      {/* AI Smart Tip Banner */}
      {overdueCustomers.length > 0 && (
        <div className="relative bg-gradient-to-br from-[#1A1A2E] via-[#252550] to-[#16213E] rounded-2xl p-5 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
              <Bot size={26} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">AI Smart Tip</span>
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <h3 className="font-display text-base md:text-lg font-bold mb-1">
                {overdueCustomers[0].name} का बैलेंस ₹{overdueCustomers[0].balance.toLocaleString('en-IN')} ओवरड्यू है!
              </h3>
              <p className="text-white/70 text-sm">
                आज WhatsApp रिमाइंडर भेजने का बेस्ट टाइम है। 🕐 रिस्पॉन्स रेट 3 गुना ज़्यादा होगी!
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => showToast('WhatsApp reminder sent!', 'success')}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Send size={15} /> WhatsApp भेजें
              </button>
            </div>
          </div>
          <Bot size={200} className="absolute -right-10 -top-10 text-white/3 rotate-12 pointer-events-none" />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t('totalSales')}
          value={`₹${todaySales.toLocaleString('en-IN')}`}
          icon={<TrendingUp size={20} />}
          topBorder="green"
        />
        <StatCard
          title={t('receivable')}
          value={`₹${totalLena.toLocaleString('en-IN')}`}
          icon={<Wallet size={20} />}
          topBorder="orange"
        />
        <StatCard
          title={t('payable')}
          value={`₹${totalDena.toLocaleString('en-IN')}`}
          icon={<ArrowRight size={20} />}
          topBorder="red"
        />
        <StatCard
          title={t('activeOrders')}
          value={pendingOrders.length}
          icon={<ShoppingBag size={20} />}
          topBorder="blue"
        />
        <StatCard
          title={t('lowStock')}
          value={`${lowStockItems.length}`}
          icon={<Package size={20} />}
          topBorder="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">{t('revenueVsExpenses')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">पिछले 7 दिन / Last 7 Days</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trends || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} name="कमाई" />
                <Area type="monotone" dataKey="expenses" stroke="#94A3B8" fillOpacity={1} fill="#F1F5F9" strokeWidth={2} name="खर्च" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Due Alerts */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-base font-bold text-slate-900">⚠️ {t('stockAlerts')}</h3>
            <Link to="/inventory" className="text-xs font-bold text-orange-600">{t('viewAll')} →</Link>
          </div>
          <div className="space-y-3">
             {lowStockItems.slice(0, 4).map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <span className="text-sm font-bold truncate max-w-[120px]">{item.name}</span>
                  <Badge status="danger">{item.stock} left</Badge>
               </div>
             ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
               <h3 className="font-display text-base font-bold text-slate-900">{t('recentTransactions')}</h3>
               <Link to="/reports" className="text-xs font-bold text-orange-600">{t('viewAll')} →</Link>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                     <tr><th className="px-5 py-3 text-left text-[10px] font-black uppercase text-slate-400">Grahak</th><th className="px-5 py-3 text-right text-[10px] font-black uppercase text-slate-400">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y">
                     {transactions.slice(0, 5).map(tx => (
                        <tr key={tx.id}>
                           <td className="px-5 py-4 font-bold">{tx.customerName}</td>
                           <td className="px-5 py-4 text-right font-mono font-black text-orange-600">₹{tx.amount.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         <Card className="p-6">
            <h3 className="font-display text-base font-bold text-slate-900 mb-4">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-3">
               <Link to="/invoices/new" className="p-4 bg-orange-50 text-orange-600 rounded-2xl flex flex-col items-center gap-2 border border-orange-100 hover:scale-105 transition-transform">
                  <CreditCard size={20} />
                  <span className="text-xs font-bold">नया बिल</span>
               </Link>
               <Link to="/khata" className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center gap-2 border border-blue-100 hover:scale-105 transition-transform">
                  <Users size={20} />
                  <span className="text-xs font-bold">ग्राहक जोड़ें</span>
               </Link>
            </div>
         </Card>
      </div>
    </div>
  );
}
