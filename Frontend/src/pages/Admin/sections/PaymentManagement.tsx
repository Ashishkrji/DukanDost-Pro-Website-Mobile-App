import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { 
  CreditCard, Search, Filter, Download, 
  ExternalLink, CheckCircle2, XCircle, Clock,
  ArrowRight, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function PaymentManagement() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminToken } = useAdminAuthStore();

  useEffect(() => {
    fetchPayments();
  }, [adminToken]);

  const fetchPayments = async () => {
    if (!adminToken) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/payments`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setPayments(data.logs);
    } catch (err) {
      console.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Razorpay Transaction Monitoring</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time payment verification and financial logs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Download size={16} />}>Financial Report</Button>
          <Button variant="secondary" icon={<RefreshCw size={16} />}>Sync Razorpay</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-green-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Captured</p>
          <h3 className="text-3xl font-black text-slate-900">₹{(payments.filter(p => p.paymentStatus === 'captured').reduce((s, p) => s + p.amount, 0)).toLocaleString()}</h3>
        </Card>
        <Card className="p-6 border-l-4 border-red-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Failed</p>
          <h3 className="text-3xl font-black text-slate-900">{payments.filter(p => p.paymentStatus === 'failed').length} Transactions</h3>
        </Card>
        <Card className="p-6 border-l-4 border-blue-500">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pending Refunds</p>
          <h3 className="text-3xl font-black text-slate-900">0 Requests</h3>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User / Shop</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-900 font-mono">{p.paymentId || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{p.orderId}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{p.userId?.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{p.userId?.businessName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900">₹{p.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <CreditCard size={12} /> Razorpay Card/UPI
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge status={p.paymentStatus === 'captured' ? 'success' : 'danger'}>
                      {p.paymentStatus || 'unknown'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-300 hover:text-slate-900 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
