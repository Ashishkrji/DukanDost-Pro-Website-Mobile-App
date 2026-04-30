import React, { useState, useEffect } from 'react';
import { Card, Badge, StatCard } from '@/components/ui';
import { 
  Users, TrendingUp, AlertCircle, Sparkles, 
  CreditCard, BarChart3, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Shield, Activity, Bell
} from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<any[]>([]);
  const { adminToken } = useAdminAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminToken) return;
      try {
        const [{ data: sRes }, { data: tRes }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/stats`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/revenue-trends`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          })
        ]);
        if (sRes.success) setStats(sRes.stats);
        if (tRes.success) setTrends(tRes.trends);
      } catch (err) {
        console.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [adminToken]);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-6 h-32 bg-slate-100 rounded-2xl" />
    <div className="h-96 bg-slate-100 rounded-2xl" />
  </div>;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.starterUsers || 0} Free / ${stats?.proUsers + stats?.businessUsers || 0} Premium`}
          icon={<Users size={20} />}
          iconBg="bg-blue-100 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          trend={{ value: '12% up', positive: true }}
          icon={<TrendingUp size={20} />}
          iconBg="bg-green-100 text-green-600"
          topBorder="green"
        />
        <StatCard
          title="Failed Payments"
          value={stats?.failedPayments || 0}
          trend={{ value: 'Check logs', positive: false }}
          icon={<AlertCircle size={20} />}
          iconBg="bg-red-100 text-red-600"
          topBorder="red"
        />
        <StatCard
          title="Reminders Sent"
          value={stats?.totalRemindersSent || 0}
          subtitle={`${stats?.failedReminders || 0} Delivery Failures`}
          icon={<Bell size={20} />}
          iconBg="bg-orange-100 text-[#FF6B00]"
          topBorder="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Platform Revenue Trend</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Collections (Paise/Rupee conversion)</p>
            </div>
            <select className="bg-slate-50 border-none text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 ring-orange-500/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" aspect={2.5} minHeight={320}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan Distribution */}
        <Card className="p-8">
          <h3 className="text-lg font-black text-slate-900 mb-8">User Segments</h3>
          <div className="space-y-6">
            {[
              { label: 'Starter Plan', count: stats?.starterUsers || 0, color: 'bg-slate-200', text: 'text-slate-600' },
              { label: 'Pro Plan', count: stats?.proUsers || 0, color: 'bg-[#FF6B00]', text: 'text-orange-600' },
              { label: 'Business Plan', count: stats?.businessUsers || 0, color: 'bg-[#0A0B1A]', text: 'text-slate-900' }
            ].map((plan) => {
              const total = stats?.totalUsers || 1;
              const percentage = Math.round((plan.count / total) * 100) || 0;
              return (
                <div key={plan.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{plan.label}</span>
                    <span className="text-sm font-black text-slate-900">{plan.count} ({percentage}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", plan.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 p-6 bg-orange-50 rounded-[2rem] border border-orange-100 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 text-orange-200" size={60} />
            <h4 className="text-sm font-black text-orange-900 mb-1">Conversion Growth</h4>
            <p className="text-xs text-orange-700 font-medium leading-relaxed">
              Your free-to-pro conversion rate is up by 14% this month! Focus on the WhatsApp Reminder marketing.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
