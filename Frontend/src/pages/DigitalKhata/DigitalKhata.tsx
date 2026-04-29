import { useState, useEffect } from 'react';
import {
  PlusCircle, MessageCircle, Phone, ArrowUpRight, ArrowDownRight,
  Search, Download, Send, X, BookOpen, MoreVertical, TrendingUp, TrendingDown,
  Clock, Shield, UserPlus, Filter
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Badge, Card, PageHeader, SearchInput, Modal, 
  InputField, EmptyState, Tabs, SelectField 
} from '@/components/ui';
import * as api from '@/services/api';

export default function DigitalKhata() {
  const { user: authUser } = useAuthStore();
  const { showToast } = useStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalCredit: 0,
    totalReceived: 0,
    remainingBalance: 0,
    pendingCount: 0
  });

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    alternateNumber: '',
    address: '',
    shopName: '',
    gstNumber: '',
    notes: '',
    initialEntry: {
      amount: '',
      transactionType: 'Udhaar Diya',
      description: ''
    }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getKhataCustomers({ search: searchTerm, status: activeTab });
      if (res.success) {
        setCustomers(res.customers);
        
        // Calculate totals for stats
        const totalCredit = res.customers.reduce((acc: number, c: any) => acc + (c.totalCredit || 0), 0);
        const totalReceived = res.customers.reduce((acc: number, c: any) => acc + (c.totalReceived || 0), 0);
        const remainingBalance = res.customers.reduce((acc: number, c: any) => acc + (c.remainingBalance || 0), 0);
        const pendingCount = res.customers.filter((c: any) => c.remainingBalance > 0).length;
        
        setStats({ totalCredit, totalReceived, remainingBalance, pendingCount });
      }
    } catch (error) {
      showToast('Data load karne mein dikkat aayi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, activeTab]);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      showToast('Naam aur Phone zaroor bharein', 'error');
      return;
    }

    // Plan check for Starter
    if (authUser?.plan === 'Starter' && customers.length >= 50) {
      useStore.getState().openUpgradePopup('Pro', 'Unlimited Customers');
      return;
    }

    try {
      const res = await api.createKhataCustomer(newCustomer);
      if (res.success) {
        showToast('Naya grahak safaltapurvak add ho gaya!');
        setShowAddModal(false);
        setNewCustomer({
          name: '', phone: '', alternateNumber: '', address: '',
          shopName: '', gstNumber: '', notes: '',
          initialEntry: { amount: '', transactionType: 'Udhaar Diya', description: '' }
        });
        fetchData();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Grahak add karne mein fail ho gaye', 'error');
    }
  };

  const tabs = [
    { id: 'All', label: 'Sab (All)', count: customers.length },
    { id: 'Udhaar', label: 'Baki (Pending)', count: customers.filter(c => c.remainingBalance > 0).length },
    { id: 'Up-to-date', label: 'Sahi (Paid)', count: customers.filter(c => c.remainingBalance <= 0).length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Digital Khata (खाता)"
        subtitle="Manage customer credit, payments, and full transaction history."
        icon={<BookOpen size={20} className="text-orange-500" />}
        action={
          <Button icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>
            Naya Grahak
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-red-500 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Udhaar Diya</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">₹{stats.totalCredit.toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-red-500 font-bold mt-1">GIVE CREDIT</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-green-500 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Payment Mila</p>
              <h3 className="text-2xl font-black text-slate-900 font-mono">₹{stats.totalReceived.toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-green-500 font-bold mt-1">RECEIVED</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingDown size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-orange-500 bg-orange-50/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Total Baki (Net)</p>
              <h3 className="text-2xl font-black text-orange-600 font-mono">₹{stats.remainingBalance.toLocaleString('en-IN')}</h3>
              <p className="text-[10px] text-orange-500 font-bold mt-1">{stats.pendingCount} CUSTOMERS PENDING</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <BookOpen size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Naam ya mobile number se dhundhen..."
            className="flex-1"
          />
          <Button variant="secondary" className="px-3">
            <Filter size={18} />
          </Button>
        </div>
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </Card>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
              </div>
            </Card>
          ))
        ) : customers.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={<UserPlus size={40} className="text-slate-300" />}
              title="Koi Grahak Nahi Hai"
              description="Apne pehle grahak ka khata yahan se shuru karein."
              action={<Button onClick={() => setShowAddModal(true)}>Naya Grahak Jodhein</Button>}
            />
          </div>
        ) : (
          customers.map((customer) => (
            <Card 
              key={customer._id} 
              className="p-5 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => navigate(`/dashboard/digital-khata/${customer._id}`)}
            >
              {/* Status Indicator */}
              <div className={cn(
                "absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45",
                customer.remainingBalance > 0 ? "bg-red-500" : "bg-green-500"
              )} />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform",
                    customer.color || "bg-slate-100 text-slate-700"
                  )}>
                    {customer.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{customer.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone size={10} /> {customer.phone}
                    </p>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UDHAAR</p>
                  <p className="font-mono font-bold text-slate-700">₹{customer.totalCredit?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RECEIVED</p>
                  <p className="font-mono font-bold text-slate-700">₹{customer.totalReceived?.toLocaleString('en-IN') || 0}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">NET BAKI</p>
                  <p className={cn(
                    "font-mono font-black text-xl",
                    customer.remainingBalance > 0 ? "text-red-600" : "text-green-600"
                  )}>
                    ₹{Math.abs(customer.remainingBalance || 0).toLocaleString('en-IN')}
                    <span className="text-[10px] ml-1 uppercase">
                      {customer.remainingBalance > 0 ? 'Dena' : 'Jama'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${customer.name}, aapka DukanDost bill ₹${customer.remainingBalance} pending hai. Kripya bhugtan karein.`)}`, '_blank');
                    }}
                    className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>

              {customer.lastTransactionDate && (
                <p className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> Last activity: {new Date(customer.lastTransactionDate).toLocaleDateString()}
                </p>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
        subtitle="Digital Khata Registration"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer} icon={<PlusCircle size={15} />}>Add Customer</Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Customer Full Name"
              placeholder="e.g. Rajesh Kumar"
              required
              value={newCustomer.name}
              onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
            <InputField
              label="Mobile Number"
              placeholder="9876543210"
              required
              type="tel"
              value={newCustomer.phone}
              onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Alternate Number (Optional)"
              placeholder="8877665544"
              type="tel"
              value={newCustomer.alternateNumber}
              onChange={e => setNewCustomer({ ...newCustomer, alternateNumber: e.target.value })}
            />
            <InputField
              label="Shop Name (Optional)"
              placeholder="Rajesh General Store"
              value={newCustomer.shopName}
              onChange={e => setNewCustomer({ ...newCustomer, shopName: e.target.value })}
            />
          </div>
          <InputField
            label="Address"
            placeholder="Gali No. 4, Malviya Nagar, Delhi"
            value={newCustomer.address}
            onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="GST Number (Optional)"
              placeholder="07AAAAA0000A1Z5"
              value={newCustomer.gstNumber}
              onChange={e => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
            />
            <InputField
              label="Notes"
              placeholder="Old customer, preferred evening visits"
              value={newCustomer.notes}
              onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })}
            />
          </div>

          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-orange-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Initial Khata Entry</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Transaction Type"
                value={newCustomer.initialEntry.transactionType}
                onChange={e => setNewCustomer({
                  ...newCustomer,
                  initialEntry: { ...newCustomer.initialEntry, transactionType: e.target.value }
                })}
                options={[
                  { value: 'Udhaar Diya', label: 'Udhaar Diya (Credit Given)' },
                  { value: 'Payment Mila', label: 'Payment Mila (Received)' }
                ]}
              />
              <InputField
                label="Initial Amount (₹)"
                placeholder="0.00"
                type="number"
                value={newCustomer.initialEntry.amount}
                onChange={e => setNewCustomer({
                  ...newCustomer,
                  initialEntry: { ...newCustomer.initialEntry, amount: e.target.value }
                })}
              />
            </div>
            <InputField
              label="Description (Optional)"
              placeholder="Monthly stock / Advance payment"
              value={newCustomer.initialEntry.description}
              onChange={e => setNewCustomer({
                ...newCustomer,
                initialEntry: { ...newCustomer.initialEntry, description: e.target.value }
              })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
