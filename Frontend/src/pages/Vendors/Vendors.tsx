import { useState, useEffect } from 'react';
import { 
  PlusCircle, Phone, Search, Download, Trash2, X, 
  Truck, Mail, MapPin, Landmark 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Badge, Card, PageHeader, SearchInput, 
  Modal, InputField, EmptyState, StatCard 
} from '@/components/ui';

export default function Vendors() {
  const { vendors, fetchVendors, addVendor, showToast } = useStore();
  const { user: authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGst, setNewGst] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const filtered = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.phone.includes(searchTerm)
  );

  const totalDena = vendors.reduce((s, v) => s + v.balance, 0);

  const handleAddVendor = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Naam aur phone zaroor bharen!', 'error');
      return;
    }

    await addVendor({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      gstNumber: newGst.trim()
    });

    setNewName(''); setNewPhone(''); setNewEmail(''); setNewAddress(''); setNewGst('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Vendor Khata (सप्लायर)"
        subtitle="Apne suppliers aur vendors ka hisab-kitab manage karein."
        icon={<Truck size={20} />}
        action={
          <Button icon={<PlusCircle size={18} />} onClick={() => setShowAddModal(true)}>
            Naya Vendor
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Vendors"
          value={vendors.length}
          subtitle="Registered suppliers"
          icon={<Truck size={20} />}
          iconBg="bg-blue-50 text-blue-600"
          topBorder="blue"
        />
        <StatCard
          title="Aapko Dene Hain"
          value={`₹${totalDena.toLocaleString('en-IN')}`}
          subtitle="Total Payable Balance"
          icon={<Landmark size={20} />}
          iconBg="bg-red-50 text-red-600"
          topBorder="red"
        />
        <StatCard
          title="Active Orders"
          value="0"
          subtitle="Pending deliveries"
          icon={<Package size={20} />}
          iconBg="bg-green-50 text-green-600"
          topBorder="green"
        />
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Vendor naam ya phone se dhundhen..."
            className="sm:w-80"
          />
          <Button variant="secondary" size="sm" onClick={() => showToast('Vendor list exported!')}>
            <Download size={14} /> Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="Koi Vendor Nahi Mila"
              description={searchTerm ? `"${searchTerm}" se koi match nahi mila.` : 'Abhi tak koi vendor nahi hai.'}
              action={<Button onClick={() => setShowAddModal(true)} icon={<PlusCircle size={16} />}>Naya Vendor Jodhein</Button>}
            />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Vendor</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Phone</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">GSTIN</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
                {filtered.map(vendor => (
                  <tr
                    key={vendor._id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer block md:table-row"
                    onClick={() => navigate(`/vendors/${vendor._id}`)}
                  >
                    <td className="px-5 py-4 block md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {vendor.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{vendor.name}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin size={10} /> {vendor.address || 'No address'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 block md:table-cell text-sm text-slate-600 font-medium">
                      {vendor.phone}
                    </td>
                    <td className="px-5 py-4 block md:table-cell text-sm text-slate-500">
                      {vendor.gstNumber || 'N/A'}
                    </td>
                    <td className="px-5 py-4 block md:table-cell text-right">
                      <span className={cn(
                        "font-mono text-sm font-bold",
                        vendor.balance > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        ₹{vendor.balance.toLocaleString('en-IN')}
                      </span>
                      {vendor.balance > 0 && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">DENA HAI</p>
                      )}
                    </td>
                    <td className="px-5 py-4 block md:table-cell text-center">
                       <Button variant="secondary" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Naya Vendor Jodhein"
        subtitle="Add Supplier to Khata"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddVendor} icon={<PlusCircle size={15} />}>Add Vendor</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField label="Vendor Name" placeholder="e.g. Laxmi Enterprises" required value={newName} onChange={e => setNewName(e.target.value)} />
          <InputField label="Phone Number" placeholder="+91 98765 43210" required type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          <InputField label="Email (Optional)" placeholder="vendor@example.com" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <InputField label="Address" placeholder="Warehouse address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
          <InputField label="GST Number" placeholder="22AAAAA0000A1Z5" value={newGst} onChange={e => setNewGst(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

function Package(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4 7.5 4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
