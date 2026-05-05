import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Printer, Share2, MessageCircle, 
  Download, QrCode, Shield, CheckCircle2, AlertCircle, FileText, Palette
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { Button, Card, Badge, PageHeader, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import * as api from '@/services/api';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [theme, setTheme] = useState<'CLASSIC' | 'MODERN' | 'PROFESSIONAL'>('MODERN');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.getInvoiceById(id!);
        if (res.success) setInvoice(res.invoice);
      } catch { showToast('Error loading invoice', 'error'); } finally { setLoading(false); }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading bill...</div>;
  if (!invoice) return <div className="p-8 text-center">Invoice not found.</div>;

  const isKacha = !invoice.isGST;
  const upiUrl = `upi://pay?pa=${user?.upiId || 'business@upi'}&pn=${encodeURIComponent(user?.businessName || 'DukanDost Merchant')}&am=${invoice.total}&cu=INR`;

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-[pageIn_0.3s_ease]">
      <div className="flex justify-between items-center mb-6 no-print">
         <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)} icon={<ChevronLeft size={16} />}>Back</Button>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
               {['CLASSIC', 'MODERN', 'PROFESSIONAL'].map((t: any) => (
                 <button 
                   key={t}
                   onClick={() => setTheme(t)}
                   className={cn(
                     "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                     theme === t ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                   )}
                 >
                   {t}
                 </button>
               ))}
            </div>
         </div>
         <div className="flex gap-2">
            <Button variant="secondary" icon={<Share2 size={16} />}>Share</Button>
            <Button icon={<Printer size={16} />} onClick={() => window.print()}>Print Bill</Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card className={cn(
             "p-10 bg-white shadow-2xl relative overflow-hidden transition-all duration-500",
             theme === 'MODERN' && "border-t-[12px] border-t-orange-600",
             theme === 'CLASSIC' && "border-2 border-slate-900",
             theme === 'PROFESSIONAL' && "border-t-[12px] border-t-slate-900 shadow-slate-200"
           )}>
              {/* Header based on theme */}
              <div className="flex justify-between items-start mb-10 relative z-10">
                 <div>
                    <h2 className={cn(
                      "text-3xl font-black mb-1",
                      theme === 'PROFESSIONAL' ? "text-slate-900" : "text-slate-900"
                    )}>{user?.businessName || 'Merchant Name'}</h2>
                    <p className="text-sm text-slate-500 max-w-xs">{user?.address || 'Shop Address'}</p>
                    {invoice.isGST && <p className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 px-2 py-1 rounded-md w-fit">GSTIN: {user?.GSTIN || 'N/A'}</p>}
                 </div>
                 <div className="text-right">
                    <h1 className={cn(
                      "text-4xl font-black mb-2 opacity-10",
                      theme === 'MODERN' ? "text-orange-600" : "text-slate-900"
                    )}>{isKacha ? 'ESTIMATE' : 'INVOICE'}</h1>
                    <Badge status={invoice.status === 'PAID' ? 'success' : 'warning'}>{invoice.status}</Badge>
                    <p className="text-xs text-slate-500 mt-4 font-bold"># {invoice.invoiceNumber || invoice._id.substring(0, 8)}</p>
                    <p className="text-[10px] text-slate-400">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className={cn(
                "py-6 mb-10 relative z-10 border-y",
                theme === 'CLASSIC' ? "border-slate-900" : "border-slate-100"
              )}>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                       <h3 className="font-bold text-lg text-slate-900">{invoice.customerName}</h3>
                       <p className="text-sm text-slate-500">{invoice.customerPhone}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Mode</p>
                       <h3 className="font-bold text-slate-900">{invoice.paymentMode || 'Cash'}</h3>
                    </div>
                 </div>
              </div>

              <table className="w-full mb-10 relative z-10">
                 <thead>
                    <tr className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      theme === 'CLASSIC' ? "bg-slate-900 text-white" : "border-b-2 border-slate-900 text-slate-400"
                    )}>
                       <th className="py-3 px-2 text-left">Item Details</th>
                       <th className="py-3 px-2 text-center">Qty</th>
                       <th className="py-3 px-2 text-right">Price</th>
                       <th className="py-3 px-2 text-right">Total</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {invoice.items.map((item: any, i: number) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="py-5 px-2">
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400">HSN: {item.hsn || '---'}</p>
                         </td>
                         <td className="py-5 px-2 text-center text-slate-600 font-medium">{item.qty}</td>
                         <td className="py-5 px-2 text-right text-slate-600">₹{item.price.toLocaleString()}</td>
                         <td className="py-5 px-2 text-right font-black text-slate-900">₹{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>

              <div className="flex justify-between items-end relative z-10 pt-6 border-t border-slate-100">
                 <div className="max-w-[200px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Terms & Conditions</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed italic">
                       1. Goods once sold will not be taken back. 2. Subject to local jurisdiction. 3. This is a computer generated invoice.
                    </p>
                 </div>
                 <div className="w-72 space-y-3">
                    <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span className="font-bold">₹{invoice.subtotal.toLocaleString()}</span></div>
                    {invoice.isGST && <div className="flex justify-between text-sm text-slate-500"><span>GST (Total)</span><span className="font-bold">₹{invoice.taxAmount.toLocaleString()}</span></div>}
                    <div className={cn(
                      "flex justify-between text-2xl font-black p-4 rounded-xl mt-4",
                      theme === 'MODERN' ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : "bg-slate-900 text-white"
                    )}>
                       <span>Grand Total</span>
                       <span>₹{invoice.total.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              {/* Watermark */}
              {isKacha && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none rotate-[-30deg] select-none">
                   <h1 className="text-[200px] font-black">ESTIMATE</h1>
                </div>
              )}
           </Card>
        </div>

        <div className="space-y-6 no-print">
           <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2"><QrCode size={20} className="text-orange-400" /> Payment Collection</h3>
              
              <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4">
                 <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <QrCode size={100} className="text-slate-300" />
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan with Any App</p>
                    <p className="text-sm font-black text-slate-900 mt-1">{user?.upiId || 'business@upi'}</p>
                 </div>
              </div>

              <Button variant="secondary" className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/20 text-white border" onClick={() => {
                navigator.clipboard.writeText(upiUrl);
                showToast('Payment link copied!');
              }}>Copy Payment Link</Button>
           </Card>

           <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-blue-600" /> Verified Document</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100">
                    <CheckCircle2 size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Digitally Signed</span>
                 </div>
                 <div className={cn(
                   "flex items-center gap-3 p-3 rounded-xl border",
                   invoice.isGST ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100"
                 )}>
                    {invoice.isGST ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-[11px] font-bold uppercase tracking-wide">
                       {invoice.isGST ? 'GST Compliant Invoice' : 'Non-GST Estimation Bill'}
                    </span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
