import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Save, X, Search, 
  User, ReceiptText, Calculator, 
  AlertCircle, ChevronLeft, Package,
  Percent, IndianRupee
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Button, Card, PageHeader, 
  InputField, SelectField, Modal, 
  Badge 
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  gstRate: number;
  total: number;
}

export default function NewInvoice() {
  const navigate = useNavigate();
  const { customers, products, addInvoice, showToast, fetchCustomers, fetchProducts } = useStore();
  const { user } = useAuthStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isGST, setIsGST] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', qty: 1, price: 0, gstRate: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search and selection
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const selectedCustomer = customers.find(c => (c.id === selectedCustomerId || (c as any)._id === selectedCustomerId));

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0, gstRate: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Calculate line total
    const lineTotal = Number(item.qty) * Number(item.price);
    const gstAmount = isGST ? (lineTotal * (Number(item.gstRate) || 0)) / 100 : 0;
    item.total = lineTotal + gstAmount;
    
    newItems[index] = item;
    setItems(newItems);
  };

  // Totals calculation
  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.price)), 0);
  const totalGST = isGST ? items.reduce((sum, item) => {
    const lineTotal = Number(item.qty) * Number(item.price);
    return sum + (lineTotal * (Number(item.gstRate) || 0)) / 100;
  }, 0) : 0;
  const grandTotal = subtotal + totalGST - discount;

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      showToast('Kripya customer select karein!', 'error');
      return;
    }

    if (items.some(item => !item.name || item.price <= 0)) {
      showToast('Kripya sabhi items ke details sahi se bharein!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await addInvoice({
        customerId: selectedCustomerId,
        items: items.map(it => ({
          name: it.name,
          qty: Number(it.qty),
          price: Number(it.price),
          gstRate: isGST ? Number(it.gstRate) : 0
        })),
        discount: Number(discount),
        notes,
        dueDate,
        isGST
      });
      navigate('/invoices');
    } catch (err) {
      // Error handled by store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Professional Invoice</h1>
          <p className="text-sm text-slate-500 font-medium">Generate GST or Non-GST bills for your customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
            {/* Customer Selection Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} /> Customer Information
                </h3>
                {selectedCustomer && (
                  <Badge status="success">Selected</Badge>
                )}
              </div>
              
              {!selectedCustomer ? (
                <div 
                  onClick={() => setShowCustomerSelect(true)}
                  className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                    <User size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-500 group-hover:text-orange-700 transition-all">Select or Add Customer</p>
                </div>
              ) : (
                <div className="flex items-start justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A0B1A] flex items-center justify-center text-white font-black">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{selectedCustomer.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{selectedCustomer.phone || 'No phone number'}</p>
                      {selectedCustomer.gstin && (
                        <p className="text-[10px] text-blue-600 font-black mt-1 uppercase tracking-wider">GSTIN: {selectedCustomer.gstin}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCustomerId('')}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} /> Invoice Items
                </h3>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setIsGST(false)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                      !isGST ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Non-GST
                  </button>
                  <button 
                    onClick={() => {
                      if (user?.plan === 'Starter') {
                        useStore.getState().openUpgradePopup('Pro', 'GST Billing');
                      } else {
                        setIsGST(true);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5",
                      isGST ? "bg-[#FF6B00] text-white shadow-sm" : "text-slate-400"
                    )}
                  >
                    GST Bill {user?.plan === 'Starter' && <AlertCircle size={10} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group animate-in zoom-in-95 duration-200">
                    <div className="col-span-12 md:col-span-4 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item Description</label>
                      <input 
                        type="text"
                        placeholder="Product name..."
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Qty</label>
                      <input 
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (₹)</label>
                      <input 
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all"
                      />
                    </div>
                    {isGST && (
                      <div className="col-span-4 md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GST %</label>
                        <select 
                          value={item.gstRate}
                          onChange={(e) => updateItem(index, 'gstRate', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase focus:ring-2 ring-orange-500/10 appearance-none"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="12">12%</option>
                          <option value="18">18%</option>
                          <option value="28">28%</option>
                        </select>
                      </div>
                    )}
                    <div className={cn(
                      "col-span-12 md:col-span-2 text-right",
                      isGST ? "md:col-span-2" : "md:col-span-4"
                    )}>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Total</p>
                      <p className="text-sm font-black text-slate-900 py-3">₹{item.total.toLocaleString('en-IN')}</p>
                    </div>
                    
                    {items.length > 1 && (
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddItem}
                className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-orange-50/30 transition-all"
              >
                <Plus size={16} /> Add Another Item
              </button>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-slate-200/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <ReceiptText size={14} /> Notes & Terms
            </h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bank details, terms and conditions, or personal message..."
              className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all min-h-[120px] resize-none"
            />
          </Card>
        </div>

        {/* Right Side: Summary & Actions */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-2xl shadow-orange-200/40 bg-white relative overflow-hidden">
            {/* Design Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0 opacity-50" />
            
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Calculator size={14} /> Bill Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Subtotal</span>
                  <span className="font-black text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {isGST && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">Total GST</span>
                    <span className="font-black text-blue-600">+ ₹{totalGST.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-slate-400 uppercase tracking-widest">Discount (₹)</span>
                    <input 
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-right text-xs font-black text-green-600 focus:ring-2 ring-green-500/10"
                    />
                  </div>
                </div>
                
                <div className="pt-6 pb-2 border-t-2 border-dashed border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-slate-900">Grand Total</span>
                    <span className="text-2xl font-black text-[#FF6B00]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-slate-200/50 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <IndianRupee size={10} /> Due Date (Optional)
              </label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 ring-orange-500/10 appearance-none"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              loading={submitting}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              icon={<Save size={18} />}
            >
              Generate Invoice
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full h-12 rounded-xl text-slate-400 font-bold"
              icon={<X size={16} />}
            >
              Discard
            </Button>
          </Card>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <Modal
        isOpen={showCustomerSelect}
        onClose={() => setShowCustomerSelect(false)}
        title="Select Customer"
        subtitle="Choose a merchant from your khata registry"
      >
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or phone..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-orange-500/10 transition-all"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {customers
              .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone?.includes(customerSearch))
              .map((customer) => (
                <div 
                  key={customer.id || (customer as any)._id}
                  onClick={() => {
                    setSelectedCustomerId(customer.id || (customer as any)._id);
                    setShowCustomerSelect(false);
                  }}
                  className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#FF6B00] hover:bg-orange-50/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-black">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-[#FF6B00]">{customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customer.phone}</p>
                    </div>
                  </div>
                  <Badge status={customer.balance > 0 ? 'warning' : 'success'} className="text-[9px]">
                    ₹{customer.balance.toLocaleString('en-IN')}
                  </Badge>
                </div>
              ))}
          </div>

          <Button 
            variant="secondary" 
            className="w-full h-12 rounded-xl text-orange-600"
            onClick={() => navigate('/khata')}
            icon={<Plus size={16} />}
          >
            Add New Customer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
