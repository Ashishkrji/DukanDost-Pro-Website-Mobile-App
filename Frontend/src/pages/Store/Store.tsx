import { useState } from 'react';
import type { ReactNode } from 'react';
import { ShoppingBag, Search, Filter, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, StatCard, Tabs, EmptyState } from '@/components/ui';

export default function Store() {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const pending = orders.filter(o => o.status === 'Pending');
  const confirmed = orders.filter(o => o.status === 'Confirmed');
  const delivered = orders.filter(o => o.status === 'Delivered');
  const cancelled = orders.filter(o => o.status === 'Cancelled');
  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.amount, 0);

  const tabs = [
    { id: 'All', label: 'Sab', count: orders.length },
    { id: 'Pending', label: 'Pending', count: pending.length },
    { id: 'Confirmed', label: 'Confirmed', count: confirmed.length },
    { id: 'Delivered', label: 'Delivered', count: delivered.length },
  ];

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All' || o.status === activeTab;
    return matchSearch && matchTab;
  });

  const statusConfig: Record<string, { badge: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; icon: ReactNode }> = {
    Pending: { badge: 'warning', icon: <Clock size={14} /> },
    Confirmed: { badge: 'info', icon: <CheckCircle size={14} /> },
    Delivered: { badge: 'success', icon: <Truck size={14} /> },
    Cancelled: { badge: 'danger', icon: <XCircle size={14} /> },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Online Store"
        subtitle="Online orders manage karein aur delivery track karein."
        icon={<ShoppingBag size={20} />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => showToast('Store link copied!')}>
              Copy Store Link
            </Button>
            <Button size="sm" onClick={() => showToast('Store settings opened!')}>
              Store Settings
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={orders.length} subtitle="All time" icon={<ShoppingBag size={18} />} iconBg="bg-blue-50 text-blue-600" topBorder="blue" />
        <StatCard title="Pending" value={pending.length} subtitle="Need action" icon={<Clock size={18} />} iconBg="bg-amber-50 text-amber-600" topBorder="orange" />
        <StatCard title="Delivered" value={delivered.length} subtitle="Completed" icon={<Truck size={18} />} iconBg="bg-green-50 text-green-600" topBorder="green" />
        <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} subtitle="From deliveries" icon={<Package size={18} />} iconBg="bg-purple-50 text-purple-600" topBorder="purple" />
      </div>

      {/* Store Status Banner */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#252550] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Sharma Kirana — Online Store</h3>
            <p className="text-white/70 text-sm">dukandost.in/sharma-kirana · 127 products listed</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">Store Live</span>
          </div>
          <button
            onClick={() => showToast('Store opened in browser!')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-colors"
          >
            View Store →
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Order ID ya customer naam..." className="sm:w-72" />
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon={<ShoppingBag size={28} />} title="Koi Order Nahi" description="Is filter mein koi order nahi hai." />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Order ID</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Customer</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Items</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
                {filtered.map(order => {
                  const cfg = statusConfig[order.status] || { badge: 'neutral', icon: null };
                  return (
                    <tr key={order.id} className="hover:bg-orange-50/20 transition-colors block md:table-row">
                      {/* Mobile */}
                      <td className="p-4 md:hidden block w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{order.id}</p>
                            <p className="text-xs text-slate-500">{order.date} · {order.time}</p>
                          </div>
                          <Badge status={cfg.badge}>{order.status}</Badge>
                        </div>
                        <p className="font-semibold text-slate-800">{order.customer}</p>
                        <p className="text-xs text-slate-500">{order.phone}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-slate-500">{order.items}</span>
                          <span className="font-mono font-bold text-slate-900">₹{order.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {order.status === 'Pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Confirmed')} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">Confirm</button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="flex-1 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold">Mark Delivered</button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Confirmed') && (
                            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="flex-1 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-bold">Cancel</button>
                          )}
                        </div>
                      </td>

                      {/* Desktop */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm font-bold text-slate-900">{order.id}</p>
                        <p className="text-[11px] text-slate-500">{order.date}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm font-semibold text-slate-900">{order.customer}</p>
                        <p className="text-xs text-slate-500">{order.phone}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-600">{order.items}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">₹{order.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-center">
                        <Badge status={cfg.badge}>{order.status}</Badge>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-right">
                        <div className="flex justify-end gap-1">
                          {order.status === 'Pending' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Confirmed')} className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                              Confirm
                            </button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="px-2.5 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                              Delivered
                            </button>
                          )}
                          {(order.status === 'Pending' || order.status === 'Confirmed') && (
                            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
