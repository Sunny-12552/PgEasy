import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Building,
  MoreVertical,
  X,
  CreditCard,
  Send,
  UserMinus,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { Tenant } from '../../types';

export const TenantManagement: React.FC = () => {
  const { tenants, rooms, createTenant, checkoutTenant, addToast, setActiveTab, setSelectedReceipt, invoices } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState<Tenant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Tenant Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    roomId: rooms.find((r) => r.beds.some((b) => b.status === 'available'))?.id || rooms[0]?.id || '',
    bedNumber: 1,
    monthlyRent: 9000,
    securityDeposit: 15000,
    emergencyContact: '',
    emergencyRelation: 'Parent',
    workplace: '',
    aadhaarNumber: 'XXXX-XXXX-9812'
  });

  // Calculate available rooms & beds for assignment
  const selectedRoomObj = rooms.find((r) => r.id === formData.roomId);
  const availableBedsInSelectedRoom = selectedRoomObj?.beds.filter((b) => b.status === 'available') || [];

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && t.paymentStatus !== statusFilter) return false;
    return true;
  });

  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.roomId) {
      addToast('error', 'Missing Information', 'Please fill all required tenant details.');
      return;
    }
    const chosenRoom = rooms.find((r) => r.id === formData.roomId);
    if (!chosenRoom) return;

    createTenant({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      roomId: chosenRoom.id,
      roomNumber: chosenRoom.roomNumber,
      bedNumber: formData.bedNumber,
      monthlyRent: formData.monthlyRent,
      securityDeposit: formData.securityDeposit,
      emergencyContact: formData.emergencyContact,
      emergencyRelation: formData.emergencyRelation,
      workplace: formData.workplace,
      aadhaarNumber: formData.aadhaarNumber
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      roomId: rooms[0]?.id || '',
      bedNumber: 1,
      monthlyRent: 9000,
      securityDeposit: 15000,
      emergencyContact: '',
      emergencyRelation: 'Parent',
      workplace: '',
      aadhaarNumber: 'XXXX-XXXX-9812'
    });
  };

  const handleSendRentReminder = (tenant: Tenant) => {
    addToast(
      'info',
      'Reminder Dispatched',
      `Sent SMS & WhatsApp payment link to ${tenant.name} (${tenant.phone}) for pending ₹${tenant.monthlyRent.toLocaleString('en-IN')}`
    );
  };

  const handleViewReceipt = (tenant: Tenant) => {
    const invoice = invoices.find((i) => i.tenantId === tenant.id && i.status === 'paid');
    if (invoice) {
      setSelectedReceipt(invoice);
    } else {
      addToast('info', 'No Paid Receipt', `No completed payment receipt found for ${tenant.name} for the current month.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Directory &amp; KYC</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Tenant Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Total {tenants.length} active residents across {rooms.length} rooms.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Resident
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, room, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Rent Status:</span>
          {['all', 'paid', 'pending', 'overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize shrink-0 transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table (Section 17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Resident</th>
                <th className="px-5 py-3.5">Room &amp; Bed</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Joining Date</th>
                <th className="px-5 py-3.5">Monthly Rent</th>
                <th className="px-5 py-3.5 text-center">Rent Status</th>
                <th className="px-5 py-3.5 text-center">KYC</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No residents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {tenant.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{tenant.name}</span>
                          <span className="text-[11px] text-slate-400">{tenant.workplace || 'Resident'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">Room {tenant.roomNumber}</span>
                      <span className="text-[11px] text-slate-500">Bed {tenant.bedNumber}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-slate-800 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" /> {tenant.phone}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{tenant.email}</span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">{tenant.joiningDate}</td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">
                        ₹{tenant.monthlyRent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Dep: ₹{(tenant.securityDeposit ?? tenant.depositPaid ?? 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          tenant.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tenant.paymentStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tenant.paymentStatus === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {tenant.paymentStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {tenant.paymentStatus === 'overdue' && <AlertCircle className="w-3 h-3" />}
                        {tenant.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tenant.kycStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tenant.kycStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTenantForDetails(tenant)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          View
                        </button>
                        {tenant.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => handleSendRentReminder(tenant)}
                            title="Send WhatsApp & SMS Reminder"
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Remind
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewReceipt(tenant)}
                            title="View / Print Receipt"
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Receipt
                          </button>
                        )}
                        <button
                          onClick={() => checkoutTenant(tenant.id)}
                          title="Vacate / Check-out Resident"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add New Resident (Onboarding)</h3>
                <p className="text-xs text-slate-500">Allocates room and generates initial monthly invoice.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTenantSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98800 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="vikram@work.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / College</label>
                  <input
                    type="text"
                    placeholder="e.g. Infosys / Wipro"
                    value={formData.workplace}
                    onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Room & Bed Allocation Selection */}
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                  Room &amp; Bed Assignment
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Room *</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => {
                        const rId = e.target.value;
                        const rObj = rooms.find((r) => r.id === rId);
                        const firstAvail = rObj?.beds.find((b) => b.status === 'available')?.bedNumber || 1;
                        setFormData({
                          ...formData,
                          roomId: rId,
                          bedNumber: firstAvail,
                          monthlyRent: rObj?.rentPerBed || 9000,
                          securityDeposit: rObj?.securityDeposit || 15000
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          Room {r.roomNumber} ({r.sharingType} - {r.occupiedBeds}/{r.totalBeds} beds)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Bed Number</label>
                    <select
                      value={formData.bedNumber}
                      onChange={(e) => setFormData({ ...formData, bedNumber: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white"
                    >
                      {availableBedsInSelectedRoom.length > 0 ? (
                        availableBedsInSelectedRoom.map((b) => (
                          <option key={b.id} value={b.bedNumber}>
                            Bed {b.bedNumber} (Available)
                          </option>
                        ))
                      ) : (
                        <option value={1}>Bed 1 (Full)</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agreed Rent (₹)</label>
                  <input
                    type="number"
                    step={500}
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    step={1000}
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 94480 98765"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend / Colleague</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Resident Profile Drawer / Modal */}
      {selectedTenantForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                  {selectedTenantForDetails.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedTenantForDetails.name}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">
                    Room {selectedTenantForDetails.roomNumber} • Bed {selectedTenantForDetails.bedNumber}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTenantForDetails(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone</span>
                  <span className="font-bold text-slate-900">{selectedTenantForDetails.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Email</span>
                  <span className="font-medium text-slate-700 truncate block">{selectedTenantForDetails.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Monthly Rent</span>
                  <span className="font-bold text-indigo-700 text-sm">₹{selectedTenantForDetails.monthlyRent.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Security Deposit</span>
                  <span className="font-bold text-slate-800">₹{(selectedTenantForDetails.securityDeposit ?? selectedTenantForDetails.depositPaid ?? 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Move-in Date:</span>
                  <span className="font-semibold text-slate-800">{selectedTenantForDetails.joiningDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Workplace / College:</span>
                  <span className="font-semibold text-slate-800">{selectedTenantForDetails.workplace}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Emergency Contact:</span>
                  <span className="font-semibold text-slate-800">{selectedTenantForDetails.emergencyContact} ({selectedTenantForDetails.emergencyRelation})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Aadhaar KYC:</span>
                  <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {selectedTenantForDetails.aadhaarNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedTenantForDetails(null);
                  handleSendRentReminder(selectedTenantForDetails);
                }}
                className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold"
              >
                Send Reminder
              </button>
              <button
                onClick={() => setSelectedTenantForDetails(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
