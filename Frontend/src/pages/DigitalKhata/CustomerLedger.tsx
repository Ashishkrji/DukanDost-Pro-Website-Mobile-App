import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Phone, PlusCircle, TrendingUp, TrendingDown,
  Calendar, Shield, Send, Download, Printer, CheckCircle, Clock, BookOpen,
  MoreVertical, Search, Filter, CreditCard, Banknote, QrCode, Laptop, Share2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  Button, Badge, Card, PageHeader, SearchInput, Modal, 
  InputField, EmptyState, Tabs, SelectField 
} from '@/components/ui';
import * as api from '@/services/api';

export default function CustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const { showToast } = useStore();

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  // New Entry State (M11)
  const [newEntry, setNewEntry] = useState({
    transactionType: 'Udhaar Diya',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    shareOnWhatsApp: true // M11
  });

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [custRes, entryRes] = await Promise.all([api.getCustomerById(id), api.getLedgerEntries(id)]);
      if (custRes.success) setCustomer(custRes.customer);
      if (entryRes.success) setEntries(entryRes.entries);
    } catch { showToast('Data load error', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddEntry = async () => {
    if (!newEntry.amount || Number(newEntry.amount) <= 0) { showToast('Valid amount!', 'error'); return; }
    try {
      const res = await api.createLedgerEntry({ customerId: id, ...newEntry });
      if (res.success) {
        showToast('Entry save ho gayi!');
        setShowAddTxModal(false);
        if (newEntry.shareOnWhatsApp) {
           const message = `Namaste ${customer.name}, aapka DukanDost balance update ho gaya hai. Naya balance ₹${res.entry.balanceAfterEntry} hai.`;
           window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
        }
        setNewEntry({ transactionType: 'Udhaar Diya', amount: '', paymentMethod: 'Cash', notes: '', date: new Date().toISOString().split('T')[0], shareOnWhatsApp: true });
        fetchData();
      }
    } catch { showToast('Save failed', 'error'); }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (!customer) return <div className="p-8 text-center">Not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title={customer.name}
        subtitle="Ledger & Transaction History"
        icon={<BookOpen size={20} className="text-orange-500" />}
        action={<Button icon={<PlusCircle size={18} />} onClick={() => setShowAddTxModal(true)}>Add Entry</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-red-500 bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Udhaar</p>
          <h3 className="text-2xl font-black text-slate-900 font-mono">₹{customer.totalCredit?.toLocaleString('en-IN') || 0}</h3>
        </Card>
        <Card className="p-5 border-l-4 border-l-green-500 bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Received</p>
          <h3 className="text-2xl font-black text-slate-900 font-mono">₹{customer.totalReceived?.toLocaleString('en-IN') || 0}</h3>
        </Card>
        <Card className={cn("p-5 border-none shadow-lg text-white", customer.remainingBalance > 0 ? "bg-red-500" : "bg-green-500")}>
          <p className="text-xs font-bold uppercase opacity-80">Net Balance</p>
          <h3 className="text-2xl font-black font-mono">₹{Math.abs(customer.remainingBalance || 0).toLocaleString('en-IN')}</h3>
          <p className="text-[10px] font-bold uppercase">{customer.remainingBalance > 0 ? 'Dena Hai' : 'Jama Hai'}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
           <h2 className="font-bold flex items-center gap-2"><Clock size={18} /> Recent History</h2>
           <div className="flex gap-2">
             <Button variant="secondary" size="sm" icon={<Download size={14} />}>PDF</Button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-left">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-left">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                     <Badge status={entry.transactionType === 'Udhaar Diya' ? 'danger' : 'success'}>{entry.transactionType}</Badge>
                  </td>
                  <td className={cn("px-6 py-4 text-right font-bold", entry.transactionType === 'Udhaar Diya' ? 'text-red-600' : 'text-green-600')}>
                    {entry.transactionType === 'Udhaar Diya' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">₹{entry.balanceAfterEntry.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAddTxModal} onClose={() => setShowAddTxModal(false)} title="New Ledger Entry">
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => setNewEntry({...newEntry, transactionType: 'Udhaar Diya'})} className={cn("py-4 rounded-xl text-xs font-bold uppercase border-2", newEntry.transactionType === 'Udhaar Diya' ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-400")}>Udhaar Diya</button>
               <button onClick={() => setNewEntry({...newEntry, transactionType: 'Payment Mila'})} className={cn("py-4 rounded-xl text-xs font-bold uppercase border-2", newEntry.transactionType === 'Payment Mila' ? "bg-green-500 text-white border-green-500" : "bg-white text-slate-400")}>Payment Mila</button>
            </div>
            <InputField label="Amount (₹)" type="number" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: e.target.value})} />
            <InputField label="Notes" value={newEntry.notes} onChange={e => setNewEntry({...newEntry, notes: e.target.value})} />
            
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
               <MessageCircle className="text-orange-600" />
               <div className="flex-1">
                 <p className="text-xs font-bold text-slate-900">Share balance on WhatsApp?</p>
                 <p className="text-[10px] text-slate-500">Customer ko naya balance message jaye.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={newEntry.shareOnWhatsApp} onChange={e => setNewEntry({...newEntry, shareOnWhatsApp: e.target.checked})} />
                 <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
               </label>
            </div>
            
            <Button onClick={handleAddEntry} className="w-full h-12">Save Entry</Button>
         </div>
      </Modal>
    </div>
  );
}
