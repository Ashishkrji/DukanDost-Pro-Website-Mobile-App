import { useState } from 'react';
import { PlusCircle, Package, AlertTriangle, IndianRupee, Search, CheckSquare, Square, X, Download, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, SelectField, StatCard, Tabs, EmptyState } from '@/components/ui';
import { PlanGuard } from '@/components/auth/PlanGuard';

export default function Inventory() {
  return (
    <PlanGuard feature="Inventory Management" requiredPlan="Pro">
      <InventoryContent />
    </PlanGuard>
  );
}

function InventoryContent() {
  const { products, addProduct, updateProductStock, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Groceries');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newSku, setNewSku] = useState('');

  // ── Bulk selection ────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkExport = () => {
    const selected = products.filter(p => selectedIds.has(p.id));
    const csv = [
      ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'],
      ...selected.map(p => [p.name, p.sku, p.category, p.price, p.stock, p.status]),
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'inventory_export.csv'; a.click();
    showToast(`${selectedIds.size} items exported!`);
    clearSelection();
  };

  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK').length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  const tabs = [
    { id: 'All', label: 'Sab', count: totalItems },
    { id: 'IN STOCK', label: 'In Stock', count: products.filter(p => p.status === 'IN STOCK').length },
    { id: 'LOW STOCK', label: 'Low Stock', count: products.filter(p => p.status === 'LOW STOCK').length },
    { id: 'OUT OF STOCK', label: 'Out of Stock', count: products.filter(p => p.status === 'OUT OF STOCK').length },
  ];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All' || p.status === activeTab;
    return matchSearch && matchTab;
  });

  const handleAdd = () => {
    if (!newName || !newPrice || !newStock) {
      showToast('Sab fields zaroor bharen!', 'error');
      return;
    }
    addProduct({ name: newName, category: newCategory, price: Number(newPrice), stock: Number(newStock), sku: newSku || 'SKU-' + Date.now() });
    setNewName(''); setNewCategory('Groceries'); setNewPrice(''); setNewStock(''); setNewSku('');
    setShowAddModal(false);
  };

  const handleUpdateStock = (id: string) => {
    if (!editStock) return;
    updateProductStock(id, Number(editStock));
    setEditingProduct(null);
    setEditStock('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Inventory / स्टॉक"
        subtitle="Dukaan ka saara saaman aur stock track karein."
        icon={<Package size={20} />}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => setShowAddModal(true)}>
            Naya Item
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          subtitle="In inventory"
          icon={<Package size={20} />}
          iconBg="bg-blue-50 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Need restocking"
          icon={<AlertTriangle size={20} />}
          iconBg="bg-red-50 text-red-600"
          topBorder="red"
        />
        <StatCard
          title="Total Stock Value"
          value={`₹${totalValue.toLocaleString('en-IN')}`}
          subtitle="Current inventory worth"
          icon={<IndianRupee size={20} />}
          iconBg="bg-green-50 text-green-600"
          topBorder="green"
        />
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Item naam ya SKU se dhundhen..."
              className="sm:w-80"
            />
          </div>
          <Tabs tabs={tabs} active={activeTab} onChange={t => { setActiveTab(t); clearSelection(); }} />
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-orange-700">{selectedIds.size} selected</span>
              <button onClick={clearSelection} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={<Download size={14} />} onClick={handleBulkExport}>Export CSV</Button>
              <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => { showToast(`${selectedIds.size} items removed (simulated)`); clearSelection(); }}>
                Remove Selected
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="Koi Item Nahi Mila"
              description="Search term change karein ya naya item jodhein."
              action={<Button onClick={() => setShowAddModal(true)} icon={<PlusCircle size={16} />}>Add Item</Button>}
            />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-orange-500 transition-colors">
                      {selectedIds.size === filtered.length && filtered.length > 0
                        ? <CheckSquare size={18} className="text-orange-500" />
                        : <Square size={18} />}
                    </button>
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Item</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Category</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Stock</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Status</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
                {filtered.map(product => {
                  const isSelected = selectedIds.has(product.id);
                  return (
                  <tr key={product.id} className={cn('hover:bg-orange-50/20 transition-colors block md:table-row', isSelected && 'bg-orange-50/50')}>
                    {/* Mobile */}
                    <td className="p-4 md:hidden block w-full">
                      <div className="flex gap-3 items-start">
                        <button onClick={() => toggleSelect(product.id)} className="mt-1 shrink-0 text-slate-300 hover:text-orange-500 transition-colors">
                          {isSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                        </button>
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {product.icon || '📦'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              <p className="text-xs text-slate-500">{product.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
                              <StockBadge status={product.status} />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600 font-medium">{product.category}</span>
                            <span className="text-sm font-bold text-slate-900">Qty: {product.stock}</span>
                          </div>
                          {editingProduct === product.id ? (
                            <div className="flex gap-2 mt-3">
                              <input
                                type="number"
                                value={editStock}
                                onChange={e => setEditStock(e.target.value)}
                                placeholder="New stock"
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
                              />
                              <button onClick={() => handleUpdateStock(product.id)} className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold">Update</button>
                              <button onClick={() => setEditingProduct(null)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingProduct(product.id); setEditStock(String(product.stock)); }} className="mt-2 w-full py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                              Update Stock
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Desktop Checkbox */}
                    <td className="px-4 py-4 hidden md:table-cell w-10">
                      <button onClick={() => toggleSelect(product.id)} className="text-slate-300 hover:text-orange-500 transition-colors">
                        {isSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                      </button>
                    </td>

                    {/* Desktop Name */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">
                          {product.icon || '📦'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">{product.category}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-right">
                      <span className="font-mono text-sm font-bold text-slate-900">₹{product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-center">
                      {editingProduct === product.id ? (
                        <div className="flex items-center gap-1 justify-center">
                          <input
                            type="number"
                            value={editStock}
                            onChange={e => setEditStock(e.target.value)}
                            className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:border-orange-400"
                          />
                          <button onClick={() => handleUpdateStock(product.id)} className="px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold">✓</button>
                          <button onClick={() => setEditingProduct(null)} className="px-2 py-1 bg-slate-100 rounded-lg text-xs">✕</button>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">{product.stock}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <StockBadge status={product.status} />
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-right">
                      <button
                        onClick={() => { setEditingProduct(product.id); setEditStock(String(product.stock)); }}
                        className="px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors mr-1"
                      >
                        Edit Stock
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Naya Item Jodhein"
        subtitle="Add to Inventory"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} icon={<PlusCircle size={15} />}>Add Item</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField label="Item Ka Naam" placeholder="e.g. Aashirvaad Atta 5kg" required value={newName} onChange={e => setNewName(e.target.value)} />
          <InputField label="SKU Code" placeholder="SKU-ATT-001" value={newSku} onChange={e => setNewSku(e.target.value)} />
          <SelectField
            label="Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            options={['Groceries', 'Dairy', 'Oils & Ghee', 'Beverages', 'Personal Care', 'Home Care', 'Instant Food', 'Rice & Grains', 'Others'].map(c => ({ value: c, label: c }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Price (₹)" placeholder="245" type="number" required value={newPrice} onChange={e => setNewPrice(e.target.value)} />
            <InputField label="Stock Qty" placeholder="50" type="number" required value={newStock} onChange={e => setNewStock(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  if (status === 'IN STOCK') return <Badge status="success">In Stock</Badge>;
  if (status === 'LOW STOCK') return <Badge status="warning">Low Stock</Badge>;
  return <Badge status="danger">Out of Stock</Badge>;
}
