import { useState, useEffect } from 'react';
import { Tag, PlusCircle, Trash2, Calendar, ShoppingBag, Percent, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, Modal, InputField, SelectField, StatCard } from '@/components/ui';

export default function Coupons() {
  const { coupons, fetchCoupons, addCoupon, deleteCoupon, showToast } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderValue: '0',
    maxDiscount: '',
    expiryDate: '',
    usageLimit: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.value || !formData.expiryDate) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await addCoupon({
        ...formData,
        value: Number(formData.value),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined
      });
      setShowCreateModal(false);
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: '',
        minOrderValue: '0',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: ''
      });
    } catch (err) {
      // Error handled by store
    } finally {
      setLoading(false);
    }
  };

  const activeCoupons = coupons.filter(c => new Date(c.expiryDate) > new Date() && c.isActive);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Discount Coupons"
        subtitle="Apni Digital Dukan ke liye naye offers aur coupons banayein."
        icon={<Tag size={20} />}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => setShowCreateModal(true)}>
            Create Coupon
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Active Coupons" 
          value={activeCoupons.length} 
          icon={<Tag size={18} />} 
          iconBg="bg-green-50 text-green-600" 
          topBorder="green" 
        />
        <StatCard 
          title="Total Coupons" 
          value={coupons.length} 
          icon={<ShoppingBag size={18} />} 
          iconBg="bg-orange-50 text-orange-600" 
          topBorder="orange" 
        />
        <StatCard 
          title="Expiring Soon" 
          value={coupons.filter(c => {
            const diff = new Date(c.expiryDate).getTime() - new Date().getTime();
            return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000);
          }).length} 
          icon={<Calendar size={18} />} 
          iconBg="bg-red-50 text-red-600" 
          topBorder="red" 
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Code & Desc</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Value</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Order</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 tracking-tight">{coupon.code}</span>
                      <span className="text-xs text-slate-400 line-clamp-1">{coupon.description || 'No description'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={coupon.type === 'percentage' ? 'orange' : 'blue'} className="font-bold">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-600">₹{coupon.minOrderValue}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold",
                      new Date(coupon.expiryDate) < new Date() ? "text-red-500" : "text-slate-600"
                    )}>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteCoupon(coupon._id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Tag size={48} className="mb-2" />
                      <p className="font-black">Abhi koi coupons nahi hain</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Naya Coupon Banayein"
        subtitle="Discount Offer for your customers"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <InputField 
            label="Coupon Code" 
            placeholder="E.g. SAVE20" 
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />
          <InputField 
            label="Description" 
            placeholder="Special Diwali Offer" 
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField 
              label="Type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'percentage', label: 'Percentage' },
                { value: 'fixed', label: 'Fixed Amount' }
              ]}
            />
            <InputField 
              label="Value" 
              type="number"
              placeholder={formData.type === 'percentage' ? '10' : '100'} 
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField 
              label="Min Order (₹)" 
              type="number"
              value={formData.minOrderValue}
              onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
            />
            <InputField 
              label="Max Discount (₹)" 
              type="number"
              placeholder="Only for % type"
              value={formData.maxDiscount}
              onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField 
              label="Expiry Date" 
              type="date"
              value={formData.expiryDate}
              onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            <InputField 
              label="Usage Limit" 
              type="number"
              placeholder="Unlimited"
              value={formData.usageLimit}
              onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
