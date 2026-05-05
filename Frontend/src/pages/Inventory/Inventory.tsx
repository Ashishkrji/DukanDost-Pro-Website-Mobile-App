import { useState, useEffect } from 'react';
import { PlusCircle, Package, AlertTriangle, IndianRupee, Search, CheckSquare, Square, X, Download, Trash2, Clock, Truck, Home, Barcode, Printer } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, SelectField, StatCard, Tabs, EmptyState } from '@/components/ui';
import { PlanGuard } from '@/components/auth/PlanGuard';
import { useLanguageStore } from '@/store/languageStore';

export default function Inventory() {
  return (
    <PlanGuard feature="Inventory Management" requiredPlan="Pro">
      <InventoryContent />
    </PlanGuard>
  );
}

function InventoryContent() {
  const { 
    products, fetchProducts, 
    warehouses, fetchWarehouses,
    showToast 
  } = useStore();
  const { t } = useLanguageStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryTab, setInventoryTab] = useState('Stock'); 
  const [filter, setFilter] = useState<'all' | 'low' | 'expiry'>('all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWhModal, setShowWhModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [barcodeQty, setBarcodeQty] = useState('10');
  const [stockStats, setStockStats] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchWarehouses('default_shop');
    loadStockStats();
  }, []);

  const loadStockStats = async () => {
    const { fetchStockValue } = useStore.getState();
    const stats = await fetchStockValue();
    setStockStats(stats);
  };

  const handlePrintBarcodes = () => {
    showToast(`${barcodeQty} labels printing...`);
    setShowBarcodeModal(false);
  };

  const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5) && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * (p.price || 0)), 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'low') return matchesSearch && p.stock <= (p.minStock || 5);
    if (filter === 'expiry') return matchesSearch && p.batches?.some((b: any) => b.expiryDate && new Date(b.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title={`${t('inventory')} Dashboard`}
        subtitle="Manage your stock levels, godowns, and track product lifecycles."
        icon={<Package size={20} className="text-blue-600" />}
        action={
          <div className="flex gap-2">
             <Button variant="secondary" icon={<Home size={16} />} onClick={() => setShowWhModal(true)}>{t('godown')}</Button>
             <Button className="bg-[#FF6B00] hover:bg-[#E56000]" icon={<PlusCircle size={16} />} onClick={() => setShowAddModal(true)}>{t('addItem')}</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard 
            title="Total Stock Value" 
            value={`₹${(stockStats?.totalStockValue || totalStockValue).toLocaleString()}`} 
            icon={<IndianRupee size={20} />} 
            topBorder="blue" 
            subtitle="Based on Cost Price"
         />
         <StatCard 
            title="Total Quantity" 
            value={(stockStats?.totalStockQty || products.reduce((acc, p) => acc + p.stock, 0)).toString()} 
            icon={<Package size={20} />} 
            topBorder="indigo" 
            subtitle="Units in Hand"
         />
         <StatCard 
            title="Low Stock Alert" 
            value={lowStockProducts.length.toString()} 
            icon={<AlertTriangle size={20} />} 
            topBorder="orange" 
            subtitle={`${outOfStockProducts.length} Out of Stock`}
         />
         <StatCard 
            title="Total Products" 
            value={products.length.toString()} 
            icon={<Package size={20} />} 
            topBorder="purple" 
            subtitle="Active SKUs in system"
         />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <Tabs 
            tabs={[
               {id:'Stock', label:'Live Inventory'},
               {id:'Warehouses', label:'Warehouse/Godown'}
            ]} 
            active={inventoryTab} 
            onChange={setInventoryTab} 
         />
         
         <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
               onClick={() => setFilter('all')}
               className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", filter === 'all' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50")}
            >
               All
            </button>
            <button 
               onClick={() => setFilter('low')}
               className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", filter === 'low' ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-orange-50")}
            >
               Low Stock
            </button>
            <button 
               onClick={() => setFilter('expiry')}
               className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", filter === 'expiry' ? "bg-red-500 text-white" : "text-slate-500 hover:bg-red-50")}
            >
               Expiry Soon
            </button>
         </div>
      </div>

      {inventoryTab === 'Stock' && (
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="p-5 border-b flex justify-between items-center bg-white">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="खोजें (नाम या SKU)..." className="w-80" />
            <div className="flex gap-2">
               <Button size="sm" variant="secondary" icon={<Download size={14} />}>Export CSV</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b">
                 <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('items')}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('stockLevel')}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredProducts.map(product => {
                    const isLow = product.stock <= (product.minStock || 5);
                    return (
                      <tr key={product.id || product._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{product.icon || '📦'}</div>
                              <div>
                                 <p className="font-black text-slate-900">{product.name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{product.sku || 'NO-SKU'}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <Badge status="neutral" className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] uppercase">{product.category}</Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex flex-col items-center">
                              <span className={cn("text-sm font-black", isLow ? "text-orange-600" : "text-slate-900")}>
                                 {product.stock} {product.unit}
                              </span>
                              {isLow && <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Low Stock</span>}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">₹{(product.price || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => { setSelectedProduct(product); setShowBarcodeModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print Labels">
                                 <Barcode size={18} />
                              </button>
                              <button onClick={() => { setSelectedProduct(product); setShowTransferModal(true); }} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                 {t('transfer')}
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                 })}
                 {filteredProducts.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-20 text-center">
                        <EmptyState 
                           icon={<Search size={40} className="text-slate-200" />}
                           title="No Products Found"
                           description="Try adjusting your filters or search term."
                        />
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Barcode Modal (simplified for logic) */}
      <Modal isOpen={showBarcodeModal} onClose={() => setShowBarcodeModal(false)} title={t('sku')}>
         <div className="p-4 text-center space-y-4">
            <Barcode size={48} className="mx-auto text-slate-400" />
            <p className="text-sm font-bold">{selectedProduct?.name} Label Print</p>
            <Button onClick={handlePrintBarcodes} className="w-full">Print Now</Button>
         </div>
      </Modal>
    </div>
  );
}
