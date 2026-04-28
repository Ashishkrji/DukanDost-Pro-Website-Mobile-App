import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { 
  Bell, Send, Users, User, Trash2, 
  AlertCircle, CheckCircle2, Info, Sparkles,
  Search, Filter, Plus
} from 'lucide-react';
import axios from 'axios';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useStore } from '@/store/useStore';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { adminToken } = useAdminAuthStore();
  const { showToast } = useStore();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipient: '' // Empty for all
  });

  useEffect(() => {
    fetchNotifications();
  }, [adminToken]);

  const fetchNotifications = async () => {
    if (!adminToken) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/notifications`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/notifications`, formData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) {
        showToast('Notification sent successfully', 'success');
        setShowModal(false);
        setFormData({ title: '', message: '', type: 'info', recipient: '' });
        fetchNotifications();
      }
    } catch (err) {
      showToast('Failed to send notification', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Notification Center
            <Badge status="info" className="bg-blue-500 text-white border-none px-3 py-1 rounded-full text-[10px] uppercase font-black">
              System Wide
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Broadcast messages to all merchants or specific users</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B00] hover:bg-[#E56000] text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20"
          icon={<Plus size={18} />}
        >
          Send New Broadcast
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card key={notif._id} className="p-6 border-none shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex gap-6 items-start relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  notif.type === 'info' ? "bg-blue-50 text-blue-600" :
                  notif.type === 'warning' ? "bg-orange-50 text-orange-600" :
                  notif.type === 'urgent' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                )}>
                  {notif.type === 'info' ? <Info size={24} /> :
                   notif.type === 'warning' ? <AlertCircle size={24} /> :
                   notif.type === 'urgent' ? <Sparkles size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{notif.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border-none mb-2">
                        {notif.recipient ? 'Targeted' : 'All Users'}
                      </Badge>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Users size={14} />
                      Read by {notif.readBy?.length || 0} users
                    </div>
                    {notif.recipient && (
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                        <User size={14} />
                        Specific User Target
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No broadcast history found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Create New Broadcast</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Send real-time alerts to merchants</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notification Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                  placeholder="e.g. System Maintenance Update"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message Body</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold resize-none" 
                  placeholder="Describe the update or alert..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent Alert</option>
                    <option value="success">Success Story</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recipient ID (Optional)</label>
                  <input 
                    value={formData.recipient}
                    onChange={e => setFormData({...formData, recipient: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                    placeholder="All Users if empty"
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-16 bg-[#0A0B1A] hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                icon={<Send size={18} />}
              >
                Send Notification Now
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
