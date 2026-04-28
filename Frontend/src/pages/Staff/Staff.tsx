import { useState } from 'react';
import { PlusCircle, Search, Filter, Users, CheckCircle, Clock, XCircle, MoreVertical, Phone, IndianRupee } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, InputField, SelectField, StatCard, EmptyState } from '@/components/ui';

export default function Staff() {
  const { staff, updateStaffAttendance, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Cashier');
  const [newPhone, setNewPhone] = useState('');
  const [newSalary, setNewSalary] = useState('');

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = staff.filter(s => s.attendance === 'Aaya').length;
  const absentCount = staff.filter(s => s.attendance === 'Nahi Aaya').length;
  const pendingCount = staff.filter(s => s.attendance === 'Pending').length;
  const totalSalary = staff.reduce((s, m) => s + m.salary, 0);

  const attendanceColors = {
    'Aaya': 'bg-green-100 text-green-700',
    'Nahi Aaya': 'bg-red-100 text-red-700',
    'Pending': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Staff Management"
        subtitle="Staff ki haaziri aur salary manage karein."
        icon={<Users size={20} />}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => setShowAddModal(true)}>
            Add Staff
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={<Users size={20} />} iconBg="bg-slate-100 text-slate-600" subtitle="Members" />
        <StatCard title="Present Today" value={presentCount} icon={<CheckCircle size={20} />} iconBg="bg-green-100 text-green-600" topBorder="green" />
        <StatCard title="Absent" value={absentCount} icon={<XCircle size={20} />} iconBg="bg-red-100 text-red-600" topBorder="red" />
        <StatCard title="Monthly Salaries" value={`₹${totalSalary.toLocaleString('en-IN')}`} icon={<IndianRupee size={20} />} iconBg="bg-blue-100 text-blue-600" topBorder="blue" />
      </div>

      <Card>
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Staff ka naam ya role..." className="sm:w-72" />
          <Button variant="secondary" size="sm" onClick={() => showToast('Attendance marked for all!')}>
            Mark All Present
          </Button>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon={<Users size={28} />} title="Koi Staff Nahi Mila" description="Search change karein." />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100 hidden md:table-header-group">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Staff Member</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Phone</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">Status</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Attendance</th>
                  <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 block md:table-row-group">
                {filtered.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors block md:table-row">
                    {/* Mobile */}
                    <td className="p-4 md:hidden block w-full">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                          {member.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {member.phone}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-slate-900">₹{member.salary.toLocaleString('en-IN')}</p>
                              <p className="text-[10px] text-slate-500">/ month</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            {(['Aaya', 'Nahi Aaya', 'Pending'] as const).map(att => (
                              <button
                                key={att}
                                onClick={() => updateStaffAttendance(member.id, att)}
                                className={cn(
                                  'flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all',
                                  member.attendance === att
                                    ? attendanceColors[att] + ' border-current'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                )}
                              >
                                {att === 'Aaya' ? '✓ Aaya' : att === 'Nahi Aaya' ? '✕ Absent' : '? Pending'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Desktop */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center font-bold text-slate-700 text-sm">
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{member.name}</p>
                          <span className="text-[11px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">{member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-600 font-medium">{member.phone}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <Badge status={member.status === 'Active' ? 'success' : 'warning'} dot>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex gap-1 justify-center">
                        {(['Aaya', 'Nahi Aaya'] as const).map(att => (
                          <button
                            key={att}
                            onClick={() => updateStaffAttendance(member.id, att)}
                            className={cn(
                              'px-3 py-1.5 text-[11px] font-bold rounded-lg border-2 transition-all',
                              member.attendance === att
                                ? att === 'Aaya' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                            )}
                          >
                            {att === 'Aaya' ? '✓ Aaya' : '✕ Nahi'}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-right">
                      <span className="font-mono text-sm font-bold text-slate-900">₹{member.salary.toLocaleString('en-IN')}</span>
                      <p className="text-[10px] text-slate-400">/ month</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Naya Staff Jodhein"
        subtitle="Add Staff Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => { showToast('Staff member added!'); setShowAddModal(false); }} icon={<PlusCircle size={15} />}>Add Member</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField label="Naam" placeholder="Rahul Mishra" required value={newName} onChange={e => setNewName(e.target.value)} />
          <SelectField
            label="Role"
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            options={['Cashier', 'Store Manager', 'Stock Keeper', 'Delivery Boy', 'Packer', 'Sales'].map(r => ({ value: r, label: r }))}
          />
          <InputField label="Phone Number" placeholder="+91 98765 12345" type="tel" required value={newPhone} onChange={e => setNewPhone(e.target.value)} />
          <InputField label="Monthly Salary (₹)" placeholder="14000" type="number" required value={newSalary} onChange={e => setNewSalary(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
