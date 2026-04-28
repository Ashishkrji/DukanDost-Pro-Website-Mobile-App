import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { 
  MessageSquare, Sparkles, Phone, Mail, 
  Clock, CheckCircle2, XCircle, ChevronRight,
  ExternalLink, User, Store, Calendar
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function BusinessRequests() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { adminToken } = useAdminAuthStore();

  useEffect(() => {
    fetchInquiries();
  }, [adminToken]);

  const fetchInquiries = async () => {
    if (!adminToken) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/inquiries`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) setInquiries(data.inquiries);
    } catch (err) {
      console.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/inquiries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchInquiries();
    } catch (err) {
      console.error('Update failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Business Plan Inquiries
            <Badge status="warning" className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white border-none">
              {inquiries.filter(i => i.status === 'pending').length} New
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">High-value enterprise leads awaiting WhatsApp follow-up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {inquiries.length > 0 ? inquiries.map((item) => (
          <Card key={item._id} className="p-0 overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all">
            <div className="flex flex-col lg:flex-row">
              {/* Lead Info */}
              <div className="p-8 lg:w-1/3 bg-slate-900 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                    {(item.ownerName || item.userId?.fullName || 'B')?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black leading-none">{item.ownerName || item.userId?.fullName || 'Business Owner'}</h3>
                    <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mt-1.5">{item.shopName || item.userId?.businessName || 'DukanDost Partner'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Mail size={14} className="text-slate-500" /> {item.email || item.userId?.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Phone size={14} className="text-slate-500" /> {item.contactNumber || item.userId?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Calendar size={14} className="text-slate-500" /> Requested: {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex-1 p-8 bg-white flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge status={item.status === 'pending' ? 'warning' : item.status === 'contacted' ? 'info' : 'success'} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {item.status}
                    </Badge>
                    <p className="text-slate-700 text-sm font-bold mt-4 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      "{item.query || 'I want to upgrade to the Business Plan for DukanDost Pro. Please share details for onboarding.'}"
                    </p>
                  </div>
                  <Button 
                    variant="whatsapp" 
                    onClick={() => {
                      const phone = (item.contactNumber || item.userId?.phone || '').replace(/[^0-9]/g, '');
                      const finalPhone = phone.length === 10 ? `91${phone}` : phone;
                      const msg = encodeURIComponent(`Hello ${item.ownerName || 'Business Owner'},\n\nThis is DukanDost Pro Admin regarding your Business Plan inquiry for ${item.shopName || 'your shop'}.\n\nHow can we assist you today?`);
                      window.open(`https://wa.me/${finalPhone}?text=${msg}`, '_blank');
                    }} 
                    className="rounded-xl px-6 shadow-sm"
                  >
                    WhatsApp Chat <ExternalLink size={14} className="ml-2" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => handleStatusChange(item._id, 'contacted')}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all"
                  >
                    Mark Contacted
                  </button>
                  <button 
                    onClick={() => handleStatusChange(item._id, 'converted')}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all"
                  >
                    Mark Converted
                  </button>
                  <button 
                    onClick={() => handleStatusChange(item._id, 'rejected')}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all"
                  >
                    Mark Rejected
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending business inquiries</p>
          </div>
        )}
      </div>
    </div>
  );
}
