import { useState } from 'react';
import { Gift, PlusCircle, Copy, Pause, Play, Trash2, Tag, Percent } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, Modal, InputField, SelectField, StatCard } from '@/components/ui';

export default function Vouchers() {
  const { vouchers, addVoucher, toggleVoucherStatus, showToast } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'flat'>('percentage');
  const [newMinOrder, setNewMinOrder] = useState('');
  const [newLimit, setNewLimit] = useState('100');
  const [newExpiry, setNewExpiry] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const activeVouchers = vouchers.filter(v => v.status === 'Active');
  const totalUsed = vouchers.reduce((s, v) => s + v.used, 0);
  const totalLimit = vouchers.reduce((s, v) => s + v.limit, 0);

  const handleCreate = () => {
    if (!newCode || !newDiscount) {
      showToast('Code aur discount zaroor bharen!', 'error');
      return;
    }
    addVoucher({
      code: newCode.toUpperCase(),
      discount: Number(newDiscount),
      type: newType,
      minOrder: Number(newMinOrder) || 0,
      maxDiscount: newType === 'percentage' ? Number(newDiscount) * 5 : Number(newDiscount),
      limit: Number(newLimit) || 100,
      expiry: newExpiry || 'No Expiry',
      description: newDesc || `${newDiscount}${newType === 'percentage' ? '%' : '₹'} off on orders`,
    });
    setNewCode(''); setNewDiscount(''); setNewMinOrder(''); setNewLimit('100'); setNewExpiry(''); setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Vouchers & Offers"
        subtitle="Discount codes aur promotional offers manage karein."
        icon={<Gift size={20} />}
        action={<Button icon={<PlusCircle size={16} />} onClick={() => setShowCreateModal(true)}>Create Voucher</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Active Vouchers" value={activeVouchers.length} icon={<Tag size={18} />} iconBg="bg-green-50 text-green-600" topBorder="green" />
        <StatCard title="Total Redemptions" value={totalUsed} subtitle={`of ${totalLimit} total`} icon={<Percent size={18} />} iconBg="bg-orange-50 text-orange-600" topBorder="orange" />
        <StatCard title="Total Vouchers" value={vouchers.length} subtitle="All time" icon={<Gift size={18} />} iconBg="bg-purple-50 text-purple-600" topBorder="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map(voucher => (
          <Card key={voucher.id} className="p-5 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-xl font-bold text-slate-900 tracking-widest">{voucher.code}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(voucher.code); showToast('Code copied!'); }}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">{voucher.description}</p>
                </div>
                <Badge status={voucher.status === 'Active' ? 'success' : voucher.status === 'Paused' ? 'warning' : 'neutral'} dot>
                  {voucher.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white px-4 py-2 rounded-xl text-center">
                  <span className="font-display text-2xl font-bold">
                    {voucher.type === 'percentage' ? `${voucher.discount}% OFF` : `₹${voucher.discount} OFF`}
                  </span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Min order: <span className="font-semibold">₹{voucher.minOrder}</span></p>
                  <p>Expires: <span className="font-semibold text-xs">{voucher.expiry}</span></p>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Used</span>
                  <span>{voucher.used}/{voucher.limit}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] rounded-full transition-all"
                    style={{ width: `${(voucher.used / voucher.limit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {voucher.status !== 'Expired' && (
                  <button
                    onClick={() => toggleVoucherStatus(voucher.id)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors',
                      voucher.status === 'Active'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    )}
                  >
                    {voucher.status === 'Active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Activate</>}
                  </button>
                )}
                <button
                  onClick={() => showToast('Voucher shared to WhatsApp!')}
                  className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Voucher Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Naya Voucher Banayein"
        subtitle="Create Discount Voucher"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} icon={<Gift size={15} />}>Create Voucher</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField label="Voucher Code" placeholder="DIWALI25" required value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} />
          <SelectField
            label="Discount Type"
            value={newType}
            onChange={e => setNewType(e.target.value as 'percentage' | 'flat')}
            options={[{ value: 'percentage', label: 'Percentage (%)' }, { value: 'flat', label: 'Flat Amount (₹)' }]}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Discount Value" placeholder={newType === 'percentage' ? '25' : '100'} type="number" required value={newDiscount} onChange={e => setNewDiscount(e.target.value)} />
            <InputField label="Min Order (₹)" placeholder="500" type="number" value={newMinOrder} onChange={e => setNewMinOrder(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Usage Limit" placeholder="100" type="number" value={newLimit} onChange={e => setNewLimit(e.target.value)} />
            <InputField label="Expiry Date" type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} />
          </div>
          <InputField label="Description" placeholder="Describe this voucher..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
