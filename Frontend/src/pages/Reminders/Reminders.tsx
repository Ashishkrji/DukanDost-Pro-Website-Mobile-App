import React, { useState, useEffect } from 'react';
import { 
  Bell, Clock, CheckCircle2, AlertCircle, Plus, 
  Search, Filter, Send, Pause, Play, Trash2, 
  Calendar, Phone, User, MessageSquare, History,
  Sparkles, ShieldCheck, ArrowRight, Wallet
} from 'lucide-react';
import { Card, Badge, Button, InputField, SelectField, PageHeader, Modal } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function Reminders() {
  const { user, token } = useAuthStore();
  const { customers, showToast } = useStore();
  
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    mobileNumber: '',
    pendingAmount: 0,
    invoiceNumber: '',
    reminderType: 'Payment Due Reminder',
    sendAfterDays: 3,
    repeatFrequency: 'One Time',
    preferredTime: '10:00 AM',
    messageTemplate: '',
    stopCondition: 'Until payment received'
  });

  const isBusinessPlan = user?.plan === 'Business';

  useEffect(() => {
    if (!isBusinessPlan && !loading) {
      setShowUpgradeModal(true);
    }
    fetchReminders();
  }, [isBusinessPlan]);

  const fetchReminders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reminders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setReminders(data.reminders);
    } catch (err) {
      console.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (id: string) => {
    const customer = customers.find(c => (c.id === id || c._id === id));
    if (customer) {
      setFormData({
        ...formData,
        customerId: id,
        customerName: customer.name,
        mobileNumber: customer.phone,
        pendingAmount: customer.balance,
        messageTemplate: `Hello ${customer.name},\n\nThis is a friendly reminder regarding your pending payment of ₹${customer.balance} for Invoice #INV-123.\n\nPlease complete the payment at your earliest convenience.\n\nThank you,\n${user?.businessName || 'DukanDost Partner'}`
      });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBusinessPlan) {
      setShowUpgradeModal(true);
      return;
    }
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reminders/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        showToast('Auto reminder scheduled successfully!', 'success');
        setShowCreateModal(false);
        fetchReminders();
      }
    } catch (err) {
      showToast('Failed to schedule reminder', 'error');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reminders/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReminders();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleSendNow = async (id: string) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reminders/send-now/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        showToast('Reminder sent manually!', 'success');
        fetchReminders();
      }
    } catch (err) {
      showToast('Manual send failed', 'error');
    }
  };

  const stats = [
    { label: 'Active Reminders', value: reminders.filter(r => r.isActive).length, icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Sent Successfully', value: reminders.reduce((acc, r) => acc + (r.history?.length || 0), 0), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pending Follow-ups', value: reminders.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Failed Alerts', value: 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <PageHeader 
        title="WhatsApp Auto Reminders" 
        subtitle="Automate your payment collection with smart WhatsApp triggers"
        icon={<Sparkles size={24} className="text-[#FF6B00]" />}
        action={
          <Button 
            onClick={() => isBusinessPlan ? setShowCreateModal(true) : setShowUpgradeModal(true)}
            className="bg-[#FF6B00] hover:bg-[#E56000] rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs"
            icon={<Plus size={18} />}
          >
            Create New Auto-Reminder
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
              <Badge status="neutral" className="bg-slate-50 text-slate-400 border-none font-black text-[10px]">Real-time</Badge>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reminders Table */}
        <Card className="lg:col-span-2 p-0 overflow-hidden border-none shadow-xl">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Collection Schedules</h3>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <Filter size={18} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <Search size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Run</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reminders.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shadow-sm">
                          {r.customerName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{r.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{r.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-sm text-slate-700">₹{r.pendingAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar size={12} className="text-orange-500" />
                        {new Date(r.nextReminderDate).toLocaleDateString()}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium ml-5">{r.preferredTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={r.isActive ? 'success' : 'neutral'} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {r.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleSendNow(r._id)}
                          title="Send Now"
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                        >
                          <Send size={14} />
                        </button>
                        <button 
                          onClick={() => handleToggle(r._id)}
                          title={r.isActive ? "Pause" : "Resume"}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          {r.isActive ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reminders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <MessageSquare size={64} />
                        <p className="text-sm font-black uppercase tracking-widest mt-4">No active schedules</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* History Column */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-xl bg-[#0A0B1A] text-white overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <History size={20} className="text-orange-500" />
                  Recent History
                </h3>
              </div>
              <div className="space-y-6">
                {reminders.flatMap(r => r.history || []).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()).slice(0, 5).map((h, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-1 h-auto bg-slate-800 rounded-full group-hover:bg-orange-500 transition-colors" />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{new Date(h.sentAt).toLocaleString()}</p>
                      <p className="text-sm font-bold text-slate-300 line-clamp-2">{h.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] px-2 py-0.5">Delivered</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <ShieldCheck size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
          </Card>

          <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <h3 className="text-xl font-black leading-tight mb-2">Need Custom Templates?</h3>
            <p className="text-white/80 text-sm font-medium mb-6">Our team can help you design professional collection templates for your brand.</p>
            <Button variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-orange-600">
              Contact Expert
            </Button>
          </Card>
        </div>
      </div>

      {/* Create Modal */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create Auto Reminder"
        subtitle="Set up a recurring collection schedule for your customer"
        size="xl"
      >
        <form onSubmit={handleCreate} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField 
              label="Select Customer"
              required
              options={customers.map(c => ({ value: c._id || c.id || '', label: c.name }))}
              value={formData.customerId}
              onChange={e => handleCustomerSelect(e.target.value)}
            />
            <InputField 
              label="Mobile Number"
              disabled
              value={formData.mobileNumber}
              icon={<Phone size={16} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField 
              label="Pending Amount (₹)"
              type="number"
              disabled
              value={formData.pendingAmount}
              icon={<Wallet size={16} />}
            />
            <InputField 
              label="Invoice Number"
              placeholder="e.g. INV-2024-001"
              value={formData.invoiceNumber}
              onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
            />
            <SelectField 
              label="Reminder Type"
              options={[
                { value: 'Payment Due Reminder', label: 'Payment Due' },
                { value: 'Overdue Payment Reminder', label: 'Overdue Alert' },
                { value: 'Monthly Collection Reminder', label: 'Monthly Collection' },
                { value: 'Invoice Reminder', label: 'New Invoice' },
                { value: 'Follow-up Reminder', label: 'General Follow-up' }
              ]}
              value={formData.reminderType}
              onChange={e => setFormData({...formData, reminderType: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField 
              label="Send After"
              options={[
                { value: '1', label: '1 Day' },
                { value: '3', label: '3 Days' },
                { value: '7', label: '7 Days' },
                { value: '15', label: '15 Days' },
                { value: '30', label: '30 Days' }
              ]}
              value={formData.sendAfterDays.toString()}
              onChange={e => setFormData({...formData, sendAfterDays: parseInt(e.target.value)})}
            />
            <SelectField 
              label="Repeat Frequency"
              options={[
                { value: 'One Time', label: 'One Time Only' },
                { value: 'Daily', label: 'Every Day' },
                { value: 'Weekly', label: 'Every Week' },
                { value: 'Monthly', label: 'Every Month' }
              ]}
              value={formData.repeatFrequency}
              onChange={e => setFormData({...formData, repeatFrequency: e.target.value})}
            />
            <SelectField 
              label="Preferred Time"
              options={[
                { value: '10:00 AM', label: '10:00 AM (Morning)' },
                { value: '02:00 PM', label: '02:00 PM (Afternoon)' },
                { value: '06:00 PM', label: '06:00 PM (Evening)' },
                { value: '08:00 PM', label: '08:00 PM (Night)' }
              ]}
              value={formData.preferredTime}
              onChange={e => setFormData({...formData, preferredTime: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex justify-between">
              Message Template
              <span className="text-[10px] text-orange-500 font-black uppercase">Dynamic Preview</span>
            </label>
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none min-h-[120px]"
              value={formData.messageTemplate}
              onChange={e => setFormData({...formData, messageTemplate: e.target.value})}
              placeholder="Write your WhatsApp message here..."
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Supports: {"{{CustomerName}}"}, {"{{Amount}}"}, {"{{InvoiceNumber}}"}, {"{{BusinessName}}"}
            </p>
          </div>

          <Button type="submit" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20">
            Activate Collection Automation
          </Button>
        </form>
      </Modal>

      {/* Upgrade Lock Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          // Optional: redirect to dashboard
        }}
        title="Upgrade to Business Plan"
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-orange-100 text-[#FF6B00] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/10">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">Unlock WhatsApp Automation</h3>
          <p className="text-slate-500 font-medium mt-3 leading-relaxed">
            Automatic payment reminders and collection schedules are available exclusively on the <span className="text-orange-600 font-black">Business Plan</span>.
          </p>
          
          <div className="mt-8 space-y-3">
            <Button 
              onClick={() => window.location.href = '/subscription'}
              className="w-full h-14 bg-[#FF6B00] text-white rounded-2xl font-black uppercase tracking-widest text-xs"
              iconRight={<ArrowRight size={16} />}
            >
              Upgrade to Business Plan
            </Button>
            <Button 
              variant="secondary"
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2"
              onClick={() => window.open('https://wa.me/919999999999', '_blank')}
            >
              Contact Admin on WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
