import React, { useState, useEffect } from 'react';
import { 
  Send, Users, Calendar, BarChart, 
  Plus, Search, Filter, Trash2, 
  Sparkles, MessageCircle, ArrowRight,
  Clock, CheckCircle2, AlertCircle, Play
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { 
  Button, Card, Badge, PageHeader, 
  StatCard, EmptyState, Modal, InputField, SelectField 
} from '@/components/ui';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function Campaigns() {
  const { token, user } = useAuthStore();
  const { customers, showToast } = useStore();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audienceType: 'All Customers'
  });

  const isBusinessPlan = user?.plan === 'Business';

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setCampaigns(data.campaigns);
    } catch (err) {
      console.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBusinessPlan) {
      showToast('Broadcast is a Business Plan feature.', 'error');
      return;
    }

    try {
      const { data } = await axios.post(
        `${(import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        showToast('Campaign created successfully!', 'success');
        setShowCreateModal(false);
        fetchCampaigns();
      }
    } catch (err) {
      showToast('Failed to create campaign', 'error');
    }
  };

  const handleSend = async (id: string) => {
    setIsSending(true);
    try {
      const { data } = await axios.post(
        `${(import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/${id}/send`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        showToast(`Campaign sent to ${data.summary.sent} customers!`, 'success');
        fetchCampaigns();
      }
    } catch (err) {
      showToast('Failed to send broadcast', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, icon: BarChart, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Messages Sent', value: campaigns.reduce((acc: number, c: any) => acc + (c.recipientCount || 0), 0), icon: Send, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Active Drafts', value: campaigns.filter((c: any) => c.status === 'Draft').length, icon: MessageCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Audience Reach', value: customers.length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-[pageIn_0.3s_ease]">
      <PageHeader 
        title="WhatsApp Marketing" 
        subtitle="Grow your business with powerful broadcast campaigns."
        icon={<Sparkles size={24} className="text-[#FF6B00]" />}
        action={
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FF6B00] hover:bg-[#E56000] rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20"
            icon={<Plus size={18} />}
          >
            Create New Campaign
          </Button>
        }
      />

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <Badge status="neutral" className="bg-slate-50 text-slate-400 border-none font-black text-[10px]">LATEST</Badge>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaigns List */}
        <Card className="lg:col-span-2 p-0 overflow-hidden border-none shadow-xl">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Campaign History</h3>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Recipients</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaigns.map((c: any) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1 mt-1">
                           <Clock size={10} /> {new Date(c.createdAt).toLocaleDateString()} • {c.audienceType}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-sm text-slate-700">
                      {c.recipientCount || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge 
                        status={c.status === 'Completed' ? 'success' : c.status === 'Sending' ? 'warning' : 'neutral'} 
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === 'Draft' ? (
                        <Button 
                          onClick={() => handleSend(c._id)}
                          loading={isSending}
                          variant="secondary" 
                          size="sm" 
                          className="rounded-xl border-2" 
                          icon={<Send size={14} />}
                        >
                          Send Now
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-2 text-slate-400">
                           <CheckCircle2 size={18} className="text-green-500" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                       <EmptyState 
                          icon={<MessageCircle size={40} className="text-slate-200" />}
                          title="No Campaigns Yet"
                          description="Create your first WhatsApp marketing campaign to reach out to your customers."
                       />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tips & Guidance */}
        <div className="space-y-6">
          <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden relative">
             <div className="relative z-10">
                <h3 className="text-xl font-black leading-tight mb-4 flex items-center gap-2">
                   <Sparkles size={24} className="text-yellow-400" /> 
                   Marketing Tips
                </h3>
                <ul className="space-y-4">
                   <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                      <p className="text-sm font-medium text-indigo-50">Mornings (10 AM) are best for sending offers.</p>
                   </li>
                   <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                      <p className="text-sm font-medium text-indigo-50">Use personalized greetings like "Hello Customer Name".</p>
                   </li>
                   <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                      <p className="text-sm font-medium text-indigo-50">Keep messages short and include a clear Call-to-Action.</p>
                   </li>
                </ul>
                <Button className="w-full mt-8 h-12 rounded-2xl bg-white text-indigo-900 hover:bg-white/90 font-black uppercase tracking-widest text-xs border-none">
                   Learn More
                </Button>
             </div>
             <MessageCircle size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
          </Card>

          <Card className="p-6 border-none shadow-xl bg-slate-50 border border-slate-100">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">API Settings</h3>
             <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                <div className={cn("w-3 h-3 rounded-full animate-pulse", isBusinessPlan ? "bg-green-500" : "bg-red-500")} />
                <p className="text-xs font-bold text-slate-600">
                   WhatsApp Business Status: <span className={isBusinessPlan ? "text-green-600" : "text-red-600"}>{isBusinessPlan ? 'Connected' : 'Disconnected'}</span>
                </p>
             </div>
             {!isBusinessPlan && (
               <p className="text-[10px] text-slate-400 mt-3 font-medium">
                  Broadcasting is only available for Business Plan users with a verified WhatsApp API.
               </p>
             )}
          </Card>
        </div>
      </div>

      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="New Marketing Campaign"
        subtitle="Compose your message and select your target audience"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6 py-4">
          <InputField 
            label="Campaign Title"
            placeholder="e.g. Diwali Dhamaka Sale 2024"
            required
            value={formData.title}
            onChange={(e: any) => setFormData({...formData, title: e.target.value})}
          />

          <SelectField 
            label="Target Audience"
            options={[
              { value: 'All Customers', label: 'All Registered Customers' },
              { value: 'Overdue Only', label: 'Customers with Pending Balance' },
              { value: 'Top Customers', label: 'Top 10 High-Value Customers' }
            ]}
            value={formData.audienceType}
            onChange={(e: any) => setFormData({...formData, audienceType: e.target.value})}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex justify-between">
              Message Content
              <span className="text-[10px] text-indigo-500 font-black uppercase">Direct Broadcast</span>
            </label>
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none min-h-[160px]"
              value={formData.message}
              onChange={(e: any) => setFormData({...formData, message: e.target.value})}
              placeholder="Enter your WhatsApp marketing message here..."
              required
            />
            <div className="flex items-center gap-2 mt-2">
               <AlertCircle size={12} className="text-slate-400" />
               <p className="text-[10px] text-slate-400 font-medium italic">
                 Direct messages require the customer to have contacted you in the last 24h. Use Templates for proactive reaching.
               </p>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20">
            Create Campaign Draft
          </Button>
        </form>
      </Modal>
    </div>
  );
}
