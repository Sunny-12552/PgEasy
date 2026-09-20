import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Download,
  Printer,
  Calendar,
  BellRing,
  Sparkles,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  AlertCircle,
  Check,
  Send,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const FoodManagement: React.FC = () => {
  const {
    currentUser,
    foodStats,
    weeklyMenu,
    confirmMeal,
    foodCutoffs,
    updateFoodCutoff,
    tenants,
    addToast
  } = useApp();

  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'super_admin';
  const isStaff = currentUser?.role === 'staff';

  const [activeMealTab, setActiveMealTab] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner');
  const [selectedDay, setSelectedDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('saturday');

  // Food Analytics Dataset
  const analyticsData = [
    { day: 'Mon', expected: 80, confirmed: 64, optOut: 16 },
    { day: 'Tue', dayLabel: 'Tue', expected: 80, confirmed: 61, optOut: 19 },
    { day: 'Wed', dayLabel: 'Wed', expected: 80, confirmed: 66, optOut: 14 },
    { day: 'Thu', dayLabel: 'Thu', expected: 80, confirmed: 63, optOut: 17 },
    { day: 'Fri', dayLabel: 'Fri', expected: 80, confirmed: 58, optOut: 22 },
    { day: 'Sat', dayLabel: 'Sat', expected: 80, confirmed: 68, optOut: 12 },
    { day: 'Today', dayLabel: 'Today', expected: 80, confirmed: foodStats[activeMealTab].confirmed, optOut: foodStats[activeMealTab].optOut }
  ];

  // Export kitchen headcount sheet
  const handleExportKitchenCSV = () => {
    const attendees = foodStats[activeMealTab].attendees || [];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Room Number,Resident Name,Meal,Status\n' +
      attendees
        .map((a) => `${a.roomNumber},"${a.tenantName}",${activeMealTab.toUpperCase()},${a.confirmed ? 'Confirmed' : 'Opted Out'}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kitchen_Headcount_${activeMealTab}_2026-09-19.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Kitchen CSV Exported', `Downloaded headcount sheet for ${activeMealTab}.`);
  };

  const currentMealStats = foodStats[activeMealTab];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kitchen &amp; Meals Engine</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Food Management &amp; Meal Counts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Zero-wastage kitchen planning with automated daily headcount confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportKitchenCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Kitchen CSV
          </button>
          {isOwner && (
            <button
              onClick={() => {
                addToast('info', 'WhatsApp Reminders Dispatched', 'Dispatched dinner reminders to 14 unconfirmed residents.');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <BellRing className="w-3.5 h-3.5" />
              Remind Pending
            </button>
          )}
        </div>
      </div>

      {/* RESIDENT VIEW: Prompting Reminder Banner (Section 8) */}
      {!isOwner && !isStaff && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                  Daily Food Confirmation
                </span>
                <h3 className="text-xl font-black">Will you be having dinner today?</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-xl text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-300" /> Cutoff: 05:00 PM (1h 24m left)
            </div>
          </div>

          <p className="text-xs text-emerald-100 max-w-xl">
            Please confirm your meal preference before the cutoff time so the kitchen prepares the right quantity and prevents food wastage.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => confirmMeal('dinner', true)}
              className="px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              YES, I'LL HAVE DINNER
            </button>
            <button
              onClick={() => confirmMeal('dinner', false)}
              className="px-5 py-3 bg-black/30 hover:bg-black/40 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <XCircle className="w-4 h-4 text-rose-300" />
              NO, NOT AVAILABLE
            </button>
          </div>
        </div>
      )}

      {/* Meal Tabs Selector: Breakfast, Lunch, Dinner */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveMealTab('breakfast')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMealTab === 'breakfast'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Breakfast (07:30 - 09:30 AM)
        </button>

        <button
          onClick={() => setActiveMealTab('lunch')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMealTab === 'lunch'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sun className="w-4 h-4" />
          Lunch (12:30 - 02:30 PM)
        </button>

        <button
          onClick={() => setActiveMealTab('dinner')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeMealTab === 'dinner'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Moon className="w-4 h-4" />
          Dinner (07:45 - 10:00 PM)
        </button>
      </div>

      {/* 4 Headcount Metric Cards (Section 8) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Residents</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currentMealStats.totalTenants}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full PG Capacity</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmed (YES)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {currentMealStats.confirmed} Meals
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Cook for this count</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Not Having (NO)</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {currentMealStats.optOut} Residents
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Ration saved</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Response</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {currentMealStats.pending} Residents
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Cutoff: {foodCutoffs[activeMealTab].cutoffTime}
          </span>
        </div>
      </div>

      {/* Analytics & Kitchen List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Food Consumption Chart (Section 9) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Meal Demand vs Capacity (Last 7 Days)</h3>
              <p className="text-xs text-slate-500">Notice the average 15-20% grocery savings from accurate counts</p>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
              ~₹18,500 Saved/Mo
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="confirmed" name="Confirmed Meals" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optOut" name="Opted Out (Saved)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resident Confirmation List Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kitchen Headcount List</h3>
                <p className="text-xs text-slate-500 capitalize">{activeMealTab} - September 19</p>
              </div>
              <button onClick={handleExportKitchenCSV} className="text-xs text-indigo-600 font-bold hover:underline">
                Export
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 mt-2">
              {(currentMealStats.attendees || []).map((att, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{att.tenantName}</span>
                    <span className="text-[10px] text-slate-400">Room {att.roomNumber}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      att.confirmed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {att.confirmed ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {att.confirmed ? 'Having Meal' : 'Not Having'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cutoff Enforced: {foodCutoffs[activeMealTab].cutoffTime}</span>
            <span className="font-bold text-slate-800">
              {currentMealStats.confirmed} Kitchen Plates
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Menu Section (Section 8: Monday to Sunday) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Food Menu &amp; Routine</h3>
            <p className="text-xs text-slate-500">Curated weekly schedule prepared by executive chefs</p>
          </div>

          {/* Day selection tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600" /> Breakfast
              </span>
              <span className="text-[11px] font-mono text-amber-800">07:30 - 09:30 AM</span>
            </div>
            <p className="text-xs text-slate-700 mt-2.5 font-medium leading-relaxed">
              {weeklyMenu[selectedDay]?.breakfast || 'Idli Sambar, Chutney & Tea/Coffee'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-indigo-600" /> Lunch
              </span>
              <span className="text-[11px] font-mono text-indigo-800">12:30 - 02:30 PM</span>
            </div>
            <p className="text-xs text-slate-700 mt-2.5 font-medium leading-relaxed">
              {weeklyMenu[selectedDay]?.lunch || 'Rice, Dal, Paneer Butter Masala, Rotis & Curd'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-emerald-600" /> Dinner
              </span>
              <span className="text-[11px] font-mono text-emerald-800">07:45 - 10:00 PM</span>
            </div>
            <p className="text-xs text-slate-700 mt-2.5 font-medium leading-relaxed">
              {weeklyMenu[selectedDay]?.dinner || 'Jeera Rice, Dal Makhani, Mixed Veg & Salad'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
