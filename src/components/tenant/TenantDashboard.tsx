import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BedDouble,
  IndianRupee,
  UtensilsCrossed,
  MessageSquareWarning,
  Wifi,
  Phone,
  ShieldCheck,
  CreditCard,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Megaphone,
  ArrowRight,
  FileText,
  Key
} from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  const {
    currentUser,
    invoices,
    complaints,
    foodStats,
    confirmMeal,
    announcements,
    setActiveTab,
    setSelectedReceipt,
    pgProfile
  } = useApp();

  const userInvoices = invoices.filter((i) => i.tenantId === currentUser?.tenantId);
  const activeInvoice = userInvoices.find((i) => i.status !== 'paid') || userInvoices[0];
  const userComplaints = complaints.filter((c) => c.tenantId === currentUser?.tenantId);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resident Portal</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Welcome back, {currentUser?.name}!</h1>
          <p className="text-xs text-slate-500 mt-1">
            Room 204 • Bed 1 (Double Sharing AC) • {pgProfile.name}
          </p>
        </div>

        {/* Quick Roommate pill */}
        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
            VK
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Roommate</span>
            <span className="font-bold text-slate-800">Vikram Malhotra (Bed 2)</span>
          </div>
        </div>
      </div>

      {/* 2 Primary Action Cards: Food Confirmation & Rent Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Today's Dinner Confirmation Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Today's Dinner Service
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
                Cutoff: 05:00 PM
              </span>
            </div>

            <h3 className="text-xl font-black mt-3">Will you have dinner tonight?</h3>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              Menu: Jeera Rice, Dal Makhani, Veg Kadai, Butter Chapati &amp; Salad
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-6">
            <button
              onClick={() => confirmMeal('dinner', true)}
              className="flex-1 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              YES, I'LL HAVE DINNER
            </button>
            <button
              onClick={() => confirmMeal('dinner', false)}
              className="py-2.5 px-4 bg-black/30 text-white font-bold text-xs rounded-xl border border-white/20 hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-rose-300" />
              NO
            </button>
          </div>
        </div>

        {/* Card 2: Current Rent Status */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Monthly Rent Invoice
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  activeInvoice?.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeInvoice?.status}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900 block">
                ₹{activeInvoice?.totalAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Period: {activeInvoice?.month} • Due on {activeInvoice?.dueDate}
              </p>
            </div>
          </div>

          <div className="pt-6">
            {activeInvoice?.status !== 'paid' ? (
              <button
                onClick={() => setActiveTab('rent')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pay Rent via UPI / Card
              </button>
            ) : (
              <button
                onClick={() => setSelectedReceipt(activeInvoice)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                View September Rent Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Amenities, Wi-Fi & Support Bar (Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wi-Fi Details */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">PG High-Speed Wi-Fi</span>
            <span className="text-xs font-mono font-bold text-slate-900 block">GreenNest_5G_Floor2</span>
            <span className="text-[10px] text-indigo-600 font-mono">Pass: Nest@Bengaluru99</span>
          </div>
        </div>

        {/* Manager 24/7 Helpline */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">PG Manager Helpline</span>
            <span className="text-xs font-bold text-slate-900 block">{pgProfile.phone}</span>
            <span className="text-[10px] text-slate-500">Available 24x7 for emergencies</span>
          </div>
        </div>

        {/* Quick Report Maintenance */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Need Repairs?</span>
              <span className="text-xs font-bold text-slate-900 block">
                {userComplaints.filter(c => c.status !== 'Resolved').length} Active Tickets
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('complaints')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition-colors"
          >
            Log Issue
          </button>
        </div>
      </div>

      {/* Latest Announcements Carousel / List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Notice Board</h3>
          </div>
          <button onClick={() => setActiveTab('announcements')} className="text-xs text-indigo-600 font-bold hover:underline">
            View All
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {announcements.slice(0, 2).map((ann) => (
            <div key={ann.id} className="py-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">{ann.title}</h4>
                <span className="text-[10px] text-slate-400">{ann.createdAt}</span>
              </div>
              <p className="text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
