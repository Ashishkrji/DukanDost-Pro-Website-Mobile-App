import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, PlusCircle, TrendingUp, TrendingDown,
  Calendar, Shield, Send, Download, Printer, Clock, BookOpen,
  CreditCard, MapPin, Truck
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  Button, Badge, Card, Modal, 
  InputField, EmptyState, SelectField 
} from '@/components/ui';
import * as api from '@/services/api';

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const { showToast } = useStore();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  // New Entry State
  const [newEntry, setNewEntry] = useState({
    transactionType: 'Maal Kharida',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Mocking getVendorById until routes are confirmed
      const vendorsRes = await api.getVendors();
      const currentVendor = vendorsRes.vendors?.find((v: any) => v._id === id) || vendorsRes.vendors?.find((v: any) => v.id === id);
      
      const entryRes = await api.getLedgerEntries({ vendorId: id });
      
      if (currentVendor) setVendor(currentVendor);
      if (entryRes.success) setEntries(entryRes.entries);
    } catch (error) {
      showToast('Data load karne mein dikkat aayi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddEntry = async () => {
    if (!newEntry.amount || Number(newEntry.amount) <= 0) {
      showToast('Valid amount daalen!', 'error');
      return;
    }

    try {
      const res = await api.createLedgerEntry({
        vendorId: id,
        ...newEntry
      });
      if (res.success) {
        showToast('Entry save ho gayi!');
        setShowAddTxModal(false);
        setNewEntry({
          transactionType: 'Maal Kharida',
          amount: '',
          paymentMethod: 'Cash',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchData();
      }
    } catch (error: any) {
      showToast('Entry save nahi ho payi', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Data load ho raha hai...</div>;
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 font-semibold">Vendor nahi mila.</p>
        <Button onClick={() => navigate('/vendors')} variant="secondary" className="mt-4">← Vendors List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/vendors')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-semibold transition-colors group"
      >
        <div className="p-1 group-hover:-translate-x-1 transition-transform">
          <ArrowLeft size={16} />
        </div>
        Vendors List
      </button>

      {/* Vendor Header */}
      <Card className="p-6 bg-white overflow-hidden relative border-none shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-500 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-100">
              {vendor.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-black text-slate-900">{vendor.name}</h1>
                <Badge status={vendor.balance > 0 ? "danger" : "success"}>
                  {vendor.balance > 0 ? "Dena Hai" : "Settled"}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5 font-medium"><Truck size={14} className="text-blue-500" /> {vendor.phone}</span>
                {vendor.gstNumber && <span className="flex items-center gap-1.5 font-medium"><Shield size={14} className="text-blue-500" /> {vendor.gstNumber}</span>}
                <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-blue-500" /> {vendor.address || 'No Address'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              icon={<PlusCircle size={18} />} 
              onClick={() => setShowAddTxModal(true)}
              className="flex-1 md:flex-initial shadow-lg shadow-blue-200 bg-blue-600 hover:bg-blue-700"
            >
              Add Entry
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Purchased</p>
            <p className="text-xl font-black text-slate-900 font-mono">₹{vendor.totalPurchased?.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
            <p className="text-xl font-black text-slate-900 font-mono">₹{vendor.totalPaid?.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>

        <div className={cn(
          "p-5 rounded-3xl border shadow-lg flex items-center gap-4 transition-all",
          vendor.balance > 0 
            ? "bg-red-500 border-red-500 text-white shadow-red-200" 
            : "bg-green-500 border-green-500 text-white shadow-green-200"
        )}>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Aapko Dene Hain</p>
            <p className="text-xl font-black font-mono">₹{Math.abs(vendor.balance || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px] font-bold text-white/80 uppercase">{vendor.balance > 0 ? 'Payment Pending' : 'No Dues'}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-display font-black text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Vendor Ledger Entries
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" icon={<Download size={14} />}>PDF</Button>
            <Button variant="secondary" size="sm" icon={<Printer size={14} />}>Print</Button>
          </div>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            icon={<Truck size={32} className="text-slate-200" />}
            title="Koi Transactions Nahi Hai"
            description="Abhi tak is vendor ke khate mein koi entry nahi hui hai."
            action={<Button onClick={() => setShowAddTxModal(true)} size="sm">Add First Purchase/Payment</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details / Notes</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((entry) => {
                  const isPurchase = entry.transactionType === 'Maal Kharida';
                  return (
                    <tr key={entry._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-900">{new Date(entry.date).toLocaleDateString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">{new Date(entry.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          isPurchase ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                        )}>
                          {isPurchase ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {entry.transactionType}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700 font-medium">{entry.notes || '—'}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <CreditCard size={10} /> {entry.paymentMethod}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className={cn(
                          "font-mono font-black text-base",
                          isPurchase ? "text-blue-600" : "text-green-600"
                        )}>
                          {isPurchase ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="font-mono font-bold text-slate-900 text-sm">
                          ₹{entry.balanceAfterEntry?.toLocaleString('en-IN')}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddTxModal}
        onClose={() => setShowAddTxModal(false)}
        title="Vendor Entry"
        subtitle={`Recording transaction for ${vendor.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddTxModal(false)}>Cancel</Button>
            <Button onClick={handleAddEntry} className="bg-blue-600 hover:bg-blue-700" icon={<PlusCircle size={15} />}>Save Entry</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Transaction Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNewEntry({ ...newEntry, transactionType: 'Maal Kharida' })}
                className={cn(
                  "py-4 rounded-2xl text-sm font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-2",
                  newEntry.transactionType === 'Maal Kharida'
                    ? "bg-blue-500 text-white border-blue-500 shadow-xl shadow-blue-100"
                    : "bg-white text-slate-400 border-slate-100 hover:border-blue-200"
                )}
              >
                <TrendingUp size={20} />
                Maal Kharida
              </button>
              <button
                onClick={() => setNewEntry({ ...newEntry, transactionType: 'Payment Diya' })}
                className={cn(
                  "py-4 rounded-2xl text-sm font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-2",
                  newEntry.transactionType === 'Payment Diya'
                    ? "bg-green-500 text-white border-green-500 shadow-xl shadow-green-100"
                    : "bg-white text-slate-400 border-slate-100 hover:border-green-200"
                )}
              >
                <TrendingDown size={20} />
                Payment Diya
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Amount (₹)"
              placeholder="0.00"
              type="number"
              required
              value={newEntry.amount}
              onChange={e => setNewEntry({ ...newEntry, amount: e.target.value })}
            />
            <InputField
              label="Transaction Date"
              type="date"
              value={newEntry.date}
              onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
            />
          </div>

          <SelectField
            label="Payment Method"
            value={newEntry.paymentMethod}
            onChange={e => setNewEntry({ ...newEntry, paymentMethod: e.target.value })}
            options={[
              { value: 'Cash', label: 'Cash' },
              { value: 'UPI', label: 'UPI' },
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Other', label: 'Other' },
            ]}
          />

          <InputField
            label="Notes / Bill No."
            placeholder="e.g. Invoice #123, Milk supply, etc."
            value={newEntry.notes}
            onChange={e => setNewEntry({ ...newEntry, notes: e.target.value })}
          />

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center mt-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">New Balance After Entry</span>
            <span className={cn(
              "font-mono font-black text-lg",
              (vendor.balance + (newEntry.transactionType === 'Maal Kharida' ? Number(newEntry.amount || 0) : -Number(newEntry.amount || 0))) > 0 ? "text-red-600" : "text-green-600"
            )}>
              ₹{Math.abs(vendor.balance + (newEntry.transactionType === 'Maal Kharida' ? Number(newEntry.amount || 0) : -Number(newEntry.amount || 0))).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
