import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareWarning,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  User,
  Camera,
  Search,
  Check,
  Send,
  X,
  FileText,
  Upload
} from 'lucide-react';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';

export const ComplaintSystem: React.FC = () => {
  const {
    currentUser,
    complaints,
    submitComplaint,
    updateComplaintStatus,
    assignComplaintStaff,
    addToast
  } = useApp();

  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'super_admin';
  const isStaff = currentUser?.role === 'staff';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // New Complaint Form
  const [newComplaintForm, setNewComplaintForm] = useState({
    category: 'Wi-Fi' as any,
    priority: 'Medium' as ComplaintPriority,
    title: '',
    description: '',
    imageUrl: ''
  });

  const filteredComplaints = complaints.filter((c) => {
    if (!isOwner && !isStaff && c.tenantId !== currentUser?.tenantId) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (
      searchTerm &&
      !c.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleLogComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintForm.description) {
      addToast('error', 'Incomplete Form', 'Please describe the issue in detail.');
      return;
    }

    submitComplaint({
      category: newComplaintForm.category,
      priority: newComplaintForm.priority,
      description: newComplaintForm.description,
      imageUrl: newComplaintForm.imageUrl || (newComplaintForm.category === 'Plumbing' ? 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80' : undefined)
    });

    setIsLogModalOpen(false);
    setNewComplaintForm({
      category: 'Wi-Fi',
      priority: 'Medium',
      title: '',
      description: '',
      imageUrl: ''
    });
  };

  const getPriorityBadge = (p: ComplaintPriority) => {
    switch (p) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Urgent</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'Resolved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Wrench className="w-3 h-3" /> In Progress</span>;
      case 'Acknowledged':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Acknowledged</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Submitted</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Maintenance &amp; Support</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Complaint Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track repairs, maintenance SLA timers, and staff assignments.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log New Complaint
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket, room, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Status:</span>
          {['all', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
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

      {/* Complaints List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ticket #</th>
                <th className="px-5 py-3.5">Room &amp; Resident</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Issue Description</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Assigned Staff</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No complaints matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-indigo-700">{c.ticketId}</td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">Room {c.roomNumber}</span>
                      <span className="text-[11px] text-slate-500">{c.tenantName}</span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-slate-800 line-clamp-2 font-medium">{c.description}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{c.createdAt}</span>
                    </td>

                    <td className="px-5 py-4">{getPriorityBadge(c.priority)}</td>

                    <td className="px-5 py-4">
                      {c.assignedStaff ? (
                        <span className="font-medium text-slate-800 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-slate-400" /> {c.assignedStaff}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-semibold">Unassigned</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">{getStatusBadge(c.status)}</td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Details
                        </button>
                        {isOwner && c.status !== 'Resolved' && (
                          <button
                            onClick={() => updateComplaintStatus(c.id, 'Resolved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log New Complaint Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Log Maintenance Complaint</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogComplaintSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={newComplaintForm.category}
                  onChange={(e) => setNewComplaintForm({ ...newComplaintForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white font-medium"
                >
                  <option value="Wi-Fi">Wi-Fi / Internet Connectivity</option>
                  <option value="Plumbing">Plumbing / Tap Leakage / Washroom</option>
                  <option value="Electrical">Electrical / Geyser / Fan / Lights</option>
                  <option value="Cleaning">Room Cleaning / Housekeeping</option>
                  <option value="Food">Food / Dining Quality</option>
                  <option value="Noise">Noise / Disturbance</option>
                  <option value="Maintenance">General Carpentry / Bed / Lock</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewComplaintForm({ ...newComplaintForm, priority: p })}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        newComplaintForm.priority === p
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Describe the problem *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain what needs repair (e.g. Washroom sink tap is dripping constantly since morning)."
                  value={newComplaintForm.description}
                  onChange={(e) => setNewComplaintForm({ ...newComplaintForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Photo Upload simulation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach Photo (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                  <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-500">Tap to upload issue photo / screenshot</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Detail & Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700">{selectedComplaint.ticketId}</span>
                <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                  Room {selectedComplaint.roomNumber} • {selectedComplaint.category}
                </h3>
                <p className="text-xs text-slate-500">Reported by {selectedComplaint.tenantName} on {selectedComplaint.createdAt}</p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Current Status</span>
                  <div className="mt-0.5">{getStatusBadge(selectedComplaint.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Priority</span>
                  <div className="mt-0.5">{getPriorityBadge(selectedComplaint.priority)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Staff</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">
                    {selectedComplaint.assignedStaff || 'Unassigned'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Issue Details:</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed border border-slate-100">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.imageUrl && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Attached Photo:</span>
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Issue Photo"
                    className="w-full h-36 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {/* Staff Assignment & Status Change Controls for Owner */}
              {isOwner && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                  <span className="font-bold text-indigo-950 block text-[11px] uppercase tracking-wider">
                    Staff Assignment &amp; Workflow
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-1">Assign Staff</label>
                      <select
                        defaultValue={selectedComplaint.assignedStaff || 'Suresh (Plumber)'}
                        onChange={(e) => assignComplaintStaff(selectedComplaint.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Suresh (Plumber)">Suresh (Plumber)</option>
                        <option value="Mahesh (Electrician)">Mahesh (Electrician)</option>
                        <option value="Ramu (Cleaner)">Ramu (Cleaner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Update Status</label>
                      <select
                        defaultValue={selectedComplaint.status}
                        onChange={(e) => updateComplaintStatus(selectedComplaint.id, e.target.value as ComplaintStatus)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Acknowledged">Acknowledged</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
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
