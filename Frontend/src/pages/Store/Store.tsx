import { useState } from 'react';
import type { ReactNode } from 'react';
import { ShoppingBag, Search, Filter, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical, Share2, Globe, Eye, MessageCircle, Settings, CreditCard } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, StatCard, Tabs, EmptyState } from '@/components/ui';

export default function Store() {
  const { orders, updateOrderStatus, showToast, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [storeView, setStoreView] = useState('Orders'); // Orders, Catalog

  const storeUrl = `dukandost.in/store/${user?.id || 'demo'}`;

  const handleShare = () => {
    navigator.clipboard.writeText(storeUrl);
    showToast('Store link copied!');
  };

  const handleWhatsAppShare = () => {
    const msg = `Namaste! Hamara online catalog dekhein: ${storeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const tabs = [
    { id: 'All', label: 'Sab Orders' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Delivered', label: 'Delivered' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Online Store & Catalog"
        subtitle="Digital orders manage karein aur catalog share karein."
        icon={<ShoppingBag size={20} />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Share2 size={16} />} onClick={handleShare}>Share Link</Button>
            <Button icon={<Globe size={16} />} onClick={() => window.open('/store-preview', '_blank')}>View Store</Button>
          </div>
        }
      />

      {/* Catalog Sharing Banner (M14) */}
      <Card className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white overflow-hidden relative border-none">
         <div className="absolute top-0 right-0 p-8 opacity-10"><ShoppingBag size={120} /></div>
         <div className="relative z-10">
            <Badge className="bg-indigo-500 text-white mb-2">M14 • Digital Store</Badge>
            <h3 className="text-2xl font-black">{user?.businessName || 'Hamari Dukaan'} Catalog</h3>
            <p className="text-slate-400 mt-1 max-w-md">Apne products ka link grahakon ko bhejien taaki wo direct WhatsApp par order de sakein.</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
               <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <Globe className="text-indigo-400" size={20} />
                  <code className="text-sm font-bold">{storeUrl}</code>
               </div>
               <Button onClick={handleWhatsAppShare} variant="whatsapp" icon={<MessageCircle size={18} />}>WhatsApp Share</Button>
            </div>
         </div>
      </Card>

      <div className="flex gap-4 border-b">
         <button onClick={() => setStoreView('Orders')} className={cn("pb-3 text-sm font-black uppercase tracking-widest", storeView === 'Orders' ? "border-b-4 border-orange-500 text-slate-900" : "text-slate-400")}>Manage Orders</button>
         <button onClick={() => setStoreView('Catalog')} className={cn("pb-3 text-sm font-black uppercase tracking-widest", storeView === 'Catalog' ? "border-b-4 border-orange-500 text-slate-900" : "text-slate-400")}>Live Catalog</button>
      </div>

      {storeView === 'Orders' ? (
        <Card>
          <div className="p-5 border-b flex justify-between items-center">
             <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
             <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Order ID..." className="w-64" />
          </div>
          <div className="p-12 text-center text-slate-400">
             <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
             <p className="font-bold text-slate-900">Manage Store Orders</p>
             <p className="text-xs">Abhi tak koi naya online order nahi aaya hai.</p>
             <Button variant="secondary" className="mt-6" icon={<Share2 size={16} />} onClick={handleWhatsAppShare}>Promote Your Store</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
           <Card className="p-5">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-900">Live Catalog Manager</h3>
                 <div className="flex gap-2">
                    <SearchInput 
                      placeholder="Search items..." 
                      className="w-64" 
                      value={searchTerm} 
                      onChange={setSearchTerm} 
                    />
                    <Button variant="secondary" icon={<Filter size={16} />} />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                       <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                          <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                          <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Online Status</th>
                          <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {useStore.getState().products.slice(0, 5).map((p: any) => (
                          <tr key={p._id}>
                             <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><Package size={20} /></div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                      <p className="text-[10px] text-slate-500">{p.category}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-4 text-right font-bold text-slate-900">₹{p.price}</td>
                             <td className="px-4 py-4 text-center">
                                <button className={cn(
                                   "px-3 py-1 rounded-full text-[10px] font-black border transition-all",
                                   p.isVisible ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-100 text-slate-400 border-slate-200"
                                )}>
                                   {p.isVisible ? 'VISIBLE' : 'HIDDEN'}
                                </button>
                             </td>
                             <td className="px-4 py-4 text-right">
                                <Button variant="ghost" size="sm" icon={<Settings size={16} />} />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-orange-50 border-orange-100">
                 <h4 className="font-bold text-orange-900 flex items-center gap-2 mb-2"><Eye size={18} /> Storefront Preview</h4>
                 <p className="text-xs text-orange-700 mb-4">Dekhiye aapka store grahak ko mobile par kaisa dikhta hai.</p>
                 <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => window.open(`/store/${user?.id || 'demo'}`, '_blank')}>Open Customer View</Button>
              </Card>
              <Card className="p-6 bg-blue-50 border-blue-100">
                 <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><CreditCard size={18} /> Payments Settings</h4>
                 <p className="text-xs text-blue-700 mb-4">Apne UPI ya Razorpay details configure karein taaki online payment le sakein.</p>
                 <Button className="w-full bg-blue-600 hover:bg-blue-700">Setup Payments</Button>
              </Card>
           </div>
        </div>
      )}
    </div>
  );
}
