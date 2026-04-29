import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, TrendingUp, TrendingDown, IndianRupee, BarChart3, Calendar, Users, Package } from 'lucide-react';
import { Card, PageHeader, StatCard, Button, Tabs, Badge } from '@/components/ui';
import { monthlyRevenueData, weeklyChartData, categoryData } from '@/lib/mockData';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { exportToCSV } from '@/lib/exportUtils';

const COLORS = ['#FF6B00', '#00C853', '#6C3483', '#1A1A2E', '#0EA5E9', '#F59E0B'];

const topCustomersMock = [
  { name: 'Suresh Sharma', amount: 45200, transactions: 18 },
  { name: 'Rajesh Kumar', amount: 38500, transactions: 24 },
  { name: 'Mohan Lal', amount: 31800, transactions: 15 },
  { name: 'Priya Singh', amount: 28600, transactions: 21 },
  { name: 'Vikram Patel', amount: 22400, transactions: 12 },
];

export default function Reports() {
  const [period, setPeriod] = useState('6months');
  const [activeTab, setActiveTab] = useState('revenue');
  const { analytics, fetchAnalytics } = useStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const { pl, recovery, profitability } = analytics;

  const totalRevenue = pl.totalSales;
  const totalExpenses = pl.totalPurchases + pl.totalExpenses;
  const totalProfit = pl.netProfit;
  const chartData = monthlyRevenueData;
  const weeklyData = weeklyChartData;

  const tabs = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'recovery', label: 'Recovery' },
    { id: 'profitability', label: 'Top Profit' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Apne business ki growth aur history dekhein."
        icon={<BarChart3 size={20} />}
        action={
          <div className="flex gap-2">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl bg-white px-3 py-2 font-medium text-slate-600 focus:outline-none focus:border-orange-400"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
            </select>
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Download size={14} />}
              onClick={() => {
                if (activeTab === 'profitability') {
                  exportToCSV(profitability, 'Customer_Profitability');
                } else if (activeTab === 'recovery') {
                  exportToCSV([recovery], 'Recovery_Summary');
                } else {
                  exportToCSV([pl], 'PL_Summary');
                }
              }}
            >
              Export
            </Button>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          trend={totalRevenue > 0 ? { value: 'Bikri badh rahi hai', positive: true } : undefined}
          icon={<TrendingUp size={20} />}
          iconBg="bg-green-100 text-green-600"
          topBorder="green"
        />
        <StatCard
          title="Net Profit"
          value={`₹${totalProfit.toLocaleString('en-IN')}`}
          trend={totalProfit > 0 ? { value: 'Profit ho raha hai', positive: true } : undefined}
          icon={<IndianRupee size={20} />}
          iconBg="bg-blue-100 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          trend={totalExpenses > 0 ? { value: 'Kharcha tracked', positive: false } : undefined}
          icon={<TrendingDown size={20} />}
          iconBg="bg-red-100 text-red-600"
          topBorder="red"
        />
        <StatCard
          title="Profit Margin"
          value={totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'}
          subtitle="Net margin"
          icon={<BarChart3 size={20} />}
          iconBg="bg-orange-100 text-orange-600"
          topBorder="orange"
        />
      </div>

      {/* Charts with Tabs */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Business Analytics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Monthly performance overview</p>
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === 'revenue' && (
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(v: number, name: string) => [`₹${v.toLocaleString('en-IN')}`, name === 'revenue' ? 'Revenue' : name === 'profit' ? 'Profit' : 'Expenses']}
                  />
                  <Bar dataKey="revenue" fill="#FF6B00" radius={[6, 6, 0, 0]} maxBarSize={36} name="Revenue" />
                  <Bar dataKey="profit" fill="#00C853" radius={[6, 6, 0, 0]} maxBarSize={36} name="Profit" />
                  <Bar dataKey="expenses" fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={36} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <BarChart3 size={48} className="mb-2 opacity-10" />
                <p className="text-sm font-medium">Bikri suru karein graph dekhne ke liye</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recovery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-slate-900">₹{recovery.totalOutstanding.toLocaleString('en-IN')}</p>
                <p className="text-xs text-slate-500 font-medium">Total Outstanding from {recovery.customerCount} customers</p>
              </div>
              <div className="text-right">
                <Badge status="warning">Pending Recovery</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(recovery.aging).map(([range, amount]) => {
                const val = Number(amount);
                return (
                  <div key={range} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{range}</p>
                    <p className="text-sm font-bold text-slate-800">₹{val.toLocaleString('en-IN')}</p>
                    <div className="h-1 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${recovery.totalOutstanding > 0 ? (val / recovery.totalOutstanding * 100) : 0}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
              * Recovery reports help you prioritize which customers to call first based on payment aging.
            </p>
          </div>
        )}

        {activeTab === 'profitability' && (
          <div className="space-y-3">
            {profitability.length > 0 ? profitability.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition-colors">
                <span className="w-7 h-7 bg-gradient-to-br from-[#00C853] to-[#00E676] text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.transactionCount} Purchases</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900">₹{c.totalSales.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-green-600 font-semibold mt-0.5">Total Sales</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <Users size={48} className="mb-2 opacity-10" />
                <p className="text-sm font-medium">Koi sales data nahi mila abhi</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Weekly Trend */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Weekly Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Revenue vs Expenses this week</p>
          </div>
        </div>
        <div className="h-56 w-full">
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                <Area type="monotone" dataKey="expenses" stroke="#94A3B8" fill="url(#expGrad)" strokeWidth={2} name="Kharcha" />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" fill="url(#revGrad)" strokeWidth={2.5} name="Bikri" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <Calendar size={48} className="mb-2 opacity-10" />
              <p className="text-sm font-medium">Hafte ki report jald hi yahan dikhegi</p>
            </div>
          )}
        </div>
      </Card>

      {/* Profit Margin Trend */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Profitability Acceleration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Efficiency trend (Margin %)</p>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData.map(d => ({ ...d, margin: d.expenses > 0 ? ((d.revenue - d.expenses) / d.revenue * 100).toFixed(1) : 0 }))} 
              margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} formatter={(v: any) => [`${v}%`, 'Margin']} />
              <Area type="monotone" dataKey="margin" stroke="#22C55E" fill="url(#marginGrad)" strokeWidth={2.5} name="Margin" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
