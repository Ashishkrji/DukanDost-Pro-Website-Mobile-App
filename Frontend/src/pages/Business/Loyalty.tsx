import { useState, useEffect } from 'react';
import { 
  Star, Gift, Trophy, Users, 
  ArrowUpRight, Settings, Info, 
  Search, Filter, Download, 
  Award, Heart, Zap
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { 
  Button, Card, Badge, PageHeader, 
  StatCard, SearchInput, EmptyState,
  Modal, InputField
} from '@/components/ui';
import * as api from '@/services/api';

export default function Loyalty() {
  const { showToast, customers } = useStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Filter customers with points
  const loyalCustomers = (customers || [])
    .filter((c: any) => c.loyaltyPoints > 0)
    .sort((a: any, b: any) => b.loyaltyPoints - a.loyaltyPoints);

  const totalPoints = loyalCustomers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);
  const platinumCount = loyalCustomers.filter(c => c.loyaltyTier === 'Platinum').length;
  const goldCount = loyalCustomers.filter(c => c.loyaltyTier === 'Gold').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader 
        title="Loyalty Program" 
        subtitle="Apne loyal grahako ko reward karein aur unka bharosa jeetein." 
        icon={<Star size={20} className="text-orange-600" />}
        action={
          <div className="flex gap-2">
             <Button variant="secondary" icon={<Download size={18} />}>Report</Button>
             <Button icon={<Settings size={18} />} onClick={() => setShowConfigModal(true)}>Settings</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Points Issued" 
          value={totalPoints.toLocaleString()} 
          icon={<Star size={20} />} 
          iconBg="bg-orange-50 text-orange-600" 
        />
        <StatCard 
          title="Loyal Customers" 
          value={loyalCustomers.length.toString()} 
          icon={<Users size={20} />} 
          iconBg="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Platinum Members" 
          value={platinumCount.toString()} 
          icon={<Award size={20} />} 
          iconBg="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          title="Gold Members" 
          value={goldCount.toString()} 
          icon={<Trophy size={20} />} 
          iconBg="bg-yellow-50 text-yellow-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier Info Card */}
        <Card className="lg:col-span-1 p-6 space-y-6">
           <h3 className="font-bold text-slate-900 flex items-center gap-2">
             <Info size={18} className="text-blue-500" /> Tier Benefits
           </h3>
           <div className="space-y-4">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">B</div>
               <div>
                 <p className="text-sm font-bold text-slate-900">Bronze</p>
                 <p className="text-[10px] text-slate-500">0 - 500 Points • Welcome Tier</p>
               </div>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center font-bold text-white">S</div>
               <div>
                 <p className="text-sm font-bold text-slate-900">Silver</p>
                 <p className="text-[10px] text-slate-500">500 - 2000 Points • 2% Extra Discount</p>
               </div>
               <Badge status="info" className="ml-auto">Active</Badge>
             </div>
             <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-white">G</div>
               <div>
                 <p className="text-sm font-bold text-yellow-900">Gold</p>
                 <p className="text-[10px] text-yellow-700">2000 - 5000 Points • Free Delivery</p>
               </div>
             </div>
             <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">P</div>
               <div>
                 <p className="text-sm font-bold text-purple-900">Platinum</p>
                 <p className="text-[10px] text-purple-700">5000+ Points • Priority Support</p>
               </div>
             </div>
           </div>
           
           <div className="pt-4 border-t">
              <p className="text-xs text-slate-500 italic">
                * Points are calculated as 1 Point for every ₹100 spent on any bill.
              </p>
           </div>
        </Card>

        {/* Customer List Card */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
           <div className="p-5 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="font-bold text-slate-900">Top Loyal Customers</h3>
              <div className="w-full md:w-64">
                <SearchInput 
                  placeholder="Search grahak..." 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                />
              </div>
           </div>

           <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                    <th className="px-5 py-4 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest">Tier</th>
                    <th className="px-5 py-4 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest">Points</th>
                    <th className="px-5 py-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-widest">Savings</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loyalCustomers.length > 0 ? loyalCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                             {customer.name[0]}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                             <p className="text-[10px] text-slate-500">{customer.phone}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge 
                          status={
                            customer.loyaltyTier === 'Platinum' ? 'purple' : 
                            customer.loyaltyTier === 'Gold' ? 'warning' : 
                            customer.loyaltyTier === 'Silver' ? 'info' : 'neutral'
                          }
                        >
                          {customer.loyaltyTier}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                           <span className="text-sm font-black text-slate-900">{customer.loyaltyPoints}</span>
                           <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-orange-500 rounded-full" 
                                style={{ width: `${Math.min(100, (customer.loyaltyPoints % 1000) / 10)}%` }} 
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-green-600">
                        ₹{(customer.loyaltyPoints * 0.1).toFixed(0)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="ghost" size="sm" icon={<ArrowUpRight size={16} />} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <EmptyState 
                          title="No loyalty data yet" 
                          description="Jab aap bill banayenge, customers ke points yahan dikhenge." 
                          icon={<Star size={40} className="text-slate-200" />} 
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </Card>
      </div>

      <Modal 
        isOpen={showConfigModal} 
        onClose={() => setShowConfigModal(false)} 
        title="Loyalty Program Settings"
      >
        <div className="space-y-6">
           <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-4">
              <Zap size={20} className="text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-orange-900">Earning Rule</p>
                <p className="text-xs text-orange-700 mt-1">Har ₹100 ki kharidari par customer ko 1 point milega.</p>
              </div>
           </div>

           <div className="space-y-4">
              <InputField 
                label="Points per ₹100 Spent" 
                type="number" 
                defaultValue="1" 
                placeholder="1"
              />
              <InputField 
                label="Minimum Points to Redeem" 
                type="number" 
                defaultValue="100" 
                placeholder="100"
              />
              <InputField 
                label="Point Value (in ₹)" 
                type="number" 
                defaultValue="0.10" 
                placeholder="0.10"
              />
           </div>

           <Button className="w-full h-12" onClick={() => {
             showToast('Settings saved successfully!');
             setShowConfigModal(false);
           }}>Save Configuration</Button>
        </div>
      </Modal>
    </div>
  );
}
