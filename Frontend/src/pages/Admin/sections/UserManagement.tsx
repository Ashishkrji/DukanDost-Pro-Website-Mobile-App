import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from '@/components/ui';
import { 
  Search, Filter, Shield, Edit3, 
  Trash2, Mail, Phone, ChevronLeft, 
  ChevronRight, Download, CheckCircle2,
  AlertCircle, X, User, Briefcase, 
  ShieldAlert, UserX
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const { adminToken } = useAdminAuthStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal States
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [upgradeUser, setUpgradeUser] = useState<any>(null);
  const [upgradeData, setUpgradeData] = useState({ plan: 'Pro', durationMonths: 1 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (adminToken) {
      fetchUsers();
    }
  }, [search, filterPlan, adminToken]);

  const fetchUsers = async () => {
    if (!adminToken) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users?search=${search}&plan=${filterPlan}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${editUser._id}`,
        editUser,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) {
        setUsers(users.map(u => u._id === editUser._id ? data.user : u));
        setEditUser(null);
        showToast('User updated successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${deleteId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) {
        setUsers(users.filter(u => u._id !== deleteId));
        setDeleteId(null);
        showToast('User deleted successfully', 'success');
      }
    } catch (err) {
      showToast('Deletion failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/manual-upgrade`,
        {
          userId: upgradeUser._id,
          plan: upgradeData.plan,
          durationMonths: Number(upgradeData.durationMonths)
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (data.success) {
        setUsers(users.map(u => u._id === upgradeUser._id ? { ...u, plan: upgradeData.plan } : u));
        setUpgradeUser(null);
        showToast('Plan upgraded successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Upgrade failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn(
          "fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300",
          toast.type === 'success' ? "bg-[#0A0B1A] text-white" : "bg-red-600 text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-green-400" /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Merchant Repository</h2>
          <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Manage and monitor all business entities</p>
        </div>
        <Button icon={<Download size={16} />} className="rounded-2xl h-12 shadow-lg shadow-slate-200/50">Export User Base</Button>
      </div>

      <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-white">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or shop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/20 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl focus:ring-2 ring-orange-500/20"
            >
              <option value="all">All Plans</option>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchant & Enterprise</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Communication</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subscription</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Onboarding</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base transition-all group-hover:shadow-lg",
                        u.plan === 'Business' ? "bg-[#0A0B1A] text-white" : "bg-orange-100 text-[#FF6B00]"
                      )}>
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-[#FF6B00] transition-colors">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{u.businessName || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail size={12} className="text-slate-300" /> {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Phone size={12} className="text-slate-300" /> {u.phone || 'No Phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <Badge status={u.plan === 'Business' ? 'success' : u.plan === 'Pro' ? 'warning' : 'info'} className="font-bold uppercase text-[10px] tracking-widest">
                        {u.plan}
                      </Badge>
                      <Badge status={u.status === 'active' ? 'success' : 'danger'} className="font-bold uppercase text-[9px] tracking-widest px-2 py-0.5 w-fit">
                        {u.status || 'active'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-900">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Certified</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => setEditUser(u)}
                        title="Edit Merchant"
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        onClick={() => {
                          setUpgradeUser(u);
                          setUpgradeData({ plan: u.plan === 'Starter' ? 'Pro' : 'Business', durationMonths: 1 });
                        }}
                        title="Change Plan"
                        className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      >
                        <Shield size={15} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(u._id)}
                        title="Delete Merchant"
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchants in view: {users.length}</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><ChevronLeft size={18} /></button>
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
      </Card>

      {/* EDIT MODAL */}
      <Modal 
        isOpen={!!editUser} 
        onClose={() => setEditUser(null)} 
        title="Modify Merchant"
        subtitle="Update entity details and roles"
      >
        {editUser && (
          <form onSubmit={handleUpdateUser} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Identity</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={editUser.fullName}
                    onChange={(e) => setEditUser({...editUser, fullName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  />
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={editUser.email}
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Enterprise Name</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={editUser.businessName || ''}
                    onChange={(e) => setEditUser({...editUser, businessName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Link</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={editUser.phone || ''}
                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subscription Plan</label>
                <select 
                  value={editUser.plan}
                  onChange={(e) => setEditUser({...editUser, plan: e.target.value})}
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 appearance-none"
                >
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Account Standing</label>
                <select 
                  value={editUser.status || 'active'}
                  onChange={(e) => setEditUser({...editUser, status: e.target.value})}
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 appearance-none"
                >
                  <option value="active">Active Service</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={submitting} className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest">Commit Changes</Button>
              <Button type="button" variant="secondary" onClick={() => setEditUser(null)} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest">Cancel</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* UPGRADE PLAN MODAL */}
      <Modal 
        isOpen={!!upgradeUser} 
        onClose={() => setUpgradeUser(null)} 
        title="Upgrade Merchant Plan"
        subtitle={`Modify subscription for ${upgradeUser?.fullName}`}
      >
        {upgradeUser && (
          <form onSubmit={handleManualUpgrade} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Subscription Plan</label>
                <select 
                  value={upgradeData.plan}
                  onChange={(e) => setUpgradeData({...upgradeData, plan: e.target.value})}
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 appearance-none"
                >
                  <option value="Starter">Starter (Free)</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Duration (Months)</label>
                <input 
                  type="number" 
                  min="1"
                  max="120"
                  value={upgradeData.durationMonths}
                  onChange={(e) => setUpgradeData({...upgradeData, durationMonths: Number(e.target.value)})}
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={submitting} className="flex-1 bg-green-600 hover:bg-green-700 rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-green-500/20">Upgrade Plan</Button>
              <Button type="button" variant="secondary" onClick={() => setUpgradeUser(null)} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest">Cancel</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        title="Confirm Termination"
        subtitle="Irreversible security action"
      >
        <div className="py-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10 animate-bounce">
            <UserX size={40} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-900">Are you absolutely sure?</h4>
            <p className="text-sm text-slate-500 font-medium px-8 leading-relaxed">
              This will permanently remove the merchant from the platform. 
              All associated data, ledgers, and transactions will be archived and inaccessible.
            </p>
          </div>
          <div className="flex gap-3 px-4">
            <Button onClick={handleDeleteUser} loading={submitting} className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-red-500/20">Delete Merchant</Button>
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest">Abandon Action</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
