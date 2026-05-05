import React, { useState, useEffect } from 'react';
import {
  PlusCircle, MessageCircle, Phone, ArrowUpRight, ArrowDownRight,
  Search, Download, Send, X, BookOpen, MoreVertical, TrendingUp, TrendingDown,
  Clock, Shield, UserPlus, Filter, CheckSquare, Square, Upload
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Badge, Card, PageHeader, SearchInput, Modal, 
  InputField, EmptyState, Tabs, SelectField 
} from '@/components/ui';
import * as api from '@/services/api';
import { useLanguageStore } from '@/store/languageStore';

export default function DigitalKhata() {
  const { user: authUser } = useAuthStore();
  const { showToast } = useStore();
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getKhataCustomers({ search: searchTerm, status: activeTab });
      if (res.success) setCustomers(res.customers);
    } catch { showToast('Data error', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [searchTerm, activeTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title={t('khata')}
        subtitle="ग्राहकों के क्रेडिट और पेमेंट रिमाइंडर मैनेज करें।"
        icon={<BookOpen size={20} className="text-orange-500" />}
        action={
          <div className="flex gap-2">
            {!isSelectionMode ? (
              <>
                <Button variant="secondary" icon={<Upload size={18} />} onClick={() => setShowImportModal(true)}>{t('import')}</Button>
                <Button variant="secondary" icon={<MessageCircle size={18} />} onClick={() => setIsSelectionMode(true)}>{t('bulkRemind')}</Button>
                <Button icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>{t('nayaGrahak')}</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}>Cancel</Button>
                <Button icon={<Send size={18} />} onClick={() => {}}>Send ({selectedIds.length})</Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer._id} className={cn("p-5 cursor-pointer relative", selectedIds.includes(customer._id) && "ring-2 ring-orange-500")} onClick={() => navigate(`/dashboard/digital-khata/${customer._id}`)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">{customer.name.charAt(0)}</div>
              <div><h3 className="font-bold text-sm">{customer.name}</h3><p className="text-[10px] text-slate-500">{customer.phone}</p></div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('balance')}</span>
               <span className={cn("font-mono font-bold", customer.remainingBalance > 0 ? "text-red-600" : "text-green-600")}>₹{Math.abs(customer.remainingBalance).toLocaleString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
