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
    products, addProduct, fetchProducts, 
    warehouses, fetchWarehouses, addWarehouse, transferStock,
    showToast 
  } = useStore();
  const { t } = useLanguageStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryTab, setInventoryTab] = useState('Stock'); 
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWhModal, setShowWhModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [barcodeQty, setBarcodeQty] = useState('10');

  useEffect(() => {
    fetchProducts();
    fetchWarehouses('default_shop');
  }, []);

  const handlePrintBarcodes = () => {
    showToast(`${barcodeQty} labels printing...`);
    setShowBarcodeModal(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title={`${t('inventory')} & ${t('godown')}`}
        subtitle="स्टॉक मैनेज करें और गोदामों के बीच ट्रांसफर करें।"
        icon={<Package size={20} />}
        action={
          <div className="flex gap-2">
             <Button variant="secondary" icon={<Home size={16} />} onClick={() => setShowWhModal(true)}>{t('godown')}</Button>
             <Button icon={<PlusCircle size={16} />} onClick={() => setShowAddModal(true)}>{t('addItem')}</Button>
          </div>
        }
      />

      <Tabs tabs={[{id:'Stock',label:t('stockLevel')},{id:'Warehouses',label:t('godown')}]} active={inventoryTab} onChange={setInventoryTab} />

      {inventoryTab === 'Stock' && (
        <Card>
          <div className="p-5 border-b flex justify-between items-center">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="खोजें..." className="w-72" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-slate-50 border-b">
                 <tr>
                    <th className="px-5 py-4 text-left">{t('items')}</th>
                    <th className="px-5 py-4 text-center">{t('stockLevel')}</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {filteredProducts.map(product => (
                   <tr key={product.id || product._id}>
                     <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500 font-mono uppercase">{product.sku || 'NO-SKU'}</p>
                     </td>
                     <td className="px-5 py-4 text-center font-black text-slate-900">{product.stock}</td>
                     <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => { setSelectedProduct(product); setShowBarcodeModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Barcode size={18} />
                           </button>
                           <button onClick={() => { setSelectedProduct(product); setShowTransferModal(true); }} className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 rounded-lg">
                              {t('transfer')}
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
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
