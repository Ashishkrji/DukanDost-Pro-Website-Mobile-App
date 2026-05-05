import { useState, useEffect } from 'react';
import { PlusCircle, Download, MoreVertical, FileText, CheckCircle2, Clock, Search, Truck, FileQuestion, ArrowLeftRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, StatCard, Tabs, EmptyState } from '@/components/ui';
import { ReceiptText } from 'lucide-react';
import { exportToCSV } from '@/lib/exportUtils';
import { generateInvoicePDF } from '@/lib/pdfUtils';
import { useNavigate } from 'react-router-dom';

interface BillingProps {
  type?: 'INVOICE' | 'QUOTATION' | 'CHALLAN' | 'PURCHASE_ORDER' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
}

export default function Billing({ type = 'INVOICE' }: BillingProps) {
  const navigate = useNavigate();
  const { invoices, fetchInvoices, updateInvoiceStatus, showToast, convertDocument } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchInvoices(type);
  }, [type]);

  const typeConfig = {
    INVOICE: { title: 'Billing & Invoices', icon: <ReceiptText size={20} />, color: 'orange', route: '/invoices/new' },
    QUOTATION: { title: 'Quotations & Estimates', icon: <FileQuestion size={20} />, color: 'blue', route: '/quotations/new' },
    CHALLAN: { title: 'Delivery Challans', icon: <Truck size={20} />, color: 'purple', route: '/challans/new' },
    PURCHASE_ORDER: { title: 'Purchase Orders', icon: <FileText size={20} />, color: 'indigo', route: '/purchase-orders/new' },
    CREDIT_NOTE: { title: 'Sales Returns (Credit Note)', icon: <ArrowLeftRight size={20} />, color: 'red', route: '/returns/new' },
    DEBIT_NOTE: { title: 'Purchase Returns (Debit Note)', icon: <ArrowLeftRight size={20} />, color: 'red', route: '/returns/new' },
  };

  const config = typeConfig[type] || typeConfig.INVOICE;

  const tabs = [
    { id: 'All', label: 'Sab', count: invoices.length },
    { id: 'Unpaid', label: 'Pending', count: invoices.filter(i => i.status === 'Unpaid' || i.status === 'PENDING').length },
    { id: 'Paid', label: 'Completed', count: invoices.filter(i => i.status === 'Paid' || i.status === 'PAID' || i.status === 'RECEIVED').length },
  ];

  const filtered = invoices.filter(inv => {
    const name = inv.customerName || inv.customer || '';
    const invNo = inv.invoiceNumber || inv.id || '';
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const handleConvert = async (id: string, target: string) => {
    await convertDocument(id, target);
    showToast(`Converted to ${target} successfully!`);
    navigate(typeConfig[target as keyof typeof typeConfig].route.replace('/new', ''));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title={config.title}
        subtitle={`Apne business ke ${config.title.toLowerCase()} manage karein.`}
        icon={config.icon}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => navigate(config.route)}>
            Naya Banayein
          </Button>
        }
      />

      <Card>
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Number ya naam se dhundhen..."
              className="sm:w-80"
            />
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<Download size={14} />} 
              onClick={() => exportToCSV(invoices, `DukanDost_${type}`)}
            >
              Export
            </Button>
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">ID / Date</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Entity</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map(inv => (
                <tr key={inv._id || inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-slate-900">{inv.invoiceNumber || inv.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(inv.createdAt || inv.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-900">{inv.customerName || inv.vendorName || inv.customer}</p>
                    <p className="text-xs text-slate-500">{inv.customerPhone || inv.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-slate-900">₹{(inv.total || inv.amount).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge 
                      status={
                        (inv.status === 'PAID' || inv.status === 'Paid') ? 'success' : 
                        (inv.status === 'PENDING' || inv.status === 'DRAFT') ? 'info' : 
                        'warning'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {type === 'QUOTATION' && (
                        <button 
                          onClick={() => handleConvert(inv._id || inv.id, 'INVOICE')}
                          className="px-2 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-lg"
                        >
                          Convert to Bill
                        </button>
                      )}
                      <button 
                        onClick={() => generateInvoicePDF(inv)}
                        className="p-2 text-slate-400 hover:text-blue-600"
                        title="Download PDF"
                      >
                        <FileText size={16} />
                      </button>
                      
                      {type === 'INVOICE' && inv.isGST && (
                        inv.einvoiceDetails?.status === 'GENERATED' ? (
                          <Badge status="success" className="bg-green-50 text-green-700 border-none font-black text-[9px] px-2 py-1">E-INVOICED</Badge>
                        ) : (
                          <button 
                            onClick={() => {
                              const { generateEInvoice } = useStore.getState();
                              generateEInvoice(inv._id || inv.id);
                            }}
                            className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Generate IRN"
                          >
                            Generate E-Invoice
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={config.icon}
                      title={`No ${config.title} Found`}
                      description="Naya document banane ke liye button dabayein."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
