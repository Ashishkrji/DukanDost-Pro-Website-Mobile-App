import { useState } from 'react';
import type { ReactNode } from 'react';
import { ShoppingBag, Search, Filter, Package, Clock, CheckCircle, XCircle, Truck, MoreVertical, Share2, Globe, Eye, MessageCircle } from 'lucide-react';
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
             <p className="font-bold">Sahi Orders Manage Karein</p>
             <p className="text-xs">Abhi tak koi naya order nahi aaya hai.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Catalog Preview Cards (Simulated) */}
           <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/20">
              <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
              <p className="font-bold text-slate-900">Digital Catalog Preview</p>
              <p className="text-xs text-slate-500">Grahak ko aisa dikhega aapka store.</p>
              <Button variant="secondary" size="sm" className="w-full mt-4" icon={<Eye size={14} />}>Open Preview</Button>
           </Card>
        </div>
      )}
    </div>
  );
}
