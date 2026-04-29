import { useState } from 'react';
import { PlusCircle, Download, MoreVertical, FileText, CheckCircle2, Clock, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, SelectField, StatCard, Tabs, EmptyState } from '@/components/ui';
import { ReceiptText } from 'lucide-react';
import { exportToCSV } from '@/lib/exportUtils';
import { generateInvoicePDF } from '@/lib/pdfUtils';

export default function Billing() {
  const { invoices, addInvoice, updateInvoiceStatus, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newGst, setNewGst] = useState('0');

  const paid = invoices.filter(i => i.status === 'Paid');
  const unpaid = invoices.filter(i => i.status === 'Unpaid');
  const overdue = invoices.filter(i => i.status === 'Overdue');
  const totalCollected = paid.reduce((s, i) => s + i.amount, 0);
  const totalPending = [...unpaid, ...overdue].reduce((s, i) => s + i.amount, 0);

  const tabs = [
    { id: 'All', label: 'Sab', count: invoices.length },
    { id: 'Unpaid', label: 'Unpaid', count: unpaid.length },
    { id: 'Paid', label: 'Paid', count: paid.length },
    { id: 'Overdue', label: 'Overdue', count: overdue.length },
  ];

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All' || inv.status === activeTab;
    return matchSearch && matchTab;
  });

  const { user: authUser } = useAuthStore();

  const handleCreate = () => {
    if (!newCustomer || !newAmount) {
      showToast('Customer aur amount zaroor bharen!', 'error');
      return;
    }

    // GST limitation check
    if (authUser?.plan === 'Starter' && Number(newGst) > 0) {
      setShowCreateModal(false);
      useStore.getState().openUpgradePopup('Pro', 'GST Billing & Invoicing');
      return;
    }

    addInvoice({
      customer: newCustomer,
      phone: newPhone,
      amount: Number(newAmount),
      gst: Number(newGst),
    });
    setNewCustomer(''); setNewPhone(''); setNewAmount(''); setNewGst('0');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Billing & Invoices"
        subtitle="Grahakon ke liye GST ya non-GST bill banayein."
        icon={<ReceiptText size={20} />}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => setShowCreateModal(true)}>
            Bill Banayein
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Bills Issued"
          value={invoices.length}
          subtitle="Aaj tak"
          icon={<FileText size={20} />}
          iconBg="bg-blue-50 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title="Collected"
          value={`₹${totalCollected.toLocaleString('en-IN')}`}
          subtitle={`${paid.length} invoices paid`}
          icon={<CheckCircle2 size={20} />}
          iconBg="bg-green-50 text-green-600"
          topBorder="green"
        />
        <StatCard
          title="Pending Amount"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
          subtitle={`${unpaid.length + overdue.length} invoices due`}
          icon={<Clock size={20} />}
          iconBg="bg-red-50 text-red-600"
          topBorder="red"
        />
      </div>

      {/* Invoice List */}
      <Card>
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Invoice # ya customer name se dhundhen..."
              className="sm:w-80"
            />
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Download size={14} />} 
              onClick={() => exportToCSV(invoices, 'DukanDost_Invoices')}
            >
              Export
            </Button>
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
              <tr>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Invoice / Date</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Customer</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Due Date</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
              {filtered.length > 0 ? filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-orange-50/20 transition-colors block md:table-row">
                  {/* Mobile */}
                  <td className="p-4 md:hidden block w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{inv.id}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{inv.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</p>
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{inv.customer}</p>
                    <p className="text-xs text-slate-500">{inv.phone}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => updateInvoiceStatus(inv.id, 'Paid')} className="flex-1 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold">
                        Mark Paid
                      </button>
                      <button 
                        onClick={async () => {
                          const res = await useStore.getState().shareInvoice(inv.id || (inv as any)._id);
                          if (res?.whatsappUrl) {
                            window.open(res.whatsappUrl, '_blank');
                          } else {
                            // Fallback
                            const message = `Hello ${inv.customer}, aapka invoice (ID: ${inv.id}) taiyar hai. Total amount: INR ${inv.amount}. Kripya payment jald hi karein. Shukriya!`;
                            const url = `https://wa.me/${inv.phone}?text=${encodeURIComponent(message)}`;
                            window.open(url, '_blank');
                          }
                        }} 
                        className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold"
                      >
                        Share WhatsApp
                      </button>

                    </div>
                  </td>

                  {/* Desktop */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm font-bold text-slate-900">{inv.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{inv.date}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm font-semibold text-slate-900">{inv.customer}</p>
                    <p className="text-xs text-slate-500">{inv.phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-xs text-slate-600 font-medium">{inv.dueDate || '—'}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-right">
                    <span className="font-mono text-sm font-bold text-slate-900">₹{inv.amount.toLocaleString('en-IN')}</span>
                    {inv.gst && inv.gst > 0 && (
                      <p className="text-[10px] text-slate-400 mt-0.5">+ {inv.gst}% GST</p>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-center">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-right">
                    <div className="flex justify-end gap-1">
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button 
                        title="Share on WhatsApp"
                        onClick={async () => {
                          const res = await useStore.getState().shareInvoice(inv.id || (inv as any)._id);
                          if (res?.whatsappUrl) {
                            window.open(res.whatsappUrl, '_blank');
                          } else {
                            // Fallback
                            const message = `Hello ${inv.customer}, aapka invoice (ID: ${inv.id}) taiyar hai. Total amount: INR ${inv.amount}. Kripya payment jald hi karein. Shukriya!`;
                            const url = `https://wa.me/${inv.phone}?text=${encodeURIComponent(message)}`;
                            window.open(url, '_blank');
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >

                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.627 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </button>
                      <button 
                        title="Download PDF"
                        onClick={() => {
                          const invoiceToGenerate = {
                            invoiceNumber: inv.id,
                            createdAt: inv.date,
                            status: inv.status,
                            customerName: inv.customer,
                            customerPhone: inv.phone,
                            items: [{ name: 'Goods/Services', quantity: 1, price: inv.amount }],
                            totalAmount: inv.amount
                          };
                          generateInvoicePDF(invoiceToGenerate);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <FileText size={16} />
                      </button>                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <div className="md:table-row w-full">
                  <div className="md:table-cell w-full py-10 text-center col-span-full">
                    <EmptyState
                      icon={<ReceiptText size={28} />}
                      title="No Invoices Yet"
                      description="Grahakon ke liye bill banayein aur track karein."
                      action={<Button onClick={() => setShowCreateModal(true)} icon={<PlusCircle size={16} />}>Pehla Bill Banayein</Button>}
                    />
                  </div>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Naya Bill Banayein"
        subtitle="Create Invoice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} icon={<FileText size={15} />}>Create Invoice</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField label="Customer Ka Naam" placeholder="Rajesh Kumar" required value={newCustomer} onChange={e => setNewCustomer(e.target.value)} />
          <InputField label="Phone Number" placeholder="+91 98765 43210" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          <InputField label="Total Amount (₹)" placeholder="5000" type="number" required value={newAmount} onChange={e => setNewAmount(e.target.value)} />
          <SelectField
            label="GST Rate"
            value={newGst}
            onChange={e => setNewGst(e.target.value)}
            options={[
              { value: '0', label: 'No GST' },
              { value: '5', label: '5% GST' },
              { value: '12', label: '12% GST' },
              { value: '18', label: '18% GST' },
              { value: '28', label: '28% GST' },
            ]}
          />
          <InputField label="Due Date" type="date" />
          <div>
            <label className="text-sm font-semibold text-slate-700">Notes</label>
            <textarea
              className="w-full mt-1.5 px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 transition-all resize-none"
              rows={3}
              placeholder="Invoice ke baare mein kuch likhna ho to..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  if (status === 'Paid') return <Badge status="success">Paid</Badge>;
  if (status === 'Overdue') return <Badge status="danger">Overdue</Badge>;
  return <Badge status="warning">Unpaid</Badge>;
}
