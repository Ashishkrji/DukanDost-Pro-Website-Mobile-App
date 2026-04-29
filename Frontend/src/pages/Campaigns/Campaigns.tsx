import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Plus, Users, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader, Card, Button, Modal, InputField, SelectField, Badge, EmptyState } from '@/components/ui';
import * as api from '@/services/api';
import toast from 'react-hot-toast';

export default function Campaigns() {
  const { user } = useAuthStore();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('All Customers');

  const isBusinessPlan = user?.plan === 'Business';

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      if (data.success) setCampaigns(data.campaigns);
    } catch (err) {
      toast.error('Campaigns fetch fail ho gaya');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.createCampaign({ title, message, audienceType: audience });
      if (data.success) {
        toast.success('Campaign created!');
        setShowModal(false);
        fetchCampaigns();
      }
    } catch (err) {
      toast.error('Create fail ho gaya');
    }
  };

  const handleSend = async (id: string) => {
    try {
      setLoading(true);
      const data = await api.sendCampaign(id);
      if (data.success) {
        toast.success('Broadcast sent successfully!');
        fetchCampaigns();
      }
    } catch (err) {
      toast.error('Send fail ho gaya');
    } finally {
      setLoading(false);
    }
  };

  if (!isBusinessPlan) {
    return (
      <div className="p-6">
        <PageHeader title="Marketing Campaigns" />
        <Card className="p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600">
            <Megaphone size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upgrade to Business Plan</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Bulk WhatsApp broadcasts are only available in the Business Plan. Upgrade now to reach all your customers with seasonal offers and payment reminders in one click.
          </p>
          <Button variant="primary" size="lg">Upgrade Now</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Marketing Campaigns" 
          subtitle="Send bulk WhatsApp broadcasts to your customers"
        />
        <Button onClick={() => setShowModal(true)} icon={<Plus size={18} />} variant="primary">
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.length > 0 ? campaigns.map((campaign) => (
          <Card key={campaign._id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{campaign.title}</h3>
                  <Badge status={campaign.status === 'Completed' ? 'success' : 'warning'}>
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl">{campaign.message}</p>
              </div>
              {campaign.status === 'Draft' && (
                <Button 
                  size="sm" 
                  onClick={() => handleSend(campaign._id)} 
                  loading={loading}
                  icon={<Send size={14} />}
                >
                  Send Now
                </Button>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-slate-400" />
                <span>Audience: {campaign.audienceType}</span>
              </div>
              {campaign.recipientCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>Reached: {campaign.recipientCount} customers</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        )) : (
          <EmptyState 
            icon={<Megaphone size={48} />}
            title="Koi campaign nahi hai"
            description="Apna pehla bulk broadcast banayein aur grahakon tak pahunchein."
            action={<Button onClick={() => setShowModal(true)}>Banayein</Button>}
          />
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Create New Campaign"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <InputField 
            label="Campaign Title" 
            placeholder="e.g. Diwali Offer 2024" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Message Content</label>
            <textarea 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
              rows={4}
              placeholder="Enter your WhatsApp message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <SelectField 
            label="Target Audience"
            options={[
              { value: 'All Customers', label: 'All Customers' },
              { value: 'Overdue Only', label: 'Customers with Outstanding Balance' },
              { value: 'Top Customers', label: 'Top 10 High-Value Customers' }
            ]}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
          <div className="pt-4 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">Create Campaign</Button>
            <Button type="button" onClick={() => setShowModal(false)} variant="secondary" className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
