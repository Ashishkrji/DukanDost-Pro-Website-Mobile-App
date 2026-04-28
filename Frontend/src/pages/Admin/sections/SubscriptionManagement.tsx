import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { 
  Star, Crown, Shield, Activity, 
  ArrowUpRight, Clock, CheckCircle2,
  AlertTriangle, Filter, Search, Edit3
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminToken } = useAdminAuthStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [adminToken]);

  const fetchSubscriptions = async () => {
    if (!adminToken) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/payments`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setPlans(data.logs);
    } catch (err) {
      console.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Subscription Registry</h2>
          <p className="text-sm text-slate-500 font-medium">Monitoring active plans and renewal cycles</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Filter size={16} />}>Filter Plans</Button>
          <Button icon={<Shield size={16} />}>Manual Provision</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchant & Order</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Billing Period</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#FF6B00]">
                          <Activity size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{log.userId?.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {log.orderId?.substring(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Badge status={log.planName === 'Business' ? 'success' : 'warning'}>{log.planName}</Badge>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">₹{log.amount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(log.subscriptionStartDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - 
                          {new Date(log.subscriptionEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Next Billing in 24 Days</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Active Plan
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-300 hover:text-slate-900 transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
