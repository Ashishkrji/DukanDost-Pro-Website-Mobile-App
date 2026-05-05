import { useState, useEffect } from 'react';
import { 
  BarChart3, Download, Calendar, 
  TrendingUp, TrendingDown, Users, 
  ArrowRight, FileText, PieChart,
  Shield, Truck, Search, BookOpen, IndianRupee, Link as LinkIcon, Share2, FileCode, Printer
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button, Badge, Card, PageHeader, StatCard, Tabs, EmptyState, Modal, InputField } from '@/components/ui';
import * as api from '@/services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart as RePieChart, Pie
} from 'recharts';

const COLORS = ['#FF6B00', '#00C853', '#6C3483', '#1A1A2E'];

export default function Reports() {
  const { analytics, fetchAnalytics, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [caLink, setCaLink] = useState('');

  useEffect(() => { fetchAnalytics(); }, []);

  const handleTallyExport = () => {
    window.open('/api/reports/export/tally', '_blank');
    showToast('Tally XML downloading...');
  };

  const handleGenerateCALink = async () => {
    try {
      const res = await api.createCAAccess({ notes: 'Audit Link', accessType: 'READ_ONLY' });
      if (res.success) {
        setCaLink(window.location.origin + res.url);
        showToast('CA Portal link generated!');
      }
    } catch { showToast('CA link fail', 'error'); }
  };

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Sales', label: 'Sales & Profit' },
    { id: 'Compliance', label: 'Tax & CA' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader title="Business Reports" subtitle="Analyze your business performance and tax compliance." icon={<BarChart3 size={20} />} />
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={`₹${(analytics?.pl?.totalSales || 0).toLocaleString()}`} icon={<TrendingUp size={20} />} topBorder="orange" />
            <StatCard title="Net Profit" value={`₹${(analytics?.pl?.netProfit || 0).toLocaleString()}`} icon={<TrendingUp size={20} />} topBorder="green" />
            <StatCard title="GST Liability" value={`₹${(analytics?.pl?.totalTax || 0).toLocaleString()}`} icon={<Shield size={20} />} topBorder="blue" />
            <StatCard title="Customer Recovery" value="82%" icon={<Users size={20} />} topBorder="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="p-6">
                <h3 className="font-bold mb-6">Revenue Growth</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.trends || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Bar dataKey="revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </Card>
             <Card className="p-6">
                <h3 className="font-bold mb-6">Profit Margin</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.trends || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={3} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </Card>
          </div>
        </div>
      )}

      {activeTab === 'Sales' && (
        <Card className="p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Sales Register</h3>
              <Button size="sm" variant="secondary" icon={<Printer size={14} />}>Print Register</Button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-sm">
                 <thead className="bg-slate-50 border-b">
                    <tr><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-right">Sales</th><th className="px-4 py-3 text-right">Profit</th></tr>
                 </thead>
                 <tbody className="divide-y">
                    {analytics.profitability.map((p: any, i: number) => (
                      <tr key={i}>
                         <td className="px-4 py-3 font-bold">{p.name}</td>
                         <td className="px-4 py-3 text-right">₹{p.totalSales.toLocaleString()}</td>
                         <td className="px-4 py-3 text-right text-green-600 font-bold">₹{Math.floor(p.totalSales * 0.15).toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {activeTab === 'Compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="p-6 border-l-4 border-l-blue-600">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileCode size={20} /></div>
                 <h3 className="text-lg font-bold">Tally XML Export</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">Download data for Tally ERP 9 / Prime.</p>
              <Button onClick={handleTallyExport} className="w-full bg-blue-600">Download XML</Button>
           </Card>

           <Card className="p-6 border-l-4 border-l-indigo-600">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Shield size={20} /></div>
                 <h3 className="text-lg font-bold">CA Portal Link</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Secure read-only access for your accountant.</p>
              {!caLink ? (
                <Button onClick={handleGenerateCALink} className="w-full" variant="secondary">Generate Link</Button>
              ) : (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2">
                   <LinkIcon size={14} className="text-indigo-600" />
                   <input readOnly value={caLink} className="bg-transparent text-[10px] font-mono text-indigo-900 flex-1 outline-none" />
                   <Button onClick={() => { navigator.clipboard.writeText(caLink); showToast('Copied!'); }} size="sm" icon={<Share2 size={12} />} />
                </div>
              )}
           </Card>
        </div>
      )}
    </div>
  );
}
