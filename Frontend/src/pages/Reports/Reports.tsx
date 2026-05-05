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
    { id: 'Products', label: 'Product Insights' },
    { id: 'Sales', label: 'Customer Top 10' },
    { id: 'Compliance', label: 'Tax & Compliance' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader 
        title="Business Intelligence Dashboard" 
        subtitle="Analyze your business performance with pro-level data insights." 
        icon={<BarChart3 size={20} className="text-orange-600" />} 
      />
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={`₹${(analytics?.pl?.totalSales || 0).toLocaleString()}`} icon={<TrendingUp size={20} />} topBorder="orange" />
            <StatCard title="Net Profit (Estimated)" value={`₹${(analytics?.pl?.netProfit || 0).toLocaleString()}`} icon={<TrendingUp size={20} />} topBorder="green" />
            <StatCard title="GST Liability" value={`₹${(analytics?.pl?.totalTax || 0).toLocaleString()}`} icon={<Shield size={20} />} topBorder="blue" />
            <StatCard title="Customer Recovery" value="82%" icon={<Users size={20} />} topBorder="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                   <TrendingUp size={18} className="text-orange-500" /> Revenue Growth (Daily)
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.trends || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} />
                         <YAxis axisLine={false} tickLine={false} />
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                         <Bar dataKey="revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </Card>
             <Card className="p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                   <Users size={18} className="text-blue-500" /> Customer Segment Recovery
                </h3>
                <div className="h-64 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                         <Pie
                            data={[
                               { name: 'Regular', value: 70 },
                               { name: 'Occasional', value: 20 },
                               { name: 'New', value: 10 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {[0, 1, 2].map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip />
                      </RePieChart>
                   </ResponsiveContainer>
                </div>
             </Card>
          </div>
        </div>
      )}

      {activeTab === 'Products' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                 <h3 className="font-bold mb-6 flex items-center gap-2">
                    <Package size={18} className="text-purple-600" /> Top Selling Products (By Revenue)
                 </h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={analytics.topProducts || []} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                          <XAxis type="number" axisLine={false} tickLine={false} />
                          <YAxis dataKey="_id" type="category" width={100} axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="totalRevenue" fill="#6C3483" radius={[0, 4, 4, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <Card className="p-6">
                 <h3 className="font-bold mb-6">Inventory Value</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                       <p className="text-xs text-slate-500 uppercase font-black">Stock Asset Value</p>
                       <h4 className="text-2xl font-black text-slate-900 mt-1">₹4,25,000</h4>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                       <p className="text-xs text-orange-600 uppercase font-black">Estimated Profit Potential</p>
                       <h4 className="text-2xl font-black text-orange-700 mt-1">₹85,000</h4>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t">
                    <h5 className="text-sm font-bold mb-3">Reorder Recommendations</h5>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-bold">Parle-G Gold</span>
                          <Badge status="warning">Low Stock</Badge>
                       </div>
                       <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-bold">Maggi 12pk</span>
                          <Badge status="danger">Critical</Badge>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      )}

      {activeTab === 'Sales' && (
        <Card className="p-0 overflow-hidden">
           <div className="p-6 border-b flex justify-between items-center bg-white">
              <div>
                 <h3 className="font-bold text-slate-900">Customer Lifetime Value (CLV)</h3>
                 <p className="text-xs text-slate-500">Highest revenue contribution by customers.</p>
              </div>
              <Button size="sm" variant="secondary" icon={<Download size={14} />}>Export List</Button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-slate-50 border-b">
                    <tr>
                       <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grahak</th>
                       <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</th>
                       <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales</th>
                       <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Bill</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {(analytics.profitability || []).map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                  {p.name[0]}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                  <p className="text-[10px] text-slate-400">{p.phone}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center font-bold text-slate-600">{p.transactionCount}</td>
                         <td className="px-6 py-4 text-right font-black text-slate-900">₹{p.totalSales.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right text-green-600 font-bold">₹{Math.floor(p.totalSales / (p.transactionCount || 1)).toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      )}

      {activeTab === 'Compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="p-8 border-l-4 border-l-blue-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><FileCode size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Tally ERP/Prime</h3>
                    <p className="text-sm text-slate-500">Professional accounting export.</p>
                 </div>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                 Apne poore data ko Tally compatible XML format mein export karein aur direct apne accountant ko bhejein.
              </p>
              <Button onClick={handleTallyExport} className="w-full h-14 bg-blue-600 shadow-lg shadow-blue-600/20 rounded-2xl font-black uppercase tracking-widest text-xs">
                 Download Tally XML
              </Button>
           </Card>

           <Card className="p-8 border-l-4 border-l-indigo-600 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Shield size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Digital Audit Portal</h3>
                    <p className="text-sm text-slate-500">Read-only CA access.</p>
                 </div>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                 Apne CA ko ek secure link bhejein jisse wo aapka business data online audit kar sakein, bina physical documents ke.
              </p>
              {!caLink ? (
                <Button onClick={handleGenerateCALink} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" variant="secondary">
                   Generate Accountant Access
                </Button>
              ) : (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                   <LinkIcon size={16} className="text-indigo-600" />
                   <input readOnly value={caLink} className="bg-transparent text-xs font-mono text-indigo-900 flex-1 outline-none" />
                   <Button onClick={() => { navigator.clipboard.writeText(caLink); showToast('Copied to clipboard!'); }} size="sm" icon={<Share2 size={14} />} />
                </div>
              )}
           </Card>
        </div>
      )}
    </div>
  );
}
