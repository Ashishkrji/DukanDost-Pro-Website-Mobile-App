import { useState, useEffect } from 'react';
import { 
  RotateCcw, PlusCircle, Search, Filter, 
  Download, Trash2, IndianRupee, Tag, 
  Calendar, ArrowLeftRight, FileText, User, ShoppingCart
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  Button, Badge, Card, PageHeader, 
  SearchInput, Modal, InputField, 
  SelectField, StatCard, EmptyState 
} from '@/components/ui';
import * as api from '@/services/api';

export default function CreditDebitNotes() {
  const { showToast, customers, vendors, products } = useStore();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    type: 'CREDIT',
    customerId: '',
    vendorId: '',
    reason: '',
    items: [] as any[]
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    name: '',
    quantity: 1,
    price: 0
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.getReturns();
      if (res.success) setNotes(res.notes);
    } catch { showToast('Failed to fetch return notes', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const addItem = () => {
    if (!currentItem.productId || !currentItem.quantity) return;
    const product = products.find((p: any) => p._id === currentItem.productId);
    const newItem = {
      ...currentItem,
      name: product?.name || 'Unknown',
      total: currentItem.quantity * currentItem.price
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
    setCurrentItem({ productId: '', name: '', quantity: 1, price: 0 });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleCreate = async () => {
    const total = calculateTotal();
    if (total <= 0) {
      showToast('Please add at least one item', 'error');
      return;
    }

    try {
      const res = await api.createReturn({
        ...formData,
        totalAmount: total,
      });
      if (res.success) {
        showToast('Return note issued successfully!');
        setShowAddModal(false);
        setFormData({ type: 'CREDIT', customerId: '', vendorId: '', reason: '', items: [] });
        fetchNotes();
      }
    } catch { showToast('Issuance failed', 'error'); }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader 
        title="Credit & Debit Notes" 
        subtitle="Sales returns (Credit) aur Purchase returns (Debit) manage karein." 
        icon={<RotateCcw size={20} className="text-orange-600" />}
        action={<Button icon={<PlusCircle size={18} />} onClick={() => setShowAddModal(true)}>Issue Return Note</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total Credit Notes (Sales Return)" value={`₹${notes.filter(n => n.type === 'CREDIT').reduce((s, n) => s + n.totalAmount, 0).toLocaleString()}`} icon={<ShoppingCart size={20} />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Total Debit Notes (Purchase Return)" value={`₹${notes.filter(n => n.type === 'DEBIT').reduce((s, n) => s + n.totalAmount, 0).toLocaleString()}`} icon={<ArrowLeftRight size={20} />} iconBg="bg-purple-50 text-purple-600" />
      </div>

      <Card>
        <div className="p-5 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm font-bold">
           Recent Return Transactions
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Note #</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Type</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Party</th>
                <th className="px-5 py-4 text-right text-[11px] font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notes.length > 0 ? notes.map(note => (
                <tr key={note._id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedNote(note)}>
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{note.noteNumber}</td>
                  <td className="px-5 py-4">
                    <Badge status={note.type === 'CREDIT' ? 'info' : 'purple'}>{note.type === 'CREDIT' ? 'CREDIT (Sales)' : 'DEBIT (Purchase)'}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {note.customerId?.name || note.vendorId?.name || '---'}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">₹{note.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" icon={<FileText size={16} />} onClick={(e) => { e.stopPropagation(); setSelectedNote(note); }} />
                      <Badge status="success">ISSUED</Badge>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <EmptyState title="No return notes found" description="Sales ya purchase return yahan record karein." icon={<RotateCcw size={40} />} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Issue Return Note" size="lg">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Note Type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} options={[{value:'CREDIT',label:'Credit Note (Sales Return)'},{value:'DEBIT',label:'Debit Note (Purchase Return)'}]} />
            {formData.type === 'CREDIT' ? (
              <SelectField label="Select Customer" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} options={customers.map((c:any) => ({ value: c._id, label: c.name }))} />
            ) : (
              <SelectField label="Select Vendor" value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} options={vendors.map((v:any) => ({ value: v._id, label: v.name }))} />
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Tag size={16} className="text-orange-500" /> Add Returned Items
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-2">
                <SelectField label="Product" value={currentItem.productId} onChange={e => {
                  const p = products.find((x:any) => x._id === e.target.value);
                  setCurrentItem({...currentItem, productId: e.target.value, price: p?.price || 0});
                }} options={products.map((p:any) => ({ value: p._id, label: p.name }))} />
              </div>
              <InputField label="Qty" type="number" value={currentItem.quantity} onChange={e => setCurrentItem({...currentItem, quantity: Number(e.target.value)})} />
              <Button variant="secondary" className="w-full" onClick={addItem}>Add</Button>
            </div>

            {formData.items.length > 0 && (
              <div className="mt-4 border rounded-lg bg-white overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-center">Qty</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">₹{item.price}</td>
                        <td className="px-3 py-2 text-right">₹{item.total}</td>
                        <td className="px-3 py-2 text-center text-red-500 cursor-pointer" onClick={() => removeItem(idx)}>
                          <Trash2 size={14} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <InputField label="Reason for Return" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="e.g. Expired product, Customer changed mind" />
          
          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
            <span className="text-orange-900 font-bold">Total Return Amount:</span>
            <span className="text-xl font-bold text-orange-600">₹{calculateTotal().toLocaleString()}</span>
          </div>

          <Button onClick={handleCreate} className="w-full h-12" disabled={formData.items.length === 0}>Issue {formData.type === 'CREDIT' ? 'Credit' : 'Debit'} Note</Button>
        </div>
      </Modal>

      {/* Voucher View Modal */}
      <Modal isOpen={!!selectedNote} onClose={() => setSelectedNote(null)} title="Return Voucher Details" size="lg">
        {selectedNote && (
          <div className="space-y-6" id="voucher-print">
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{selectedNote.type === 'CREDIT' ? 'CREDIT NOTE' : 'DEBIT NOTE'}</h3>
                <p className="text-slate-500 font-mono text-sm">{selectedNote.noteNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{new Date(selectedNote.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                <Badge status={selectedNote.type === 'CREDIT' ? 'info' : 'purple'}>{selectedNote.type === 'CREDIT' ? 'SALES RETURN' : 'PURCHASE RETURN'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">From</p>
                <p className="font-bold text-slate-900">DukanDost Pro User</p>
                <p className="text-xs text-slate-500">Business Address Line</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bill To</p>
                <p className="font-bold text-slate-900">{selectedNote.customerId?.name || selectedNote.vendorId?.name}</p>
                <p className="text-xs text-slate-500">{selectedNote.customerId?.phone || selectedNote.vendorId?.phone || 'No Contact'}</p>
              </div>
            </div>

            <table className="w-full mt-8">
              <thead className="border-y border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Item Details</th>
                  <th className="px-4 py-3 text-center text-xs font-black text-slate-400 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedNote.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-center text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-right text-slate-600">₹{item.price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-slate-900">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end pt-6 space-y-2">
              <div className="flex justify-between w-64 text-sm">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-900">₹{selectedNote.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-64 text-lg border-t pt-2 mt-2">
                <span className="font-black text-slate-900">Grand Total:</span>
                <span className="font-black text-orange-600">₹{selectedNote.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {selectedNote.reason && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason for Return</p>
                <p className="text-sm text-slate-600">{selectedNote.reason}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t no-print">
              <Button variant="secondary" className="flex-1" icon={<Download size={18} />} onClick={() => window.print()}>Print Voucher</Button>
              <Button className="flex-1" onClick={() => setSelectedNote(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
