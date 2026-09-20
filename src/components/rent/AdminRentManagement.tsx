import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileText,
  Send,
  Download,
  Settings,
  Plus
} from 'lucide-react';
import { Invoice } from '../../types';

export const AdminRentManagement: React.FC = () => {
  const { invoices, payRent, setSelectedReceipt, addToast, penaltySettings } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (
      searchTerm &&
      !inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !inv.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalExpected = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPending = invoices.filter((i) => i.status !== 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPenalties = invoices.reduce((acc, i) => acc + i.penaltyAmount, 0);

  const handleMarkAsPaid = (inv: Invoice) => {
    payRent(inv.id, 'Cash / Bank Transfer');
    addToast('success', 'Rent Recorded', `Marked rent for ${inv.tenantName} (Room ${inv.roomNumber}) as paid.`);
  };

  const handleSendReminder = (inv: Invoice) => {
    addToast(
      'info',
      'Rent Reminder Sent',
      `Sent automated reminder with UPI payment link to ${inv.tenantName} for ₹${inv.totalAmount.toLocaleString('en-IN')}`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Financial Invoicing</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Rent Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track monthly invoices, automated late penalties, and digital payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToast('success', 'Invoices Generated', 'All 48 resident invoices generated for October 2026.');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate Invoices
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Billed</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalExpected.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">September 2026 Billing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase">Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : 0}% Collected
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-rose-600 uppercase">Outstanding Due</span>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{totalPending.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-rose-700 font-medium mt-1 block">
            {invoices.filter((i) => i.status === 'overdue').length} Overdue Residents
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase">Late Penalties</span>
          <div className="text-2xl font-black text-amber-600 mt-1">₹{totalPenalties.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ₹{penaltySettings.dailyPenalty}/day after grace period
          </span>
        </div>
      </div>

      {/* Penalty Calculation Engine Rule Card (Section 7) */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-950">Active Penalty Rules Configuration</h4>
            <p className="text-amber-800 mt-0.5">
              Rent Due Date: <strong>{penaltySettings.dueDay}th of each month</strong> • Grace Period: <strong>{penaltySettings.gracePeriodDays} days</strong> (Penalty starts on {penaltySettings.dueDay + penaltySettings.gracePeriodDays}th) • Daily Penalty: <strong>₹{penaltySettings.dailyPenalty}/day</strong> • Max Penalty: <strong>₹{penaltySettings.maxPenalty.toLocaleString('en-IN')}</strong>.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white text-amber-900 border border-amber-300 rounded-lg font-bold shrink-0 shadow-2xs">
          Auto Computed Daily
        </span>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenant or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'paid', 'pending', 'overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize shrink-0 transition-colors ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Tenant &amp; Room</th>
                <th className="px-5 py-3.5">Month</th>
                <th className="px-5 py-3.5">Base Rent</th>
                <th className="px-5 py-3.5">Late Penalty</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{inv.id}</td>

                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 block">{inv.tenantName}</span>
                    <span className="text-[11px] text-slate-500">Room {inv.roomNumber}</span>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-600">{inv.month}</td>

                  <td className="px-5 py-4 font-medium">₹{inv.baseRent.toLocaleString('en-IN')}</td>

                  <td className="px-5 py-4">
                    {inv.penaltyAmount > 0 ? (
                      <span className="font-bold text-rose-600">
                        +₹{inv.penaltyAmount.toLocaleString('en-IN')} ({inv.lateDays}d late)
                      </span>
                    ) : (
                      <span className="text-slate-400">₹0</span>
                    )}
                  </td>

                  <td className="px-5 py-4 font-black text-slate-900">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'pending' && <Clock className="w-3 h-3" />}
                      {inv.status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'paid' ? (
                        <>
                          <button
                            onClick={() => handleMarkAsPaid(inv)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => handleSendReminder(inv)}
                            title="Send WhatsApp & SMS Reminder"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedReceipt(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
