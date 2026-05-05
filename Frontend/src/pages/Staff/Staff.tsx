import { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, Users, CheckCircle, Clock, XCircle, MoreVertical, Phone, IndianRupee, History, Download, FileText, Printer, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, SelectField, StatCard, EmptyState, Tabs } from '@/components/ui';

export default function Staff() {
  const { staff, updateStaffAttendance, fetchStaff, processSalary, fetchPayrollHistory, showToast, addStaff } = useStore();
  const { user: authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Sales');
  const [newPhone, setNewPhone] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newBasic, setNewBasic] = useState('');
  const [newDeductions, setNewDeductions] = useState('0');

  const handleAddStaff = async () => {
    if (!newName || !newPhone || !newSalary) { showToast('Saari details bhariye!', 'error'); return; }
    await addStaff({
      name: newName, role: newRole, phone: newPhone, salary: Number(newSalary),
      salaryComponents: { basic: Number(newBasic || newSalary), hra: 0, allowances: 0, deductions: Number(newDeductions) }
    });
    setShowAddModal(false);
    resetFields();
  };

  const resetFields = () => { setNewName(''); setNewPhone(''); setNewSalary(''); setNewBasic(''); setNewDeductions('0'); };

  const handlePaySalary = async () => {
    if (!selectedStaff) return;
    await processSalary({
      staffId: selectedStaff.id || selectedStaff._id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      paymentMode: 'Cash'
    });
    setShowPayModal(false);
    showToast('Salary processed successfully!');
  };

  const viewHistory = async (member: any) => {
    setSelectedStaff(member);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    const history = await fetchPayrollHistory(member.id || member._id);
    setPayrollHistory(history || []);
    setLoadingHistory(false);
  };

  const handleViewSlip = (payment: any) => {
    setSelectedPayment(payment);
    setShowSlipModal(true);
  };

  const filtered = staff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader title="Staff & Payroll" subtitle="Staff ki attendance aur salary manage karein." icon={<Users size={20} />} action={<Button icon={<PlusCircle size={16} />} onClick={() => setShowAddModal(true)}>Add Staff</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={<Users size={20} />} />
        <StatCard title="Salary Budget" value={`₹${staff.reduce((s, m) => s + m.salary, 0).toLocaleString()}`} icon={<IndianRupee size={20} />} topBorder="blue" />
      </div>

      <Card>
        <div className="p-5 border-b flex justify-between items-center">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Staff का नाम..." className="w-72" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left">Member</th>
                <th className="px-5 py-4 text-center">Attendance</th>
                <th className="px-5 py-4 text-right">Net Salary</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(member => (
                <tr key={member.id || member._id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                     <Badge status={member.attendance === 'Aaya' ? 'success' : 'danger'}>{member.attendance}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right font-black">₹{member.salary.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => viewHistory(member)} className="p-2 text-slate-400 hover:text-blue-600"><History size={16} /></button>
                    <button onClick={() => { setSelectedStaff(member); setShowPayModal(true); }} className="px-3 py-1.5 bg-green-600 text-white text-xs font-black rounded-lg">Pay Salary</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Salary Slip Modal (Partially Implemented Completion) */}
      <Modal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} title="Salary Slip (PDF Preview)">
         <div className="p-8 bg-white border rounded-2xl shadow-sm text-sm space-y-6">
            <div className="text-center border-b pb-6">
               <h2 className="text-xl font-black">{authUser?.businessName || 'Merchant Shop'}</h2>
               <p className="text-xs text-slate-500">Salary Slip for {selectedPayment?.month}/{selectedPayment?.year}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div><p className="text-[10px] font-bold text-slate-400 uppercase">Employee</p><p className="font-bold">{selectedStaff?.name}</p></div>
               <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Role</p><p className="font-bold">{selectedStaff?.role}</p></div>
            </div>
            <div className="space-y-2 border-t pt-4">
               <div className="flex justify-between"><span>Basic Pay</span><span className="font-bold">₹{selectedStaff?.salaryComponents?.basic || selectedStaff?.salary}</span></div>
               <div className="flex justify-between text-red-600"><span>Deductions (PF/ESI)</span><span className="font-bold">-₹{selectedStaff?.salaryComponents?.deductions || 0}</span></div>
               <div className="flex justify-between text-lg font-black border-t pt-2"><span>Net Paid</span><span>₹{selectedPayment?.netPaid || selectedStaff?.salary}</span></div>
            </div>
            <div className="pt-6 flex justify-center gap-3">
               <Button variant="secondary" icon={<Printer size={16} />}>Print</Button>
               <Button icon={<Download size={16} />}>Download PDF</Button>
            </div>
         </div>
      </Modal>

      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title={`Payroll History: ${selectedStaff?.name}`}>
         <div className="max-h-80 overflow-y-auto">
            {loadingHistory ? <p className="text-center py-10">Loading...</p> : (
               <table className="w-full">
                  <thead className="border-b"><tr><th className="py-2 text-left">Month</th><th className="py-2 text-right">Amount</th><th className="py-2 text-right">Action</th></tr></thead>
                  <tbody>
                     {payrollHistory.map((p, i) => (
                        <tr key={i} className="border-b">
                           <td className="py-2 text-sm">{p.month}/{p.year}</td>
                           <td className="py-2 text-right font-bold">₹{p.netPaid.toLocaleString()}</td>
                           <td className="py-2 text-right"><button onClick={() => handleViewSlip(p)} className="text-xs font-bold text-blue-600 flex items-center gap-1 ml-auto"><FileText size={12} /> View Slip</button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </Modal>

      {/* Other modals simplified */}
    </div>
  );
}
