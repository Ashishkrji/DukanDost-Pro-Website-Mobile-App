import { useState, useEffect } from 'react';
import { 
  TrendingDown, PlusCircle, Search, Filter, 
  Download, Trash2, IndianRupee, Tag, 
  Calendar, CreditCard, Wallet, Utensils, 
  Lightbulb, Home, Car
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  Button, Badge, Card, PageHeader, 
  SearchInput, Modal, InputField, 
  SelectField, StatCard, EmptyState 
} from '@/components/ui';
import * as api from '@/services/api';

const categories = [
  { value: 'Food', icon: <Utensils size={14} />, color: 'text-orange-500 bg-orange-50' },
  { value: 'Rent', icon: <Home size={14} />, color: 'text-blue-500 bg-blue-50' },
  { value: 'Utility', icon: <Lightbulb size={14} />, color: 'text-yellow-500 bg-yellow-50' },
  { value: 'Transport', icon: <Car size={14} />, color: 'text-purple-500 bg-purple-50' },
  { value: 'Other', icon: <Tag size={14} />, color: 'text-slate-500 bg-slate-50' }
];

export default function Expenses() {
  const { showToast } = useStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Other',
    paymentMethod: 'Cash',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.getExpenses();
      if (res.success) setExpenses(res.expenses);
    } catch { showToast('Failed to fetch expenses', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAddExpense = async () => {
    try {
      const res = await api.createExpense(formData);
      if (res.success) {
        showToast('Expense added successfully!');
        setShowAddModal(false);
        fetchExpenses();
        setFormData({ amount: '', category: 'Other', paymentMethod: 'Cash', notes: '', date: new Date().toISOString().split('T')[0] });
      }
    } catch { showToast('Failed to add expense', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await api.deleteExpense(id);
      if (res.success) {
        showToast('Expense deleted');
        fetchExpenses();
      }
    } catch { showToast('Delete failed', 'error'); }
  };

  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader 
        title="Expense Tracker" 
        subtitle="Dukan ke kharchon ko track karein (Rent, Chai, Bijli, etc.)" 
        icon={<TrendingDown size={20} className="text-red-500" />}
        action={<Button icon={<PlusCircle size={18} />} onClick={() => setShowAddModal(true)}>Naya Kharcha</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Expense" value={`₹${totalExpense.toLocaleString()}`} icon={<Wallet size={20} />} iconBg="bg-red-50 text-red-600" />
        <StatCard title="Food & Tea" value={`₹${expenses.filter(e => e.category === 'Food').reduce((s, e) => s + e.amount, 0).toLocaleString()}`} icon={<Utensils size={20} />} iconBg="bg-orange-50 text-orange-600" />
        <StatCard title="Rent & Bills" value={`₹${expenses.filter(e => e.category === 'Rent' || e.category === 'Utility').reduce((s, e) => s + e.amount, 0).toLocaleString()}`} icon={<Home size={20} />} iconBg="bg-blue-50 text-blue-600" />
      </div>

      <Card>
        <div className="p-5 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Kharcha dhundhen..." className="w-full md:w-72" />
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filter</Button>
            <Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Date</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Category</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase">Notes</th>
                <th className="px-5 py-4 text-right text-[11px] font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-5 py-4 text-center text-[11px] font-bold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? filteredExpenses.map(expense => (
                <tr key={expense._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-600">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", categories.find(c => c.value === expense.category)?.color)}>
                      {categories.find(c => c.value === expense.category)?.icon}
                      {expense.category}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 italic">{expense.notes || '---'}</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-red-600">₹{expense.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleDelete(expense._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20">
                    <EmptyState title="No expenses recorded" description="Dukan ke kharche yahan add karein." icon={<TrendingDown size={40} />} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Naya Kharcha Add Karein">
        <div className="space-y-4">
          <InputField label="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
          <SelectField label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} options={categories.map(c => ({ value: c.value, label: c.value }))} />
          <SelectField label="Payment Method" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} options={[{value:'Cash',label:'Cash'},{value:'UPI',label:'UPI/Online'},{value:'Card',label:'Debit/Credit Card'}]} />
          <InputField label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <InputField label="Notes (Optional)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="e.g. Chai for staff" />
          <Button onClick={handleAddExpense} className="w-full h-12" disabled={!formData.amount}>Add Expense</Button>
        </div>
      </Modal>
    </div>
  );
}
