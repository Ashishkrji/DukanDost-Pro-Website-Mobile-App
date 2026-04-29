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
import { weeklyChartData, categoryData } from '@/lib/mockData';
import { useLanguageStore } from '@/store/languageStore';

const COLORS = ['#FF6B00', '#00C853', '#6C3483', '#1A1A2E', '#0EA5E9', '#F59E0B'];

export default function Dashboard() {
  const { 
    transactions, customers, products, orders, showToast, user,
    fetchCustomers, fetchTransactions, fetchProducts, fetchStaff, fetchPayments, fetchNotifications,
    fetchVendors, vendors
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
        fetchVendors()
      ]);
    };
    loadData();
  }, []);

  const overdueCustomers = customers.filter(c => c.status === 'Overdue').slice(0, 4);
  const lowStockItems = products.filter(p => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK');
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  const totalLena = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const totalDena = vendors.reduce((s, v) => s + (v.balance || 0), 0);
  const todaySales = transactions
    .filter(t => t.type === 'Liya' && t.createdAt?.includes('26 Apr'))
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">

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
                {overdueCustomers[0].name} ka balance ₹{overdueCustomers[0].balance.toLocaleString('en-IN')} overdue hai!
              </h3>
              <p className="text-white/70 text-sm">
                Aaj WhatsApp reminder bhejne ka best time hai. 🕐 Response rate 3x zyada hogi!
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => showToast('WhatsApp reminder sent!', 'success')}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Send size={15} /> WhatsApp Bhejien
              </button>
              <Link to="/ai">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-colors">
                  AI Insights
                </button>
              </Link>
            </div>
          </div>
          {/* Decorative */}
          <Bot size={200} className="absolute -right-10 -top-10 text-white/3 rotate-12 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t('totalSales')}
          value={`₹${todaySales.toLocaleString('en-IN')}`}
          trend={todaySales > 0 ? { value: 'Bikri badh rahi hai', positive: true } : undefined}
          icon={<TrendingUp size={20} />}
          iconBg="bg-green-100 text-green-600"
          topBorder="green"
        />
        <StatCard
          title="Total Receivable"
          value={`₹${totalLena.toLocaleString('en-IN')}`}
          subtitle="Grahakon se lena hai"
          icon={<Wallet size={20} />}
          iconBg="bg-orange-100 text-orange-600"
          topBorder="orange"
        />
        <StatCard
          title="Total Payable"
          value={`₹${totalDena.toLocaleString('en-IN')}`}
          subtitle="Vendors ko dena hai"
          icon={<ArrowRight size={20} />}
          iconBg="bg-red-100 text-red-600"
          topBorder="red"
        />
        <StatCard
          title={t('activeOrders')}
          value={pendingOrders.length}
          subtitle="Store orders"
          icon={<ShoppingBag size={20} />}
          iconBg="bg-blue-100 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title={t('lowStock')}
          value={`${lowStockItems.length} Items`}
          subtitle="Stock alerts"
          icon={<Package size={20} />}
          iconBg="bg-slate-100 text-slate-600"
          topBorder="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pichle 7 Din / Last 7 Days</p>
            </div>
            <select className="text-xs font-semibold border border-slate-200 rounded-lg bg-white px-3 py-2 text-slate-600 focus:outline-none focus:border-orange-400">
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-64 w-full">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={8} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']}
                  />
                  <Area type="monotone" dataKey="expenses" stroke="#94A3B8" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} name="Kharcha" />
                  <Area type="monotone" dataKey="revenue" stroke="#FF6B00" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} name="Bikri" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <TrendingUp size={48} className="mb-2 opacity-10" />
                <p className="text-sm font-medium">Lenden suru karein graph dekhne ke liye</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
              <span className="text-xs font-semibold text-slate-600">Bikri (Revenue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Kharcha (Expenses)</span>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6 flex flex-col">
          <h3 className="font-display text-base font-bold text-slate-900 mb-4">Top Categories</h3>
          <div className="flex-1 flex items-center justify-center">
            {categoryData.some(c => c.value > 0) ? (
              <PieChart width={160} height={160}>
                <Pie data={categoryData} cx={75} cy={75} innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <div className="text-center py-10">
                <Package size={40} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[10px] text-slate-400">Data nahi hai</p>
              </div>
            )}
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.some(c => c.value > 0) ? categoryData.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-600 font-medium">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{cat.value}%</span>
              </div>
            )) : (
              <p className="text-[10px] text-slate-400 text-center italic">Items add karein data dekhne ke liye</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Due Alerts */}
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-base font-bold text-slate-900">⚠️ Due Alerts</h3>
            <Link to="/khata" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              Sab Dekhein <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-2.5 flex-1">
            {overdueCustomers.length > 0 ? overdueCustomers.map(customer => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-orange-50/50 transition-colors rounded-xl cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0', customer.color)}>
                    {customer.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                    <p className="text-[10px] text-red-600 font-semibold">Overdue</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-orange-600 font-mono">₹{customer.balance.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => showToast(`Reminder sent to ${customer.name}!`)}
                    className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-slate-300">
                <Users size={32} className="mb-2 opacity-20" />
                <p className="text-xs font-medium">Koi overdue payments nahi hai</p>
              </div>
            )}
          </div>
          <button
            onClick={() => showToast('Reminders sent to all overdue customers!')}
            className="w-full mt-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Send All Reminders
          </button>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-display text-base font-bold text-slate-900">Halia Len-Den / Recent Transactions</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                <Filter size={13} /> Filter
              </button>
              <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                <Download size={13} /> Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Date/Time</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Grahak</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-slate-700">{tx.createdAt?.split(', ')[0]}</p>
                      <p className="text-[10px] text-slate-400">{tx.createdAt?.split(', ')[1] || ''}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', tx.customerColor)}>
                          {tx.customerInitials}
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{tx.customerName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono text-sm font-bold text-slate-900">₹{tx.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge status={tx.type === 'Liya' ? 'success' : 'warning'}>
                        {tx.type === 'Liya' ? '↓ Liya' : '↑ Diya'}
                      </Badge>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 italic text-sm">
                      Abhi tak koi lenden nahi hua hai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link to="/reports" className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
              View All Transactions <ArrowRight size={15} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Action + Stock Alerts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-display text-base font-bold text-slate-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Transaction', icon: <Zap size={18} />, href: '/khata', color: 'bg-orange-50 text-orange-600 border-orange-200' },
              { label: 'Create Invoice', icon: <CreditCard size={18} />, href: '/invoices', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { label: 'Add Customer', icon: <Users size={18} />, href: '/khata', color: 'bg-green-50 text-green-600 border-green-200' },
              { label: 'AI Insights', icon: <Bot size={18} />, href: '/ai', color: 'bg-purple-50 text-purple-600 border-purple-200' },
            ].map(action => (
              <Link key={action.label} to={action.href}>
                <div className={cn('flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer hover:scale-[1.02] transition-transform', action.color)}>
                  {action.icon}
                  <span className="text-sm font-semibold">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              <AlertTriangle size={16} className="inline text-red-500 mr-1.5" />
              Stock Alerts
            </h3>
            <Link to="/inventory" className="text-xs font-bold text-orange-600 hover:text-orange-700">
              Sab Dekhein →
            </Link>
          </div>
          <div className="space-y-2.5">
            {lowStockItems.length > 0 ? lowStockItems.slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between p-2.5 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{item.icon || '📦'}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge status={item.status === 'OUT OF STOCK' ? 'danger' : 'warning'}>
                    {item.stock === 0 ? 'Out' : `${item.stock} left`}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-300">
                <Package size={28} className="mb-2 opacity-20" />
                <p className="text-[10px] font-medium">Sab kuch stock mein hai</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
