import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building,
  Copy,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  FileText,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TenantRentPortal: React.FC = () => {
  const {
    currentUser,
    invoices,
    payRent,
    setSelectedReceipt,
    pgProfile,
    penaltySettings,
    addToast
  } = useApp();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tenant invoices
  const tenantInvoices = invoices.filter((i) => i.tenantId === currentUser?.tenantId);
  const activeDueInvoice = tenantInvoices.find((i) => i.status !== 'paid') || tenantInvoices[0];
  const paidInvoices = tenantInvoices.filter((i) => i.status === 'paid');

  const handlePayNow = () => {
    if (!activeDueInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPayModalOpen(false);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      payRent(activeDueInvoice.id, selectedMethod === 'upi' ? 'UPI (Google Pay / PhonePe)' : selectedMethod === 'card' ? 'Debit Card' : 'Net Banking');
    }, 1200);
  };

  const copyUPI = () => {
    navigator.clipboard?.writeText(pgProfile.upiId);
    addToast('success', 'UPI ID Copied', `${pgProfile.upiId} copied to clipboard`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Resident Billing</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Rent &amp; Dues Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Room 204 • Due Date: {penaltySettings.dueDay}th of each month
          </p>
        </div>

        {activeDueInvoice && activeDueInvoice.status !== 'paid' && (
          <button
            onClick={() => setIsPayModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all"
          >
            <IndianRupee className="w-4 h-4" /> Pay Rent (₹{activeDueInvoice.totalAmount.toLocaleString('en-IN')})
          </button>
        )}
      </div>

      {/* Active Bill Hero Card (Section 6 & 7) */}
      {activeDueInvoice ? (
        <div
          className={`p-6 rounded-3xl border transition-all ${
            activeDueInvoice.status === 'paid'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200 shadow-sm'
              : activeDueInvoice.status === 'overdue'
              ? 'bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 border-rose-200 shadow-sm'
              : 'bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border-indigo-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Current Month Bill</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeDueInvoice.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeDueInvoice.status === 'overdue'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeDueInvoice.status}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mt-2">
                ₹{activeDueInvoice.totalAmount.toLocaleString('en-IN')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Period: {activeDueInvoice.month} • Due Date: {activeDueInvoice.dueDate}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeDueInvoice.status !== 'paid' ? (
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </button>
              ) : (
                <button
                  onClick={() => setSelectedReceipt(activeDueInvoice)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-600" /> View / Print Receipt
                </button>
              )}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Monthly Accommodation Rent</span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                ₹{activeDueInvoice.baseRent.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">Wi-Fi, Food, Power &amp; Room stay</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Late Payment Penalty</span>
              <span className={`text-lg font-black mt-1 block ${activeDueInvoice.penaltyAmount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                ₹{activeDueInvoice.penaltyAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">
                {activeDueInvoice.lateDays > 0 ? `${activeDueInvoice.lateDays} days late × ₹${activeDueInvoice.dailyPenalty}/day` : 'No late penalty applied'}
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Net Payable</span>
              <span className="text-lg font-black text-indigo-700 mt-1 block">
                ₹{activeDueInvoice.totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">Includes all applicable charges</span>
            </div>
          </div>

          {/* Transparent Penalty Explanation (Section 7 Formula) */}
          <div className="mt-6 p-4 bg-white/80 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Transparent Late Penalty Policy:</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Rent is due on the <strong>{penaltySettings.dueDay}th</strong> of every month. Residents enjoy a <strong>{penaltySettings.gracePeriodDays}-day grace period</strong> until the <strong>{penaltySettings.dueDay + penaltySettings.gracePeriodDays}th</strong>. Starting the <strong>{penaltySettings.dueDay + penaltySettings.gracePeriodDays}th</strong>, a late fee of <strong>₹{penaltySettings.dailyPenalty}/day</strong> is calculated automatically up to a maximum cap of ₹{penaltySettings.maxPenalty.toLocaleString('en-IN')}.
            </p>
            <p className="font-mono text-[11px] text-slate-500 pt-1">
              Formula: If (Payment Date &gt; {penaltySettings.dueDay + penaltySettings.gracePeriodDays}th), Penalty = (Late Days × ₹{penaltySettings.dailyPenalty})
            </p>
          </div>
        </div>
      ) : null}

      {/* Payment History & Receipts Table (Section 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment History &amp; Receipts</h3>
            <p className="text-xs text-slate-500">Download or print your digital payment receipts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Receipt #</th>
                <th className="px-5 py-3.5">Month</th>
                <th className="px-5 py-3.5">Paid Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Payment Mode</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paidInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{inv.receiptNumber || 'PGE-REC-901'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{inv.month}</td>
                  <td className="px-5 py-4 text-slate-500">{inv.paidDate || '2026-09-04'}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-slate-600">{inv.paymentMethod || 'UPI'}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Rent Modal Dialog (Section 6: UPI, Card, Net Banking) */}
      {isPayModalOpen && activeDueInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pay Rent</h3>
                <p className="text-xs text-slate-500">GreenNest Premium PG • {activeDueInvoice.month}</p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                disabled={isProcessing}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Total Amount Display */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block">Total Payable</span>
                  <span className="text-2xl font-black text-indigo-950">
                    ₹{activeDueInvoice.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Room 204</span>
                  <span className="text-xs font-semibold text-slate-700">Due: {activeDueInvoice.dueDate}</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>UPI QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* UPI Tab View */}
              {selectedMethod === 'upi' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center p-2">
                      <QrCode className="w-16 h-16 text-slate-800" />
                      <span className="text-[9px] font-mono text-slate-500 mt-1">Scan via any UPI App</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official PG UPI ID</span>
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-white rounded-lg border border-slate-300 text-slate-800 font-mono text-xs font-bold">
                      <span>{pgProfile.upiId}</span>
                      <button onClick={copyUPI} className="text-indigo-600 hover:text-indigo-800">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">Supports Google Pay, PhonePe, Paytm, and BHIM UPI</p>
                </div>
              )}

              {/* Card Tab View */}
              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8912"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="•••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Tab View */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-slate-600 mb-1">Select Bank</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 bg-white">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Authorize &amp; Pay ₹{activeDueInvoice.totalAmount.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
