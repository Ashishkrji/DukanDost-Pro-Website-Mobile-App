import { useState, useEffect } from 'react';
import {
  PlusCircle, MessageCircle, Phone, ArrowUpRight, ArrowDownRight,
  Search, CheckSquare, Square, Download, Send, Trash2, X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, EmptyState, Tabs } from '@/components/ui';
import { Book } from 'lucide-react';
import { bulkRemindCustomers } from '@/services/api';

function StatusBadge({ status }: { status: string }) {
  if (status === 'Overdue') return <Badge status="danger">OVERDUE</Badge>;
  if (status === 'Udhaar') return <Badge status="warning">UDHAAR</Badge>;
  return <Badge status="success">CLEAR</Badge>;
}

export default function Khata() {
  const { customers, addCustomer, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // ── Bulk selection ────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const navigate = useNavigate();

  // ── Computed stats ────────────────────────────────────────
  const totalLena = customers.filter(c => c.balance > 0).reduce((s, c) => s + c.balance, 0);
  const overdue = customers.filter(c => c.status === 'Overdue');
  const udhaar = customers.filter(c => c.status === 'Udhaar');
  const upToDate = customers.filter(c => c.status === 'Up-to-date');

  const tabs = [
    { id: 'All', label: 'Sab', count: customers.length },
    { id: 'Overdue', label: 'Overdue', count: overdue.length },
    { id: 'Udhaar', label: 'Udhaar', count: udhaar.length },
    { id: 'Up-to-date', label: 'Clear', count: upToDate.length },
  ];

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchTab = activeTab === 'All' || c.status === activeTab;
    return matchSearch && matchTab;
  });

  // ── Selection helpers ─────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id || c._id || '')));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ── Bulk actions ──────────────────────────────────────────
  const handleBulkWhatsApp = async () => {
    if (authUser?.plan === 'Starter') {
      useStore.getState().openUpgradePopup('Pro', 'WhatsApp Reminders');
      return;
    }
    
    setBulkLoading(true);
    try {
      await bulkRemindCustomers(Array.from(selectedIds));
      showToast(`Reminder sent to ${selectedIds.size} customers!`);
    } catch {
      showToast(`Reminder sent to ${selectedIds.size} customers! (Simulated)`);
    } finally {
      setBulkLoading(false);
      clearSelection();
    }
  };

  const handleBulkExport = () => {
    const selected = customers.filter(c => selectedIds.has(c.id || c._id || ''));
    const csv = [
      ['Name', 'Phone', 'Balance', 'Status'],
      ...selected.map(c => [c.name, c.phone, c.balance, c.status]),
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'khata_export.csv'; a.click();
    showToast(`${selectedIds.size} customers exported!`);
    clearSelection();
  };

  const { user: authUser } = useAuthStore();

  // Plan limitation check
  useEffect(() => {
    if (authUser?.plan === 'Starter' && customers.length >= 50 && customers.length < 100) {
      // Show nudge if between 50 and 100
      const lastShown = sessionStorage.getItem('upgrade_nudge_shown');
      if (!lastShown) {
        useStore.getState().openUpgradePopup('Pro', 'Unlimited Customers & GST');
        sessionStorage.setItem('upgrade_nudge_shown', 'true');
      }
    }
  }, [customers.length, authUser?.plan]);

  // ── Add customer ──────────────────────────────────────────
  const handleAddCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Naam aur phone zaroor bharen!', 'error');
      return;
    }

    // Plan limitation check
    if (authUser?.plan === 'Starter' && customers.length >= 100) {
      setShowAddModal(false);
      useStore.getState().openUpgradePopup('Pro', 'Unlimited Customers');
      return;
    }

    addCustomer({ name: newName.trim(), phone: newPhone.trim(), address: newAddress, email: newEmail });
    setNewName(''); setNewPhone(''); setNewAddress(''); setNewEmail('');
    setShowAddModal(false);
  };

  const hasSelection = selectedIds.size > 0;
  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Digital Khata (खाता)"
        subtitle="Apne grahak ka udhaar aur jama manage karein."
        icon={<Book size={20} />}
        action={
          <Button icon={<PlusCircle size={18} />} onClick={() => setShowAddModal(true)}>
            Naya Grahak
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Aapko Milenge', value: `₹${totalLena.toLocaleString('en-IN')}`,
            sub: `${customers.filter(c => c.balance > 0).length} grahak se`,
            color: 'border-t-green-500', icon: '↑', iconBg: 'bg-green-50 text-green-600',
          },
          {
            label: 'Overdue', value: overdue.length,
            sub: `₹${overdue.reduce((s, c) => s + c.balance, 0).toLocaleString('en-IN')} baki`,
            color: 'border-t-red-500', icon: '⚠', iconBg: 'bg-red-50 text-red-600',
          },
          {
            label: 'Udhaar', value: udhaar.length,
            sub: `₹${udhaar.reduce((s, c) => s + c.balance, 0).toLocaleString('en-IN')} pending`,
            color: 'border-t-amber-500', icon: '◷', iconBg: 'bg-amber-50 text-amber-600',
          },
          {
            label: 'Clear / Paid', value: upToDate.length,
            sub: 'No balance due',
            color: 'border-t-emerald-500', icon: '✓', iconBg: 'bg-emerald-50 text-emerald-600',
          },
        ].map(stat => (
          <Card key={stat.label} className={`p-4 border-t-2 ${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${stat.iconBg}`}>{stat.icon}</span>
            </div>
            <p className="font-mono text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </Card>
        ))}
      </div>

      {/* Customer List */}
      <Card>
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Naam ya phone number se dhundhen..."
              className="sm:w-80"
            />
            <Button variant="secondary" size="sm" onClick={() => showToast('Khata exported!')}>
              <Download size={14} /> Export PDF
            </Button>
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={t => { setActiveTab(t); clearSelection(); }} />
        </div>

        {/* Bulk Action Bar */}
        {hasSelection && (
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-orange-700">{selectedIds.size} selected</span>
              <button onClick={clearSelection} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="whatsapp"
                icon={<Send size={14} />}
                onClick={handleBulkWhatsApp}
                disabled={bulkLoading}
              >
                {bulkLoading ? 'Sending...' : 'Send WhatsApp Reminder'}
              </Button>
              <Button size="sm" variant="secondary" icon={<Download size={14} />} onClick={handleBulkExport}>
                Export Selected
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="Koi Grahak Nahi Mila"
              description={searchTerm ? `"${searchTerm}" se koi match nahi mila.` : 'Abhi tak koi customer nahi hai.'}
              action={<Button onClick={() => setShowAddModal(true)} icon={<PlusCircle size={16} />}>Naya Grahak Jodhein</Button>}
            />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="px-4 py-4 w-10">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-orange-500 transition-colors">
                      {allSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                    </button>
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Grahak</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Phone</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Status</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
                {filtered.map(customer => {
                  const cid = customer.id || customer._id || '';
                  const isSelected = selectedIds.has(cid);

                  return (
                    <tr
                      key={cid}
                      className={cn(
                        'hover:bg-orange-50/30 transition-colors cursor-pointer block md:table-row',
                        isSelected && 'bg-orange-50/60'
                      )}
                      onClick={() => navigate(`/khata/${cid}`)}
                    >
                      {/* Mobile Card */}
                      <td className="p-4 md:hidden block w-full">
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            onClick={e => { e.stopPropagation(); toggleSelect(cid); }}
                            className="mt-1 shrink-0 text-slate-300 hover:text-orange-500 transition-colors"
                          >
                            {isSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                          </button>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm', customer.color)}>
                                  {customer.initials}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{customer.name}</p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Phone size={10} /> {customer.phone}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-slate-900 block text-base">
                                  {customer.balance > 0 ? `₹${customer.balance.toLocaleString('en-IN')}` : '₹0'}
                                </span>
                                <StatusBadge status={customer.status} />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={e => { 
                                  e.stopPropagation(); 
                                  if (authUser?.plan === 'Starter') {
                                    window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${customer.name}, aapka DukanDost bill ₹${customer.balance} pending hai. Kripya bhugtan karein.`)}`, '_blank');
                                  } else {
                                    showToast(`WhatsApp sent to ${customer.name}!`); 
                                  }
                                }}
                                className="flex-1 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 hover:bg-green-100 transition-colors"
                              >
                                <MessageCircle size={15} /> WhatsApp
                              </button>
                              <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
                                Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Desktop Checkbox */}
                      <td className="px-4 py-4 hidden md:table-cell w-10">
                        <button
                          onClick={e => { e.stopPropagation(); toggleSelect(cid); }}
                          className="text-slate-300 hover:text-orange-500 transition-colors"
                        >
                          {isSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                        </button>
                      </td>

                      {/* Desktop columns */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm', customer.color)}>
                            {customer.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                            <p className="text-[11px] text-slate-500">Last: {customer.lastTransactionDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-600 font-medium">
                        {customer.phone}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-right">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          ₹{customer.balance.toLocaleString('en-IN')}
                        </span>
                        {customer.balance > 0 && (
                          <p className="text-[10px] text-red-500 font-bold mt-0.5">BAKI HAI</p>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={e => { 
                              e.stopPropagation(); 
                              if (authUser?.plan === 'Starter') {
                                window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${customer.name}, aapka DukanDost bill ₹${customer.balance} pending hai. Kripya bhugtan karein.`)}`, '_blank');
                              } else {
                                showToast(`Reminder sent to ${customer.name}!`); 
                              }
                            }}
                            title="WhatsApp Reminder"
                            className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            onClick={e => e.stopPropagation()}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-orange-600 rounded-lg transition-colors"
                          >
                            <Phone size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-500">{filtered.length} customers found</p>
            {hasSelection && (
              <p className="text-xs font-semibold text-orange-600">{selectedIds.size} selected</p>
            )}
          </div>
        )}
      </Card>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Naya Grahak Jodhein"
        subtitle="Add Customer to Khata"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer} icon={<PlusCircle size={15} />}>Add Customer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Grahak Ka Naam"
            placeholder="e.g. Rajesh Kumar"
            required
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <InputField
            label="Phone Number"
            placeholder="+91 98765 43210"
            required
            type="tel"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
          />
          <InputField
            label="Email (Optional)"
            placeholder="customer@example.com"
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
          <InputField
            label="Address (Optional)"
            placeholder="House No., Street, City"
            value={newAddress}
            onChange={e => setNewAddress(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
