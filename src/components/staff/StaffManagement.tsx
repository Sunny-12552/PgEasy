import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Phone, Wrench, Plus, CheckCircle2, Clock, X } from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { addToast } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [staffMembers, setStaffMembers] = useState([
    { id: 'st-1', name: 'Suresh Kumar', role: 'Head Plumber & Maintenance', phone: '+91 98800 77112', shift: '08:00 AM - 05:00 PM', activeTasks: 2, status: 'On Duty' },
    { id: 'st-2', name: 'Mahesh Sharma', role: 'Electrician & Generator Op', phone: '+91 98800 77113', shift: '09:00 AM - 06:00 PM', activeTasks: 1, status: 'On Duty' },
    { id: 'st-3', name: 'Ramu Gowda', role: 'Head Housekeeping', phone: '+91 98800 77114', shift: '07:00 AM - 04:00 PM', activeTasks: 0, status: 'On Duty' },
    { id: 'st-4', name: 'Somnath Roy', role: 'Chief Kitchen Cook', phone: '+91 98800 77115', shift: '06:00 AM - 09:30 PM', activeTasks: 3, status: 'In Kitchen' },
    { id: 'st-5', name: 'Anil Chauhan', role: 'Security Supervisor', phone: '+91 98800 77116', shift: '08:00 PM - 08:00 AM (Night)', activeTasks: 0, status: 'Off Duty' }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Plumber',
    phone: '',
    shift: '09:00 AM - 06:00 PM'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.phone) return;
    setStaffMembers([
      ...staffMembers,
      {
        id: `st-${Date.now()}`,
        name: newStaff.name,
        role: newStaff.role,
        phone: newStaff.phone,
        shift: newStaff.shift,
        activeTasks: 0,
        status: 'On Duty'
      }
    ]);
    setIsAddOpen(false);
    addToast('success', 'Staff Member Added', `${newStaff.name} added to staff roster.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Operations &amp; Manpower</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Staff &amp; Operations Team</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage housekeeping, security, kitchen cooks, and maintenance technicians.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => (
          <div key={staff.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm">
                  {staff.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{staff.role}</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  staff.status === 'On Duty'
                    ? 'bg-emerald-100 text-emerald-800'
                    : staff.status === 'In Kitchen'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {staff.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Shift Timings:</span>
                <span className="font-medium text-slate-800">{staff.shift}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Assigned Complaints:</span>
                <span className="font-bold text-indigo-700">{staff.activeTasks} Active</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={`tel:${staff.phone}`}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {staff.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Add Staff Member</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raju Kumar"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Trade</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Housekeeping / Cleaner">Housekeeping / Cleaner</option>
                    <option value="Cook / Kitchen Staff">Cook / Kitchen Staff</option>
                    <option value="Security Guard">Security Guard</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98800 12345"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Schedule</label>
                <input
                  type="text"
                  value={newStaff.shift}
                  onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
