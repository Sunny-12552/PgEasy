import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, pgProfile } = useApp();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header bar (no-print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-slate-800 text-sm">Official Rent Payment Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print / Save PDF
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-8 space-y-6 text-slate-800">
          {/* Brand & Receipt Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-base">
                  PG
                </div>
                <h2 className="text-xl font-bold text-slate-900">{pgProfile.name}</h2>
              </div>
              <p className="text-xs text-slate-500 max-w-sm">{pgProfile.address}, {pgProfile.city} - {pgProfile.pincode}</p>
              <p className="text-xs text-slate-500 mt-1">Contact: {pgProfile.phone} | {pgProfile.email}</p>
            </div>
            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID
              </span>
              <p className="text-xs font-mono text-slate-500 mt-2">Receipt No: <span className="font-bold text-slate-800">{selectedReceipt.receiptNumber || 'PGE-REC-2026-901'}</span></p>
              <p className="text-xs text-slate-500">Date: {selectedReceipt.paidDate || new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          {/* Resident Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Resident Name</span>
              <span className="font-semibold text-slate-900 text-sm">{selectedReceipt.tenantName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Room Number</span>
              <span className="font-semibold text-slate-900 text-sm">Room {selectedReceipt.roomNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Billing Period</span>
              <span className="font-semibold text-slate-900 text-sm">{selectedReceipt.month}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Mode</span>
              <span className="font-semibold text-slate-900 text-sm">{selectedReceipt.paymentMethod || 'UPI'}</span>
            </div>
          </div>

          {/* Table of Charges */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Due Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">Monthly Accommodation Rent</p>
                    <p className="text-[11px] text-slate-500">Includes Wi-Fi, Water, Housekeeping, Power Backup &amp; Maintenance</p>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{selectedReceipt.dueDate}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">₹{selectedReceipt.baseRent.toLocaleString('en-IN')}</td>
                </tr>
                {selectedReceipt.penaltyAmount > 0 && (
                  <tr className="bg-rose-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-rose-800">Late Payment Penalty</p>
                      <p className="text-[11px] text-rose-600">Calculated for {selectedReceipt.lateDays} day(s) overdue at ₹{selectedReceipt.dailyPenalty}/day</p>
                    </td>
                    <td className="px-4 py-3 text-center text-rose-600">{selectedReceipt.lateDays} days late</td>
                    <td className="px-4 py-3 text-right font-medium text-rose-700">₹{selectedReceipt.penaltyAmount.toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-slate-700">Total Paid:</td>
                  <td className="px-4 py-3 text-right font-bold text-base text-indigo-700">
                    ₹{selectedReceipt.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Transaction Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-end pt-4 border-t border-slate-100 text-xs gap-4">
            <div className="text-slate-500 space-y-1">
              <p className="font-mono text-[11px]">Transaction Ref: {selectedReceipt.transactionId || 'UPI/9812401829/PGE'}</p>
              <p className="text-[11px]">This is a computer generated receipt and does not require physical signature.</p>
              <p className="text-[11px] text-slate-400">Powered by PGEase PG Management Platform</p>
            </div>
            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
              <div className="inline-block border-b border-slate-400 pb-1 w-32 text-center text-[10px] text-slate-400">
                Authorized Signatory
              </div>
              <p className="text-[11px] font-semibold text-slate-700 mt-1">{pgProfile.name}</p>
            </div>
          </div>
        </div>

        {/* Footer (no-print) */}
        <div className="no-print px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
