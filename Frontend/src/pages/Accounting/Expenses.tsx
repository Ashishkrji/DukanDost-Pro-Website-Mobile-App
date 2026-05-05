import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, Plus, Trash2, Filter, 
  Download, Calendar, Wallet, Tag
} from 'lucide-react';
import { Card, Button, InputField, SelectField, Badge } from '@/components/ui';
import * as api from '@/services/api';
import { useStore } from '@/store/useStore';

export default function Expenses() {
  const { showToast } = useStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Other',
    paymentMethod: 'Cash',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Rent', 'Electricity', 'Water', 'Salary', 'Transport', 'Marketing', 'Maintenance', 'Utilities', 'Other'];
  const paymentMethods = ['Cash', 'UPI', 'Bank Transfer', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      if (data.success) setExpenses(data.expenses);
    } catch (err) {
      showToast('Failed to fetch expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createExpense(newExpense);
      if (res.success) {
        setExpenses([res.expense, ...expenses]);
        setShowAddModal(false);
        setNewExpense({
          amount: '',
          category: 'Other',
          paymentMethod: 'Cash',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
        showToast('Expense recorded successfully!');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save expense', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.deleteExpense(id);
      setExpenses(expenses.filter(e => e._id !== id));
      showToast('Expense deleted');
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense Tracker</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your daily business outgoings</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          <Plus size={18} /> Record Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-red-50 border-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Total Expenses</p>
              <h2 className="text-2xl font-black text-slate-900">₹{totalExpense.toLocaleString('en-IN')}</h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Recent Expenses</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length > 0 ? expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(exp.date).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {exp.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    {exp.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {exp.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-red-600">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-[modalIn_0.2s_ease]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Record Expense</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <InputField 
                label="Amount (₹)" 
                type="number" 
                required 
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="0.00"
                icon={<Wallet size={18} />}
              />
              <SelectField 
                label="Category" 
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                options={categories.map(c => ({ label: c, value: c }))}
                icon={<Tag size={18} />}
              />
              <SelectField 
                label="Payment Method" 
                value={newExpense.paymentMethod}
                onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                options={paymentMethods.map(m => ({ label: m, value: m }))}
              />
              <InputField 
                label="Date" 
                type="date" 
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
              <InputField 
                label="Notes (Optional)" 
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                placeholder="Enter details..."
              />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Save Expense
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
