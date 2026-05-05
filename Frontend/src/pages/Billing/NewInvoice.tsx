import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Save, X, Search, 
  User, ReceiptText, Calculator, 
  AlertCircle, ChevronLeft, Package,
  Percent, IndianRupee, Truck, FileQuestion, Scan, Tag, RefreshCcw
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Button, Card, PageHeader, 
  InputField, SelectField, Modal, 
  Badge, SearchInput 
} from '@/components/ui';
import { cn } from '@/lib/utils';
import * as api from '@/services/api';

interface InvoiceItem {
  productId?: string;
  name: string;
  qty: number;
  price: number;
  gstRate: number;
  total: number;
}

export default function NewInvoice({ type = 'INVOICE' }: { type?: string }) {
  const navigate = useNavigate();
  const { customers, vendors, products, addInvoice, showToast, fetchCustomers, fetchVendors, fetchProducts } = useStore();
  const { user } = useAuthStore();

  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [isGST, setIsGST] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([{ name: '', qty: 1, price: 0, gstRate: 0, total: 0 }]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showEntitySelect, setShowEntitySelect] = useState(false);
  
  // Vouchers (Partially Implemented)
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Recurring (M8)
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');

  useEffect(() => { fetchCustomers(); fetchVendors(); fetchProducts(); }, []);

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    const lineTotal = Number(item.qty) * Number(item.price);
    const gstAmount = isGST ? (lineTotal * (Number(item.gstRate) || 0)) / 100 : 0;
    item.total = lineTotal + gstAmount;
    newItems[index] = item;
    setItems(newItems);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setIsValidatingVoucher(true);
    try {
      const res = await api.validateVoucherCode(voucherCode);
      if (res.success) {
        setVoucherDiscount(res.discountAmount || 50); // Mocking discount if missing
        showToast('Voucher applied successfully!');
      } else {
        showToast('Invalid voucher code', 'error');
      }
    } catch { showToast('Voucher validation failed', 'error'); } finally { setIsValidatingVoucher(false); }
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
  const totalGST = isGST ? items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price) * (item.gstRate || 0)) / 100, 0) : 0;
  const grandTotal = subtotal + totalGST - voucherDiscount;

  const handleSubmit = async () => {
    if (!selectedEntityId) { showToast('Entity select karein!', 'error'); return; }
    setSubmitting(true);
    try {
      await addInvoice({
        customerId: selectedEntityId,
        type, items, notes, isGST, isRecurring,
        discount: voucherDiscount,
        voucherCode: voucherDiscount > 0 ? voucherCode : undefined
      });
      navigate('/invoices');
    } catch { } finally { setSubmitting(false); }
  };

  const isPurchase = type === 'PURCHASE_ORDER';
  const entities = isPurchase ? vendors : customers;
  const selectedEntity = entities.find(e => (e.id === selectedEntityId || (e as any)._id === selectedEntityId));

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-[pageIn_0.3s_ease]">
      <PageHeader title={type.replace('_', ' ')} subtitle="Naya document create karein." icon={<ReceiptText size={20} />} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Billing Details</h3>
                 <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setIsGST(false)} className={cn("px-3 py-1 text-[10px] font-bold rounded-md", !isGST && "bg-white shadow-sm")}>Non-GST</button>
                    <button onClick={() => setIsGST(true)} className={cn("px-3 py-1 text-[10px] font-bold rounded-md", isGST && "bg-white shadow-sm")}>GST</button>
                 </div>
              </div>
              {!selectedEntity ? (
                 <Button variant="secondary" className="w-full h-16 border-dashed" onClick={() => setShowEntitySelect(true)}>+ Select {isPurchase ? 'Vendor' : 'Customer'}</Button>
              ) : (
                 <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">{selectedEntity.name.charAt(0)}</div>
                    <div className="flex-1">
                       <p className="font-black text-slate-900">{selectedEntity.name}</p>
                       <p className="text-xs text-slate-500">{selectedEntity.phone}</p>
                    </div>
                    <button onClick={() => setShowEntitySelect(true)} className="text-xs font-bold text-orange-600">Change</button>
                 </div>
              )}
           </Card>

           <Card className="p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Line Items</h3>
              <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl relative group/item">
                       <div className="col-span-5"><InputField label="Item Name" value={item.name} onChange={e => updateItem(index, 'name', e.target.value)} /></div>
                       <div className="col-span-2"><InputField label="Qty" type="number" value={item.qty} onChange={e => updateItem(index, 'qty', e.target.value)} /></div>
                       <div className="col-span-3"><InputField label="Price" type="number" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} /></div>
                       {isGST && <div className="col-span-2"><InputField label="GST %" type="number" value={item.gstRate} onChange={e => updateItem(index, 'gstRate', e.target.value)} /></div>}
                       
                       <button 
                         onClick={() => setItems(items.filter((_, i) => i !== index))}
                         className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                       >
                         <Trash2 size={12} />
                       </button>
                    </div>
                  ))}
                 <Button variant="secondary" className="w-full border-dashed" onClick={() => setItems([...items, { name: '', qty: 1, price: 0, gstRate: 0, total: 0 }])}>+ Add Item</Button>
              </div>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Summary</h3>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-bold">₹{subtotal}</span></div>
                 {isGST && <div className="flex justify-between text-sm"><span>GST</span><span className="font-bold">₹{totalGST}</span></div>}
                 
                 {/* Voucher Input (Need Completion Feature) */}
                 <div className="pt-4 border-t">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Have a Voucher?</p>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input placeholder="CODE100" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs font-bold outline-none focus:border-orange-500" />
                       </div>
                       <Button size="sm" onClick={handleApplyVoucher} loading={isValidatingVoucher}>Apply</Button>
                    </div>
                    {voucherDiscount > 0 && <p className="text-[10px] font-bold text-green-600 mt-2">✓ ₹{voucherDiscount} discount applied!</p>}
                 </div>

                 <div className="flex justify-between text-xl font-black text-orange-600 border-t pt-4"><span>Total</span><span>₹{grandTotal}</span></div>
              </div>

              <Button className="w-full h-14 bg-orange-600" onClick={handleSubmit} loading={submitting}>Save Invoice</Button>
           </Card>

           <Card className="p-6">
              <div className="flex items-center gap-3">
                 <RefreshCcw size={18} className="text-purple-600" />
                 <div className="flex-1">
                    <p className="text-xs font-bold">Recurring Invoice?</p>
                    <p className="text-[10px] text-slate-500">Auto-generate periodically.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                 </label>
              </div>
           </Card>
        </div>
      </div>

      <Modal isOpen={showEntitySelect} onClose={() => setShowEntitySelect(false)} title="Select Entity">
         <div className="space-y-2 p-4">
            {entities.map(e => (
               <div key={e.id || (e as any)._id} onClick={() => { setSelectedEntityId(e.id || (e as any)._id); setShowEntitySelect(false); }} className="p-4 border rounded-xl cursor-pointer hover:bg-slate-50">
                  <p className="font-bold">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.phone}</p>
               </div>
            ))}
         </div>
      </Modal>
    </div>
  );
}
