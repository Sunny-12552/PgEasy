import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BedDouble,
  Users,
  IndianRupee,
  UtensilsCrossed,
  MessageSquareWarning,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  BellRing,
  Megaphone
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    rooms,
    tenants,
    invoices,
    complaints,
    foodStats,
    setActiveTab,
    addToast
  } = useApp();

  // Metrics calculations
  const totalBeds = rooms.reduce((acc, r) => acc + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyPercentage = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '0';

  const collectedRent = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const pendingRent = invoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const openComplaints = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'In Progress' || c.status === 'Acknowledged'
  ).length;

  // Recharts Data: Monthly Rent Collection
  const rentData = [
    { month: 'May', collected: 780000, target: 820000 },
    { month: 'Jun', collected: 810000, target: 830000 },
    { month: 'Jul', collected: 835000, target: 850000 },
    { month: 'Aug', collected: 825000, target: 850000 },
    { month: 'Sep', collected: collectedRent, target: collectedRent + pendingRent }
  ];

  // Recharts Data: Room Occupancy
  const occupancyData = [
    { name: 'Occupied Beds', value: occupiedBeds, color: '#4f46e5' },
    { name: 'Available Beds', value: availableBeds, color: '#10b981' }
  ];

  // Recharts Data: Weekly Food Trends
  const foodTrendData = [
    { day: 'Mon', breakfast: 54, lunch: 60, dinner: 64 },
    { day: 'Tue', breakfast: 56, lunch: 63, dinner: 61 },
    { day: 'Wed', breakfast: 55, lunch: 62, dinner: 65 },
    { day: 'Thu', breakfast: 58, lunch: 64, dinner: 63 },
    { day: 'Fri', breakfast: 52, lunch: 58, dinner: 59 },
    { day: 'Sat', breakfast: 62, lunch: 68, dinner: 66 },
    { day: 'Today', breakfast: foodStats.breakfast.confirmed, lunch: foodStats.lunch.confirmed, dinner: foodStats.dinner.confirmed }
  ];

  // Recharts Data: Complaints by Category
  const complaintsByCategory = [
    { category: 'Plumbing', count: complaints.filter(c => c.category === 'Plumbing').length },
    { category: 'Wi-Fi', count: complaints.filter(c => c.category === 'Wi-Fi').length },
    { category: 'Maintenance', count: complaints.filter(c => c.category === 'Maintenance').length },
    { category: 'Cleaning', count: complaints.filter(c => c.category === 'Cleaning').length },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">PG Owner Overview</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">GreenNest Premium PG</h1>
          <p className="text-xs text-slate-500 mt-1">Marathahalli, Bengaluru • Today: September 19, 2026</p>
        </div>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('tenants')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Tenant
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            Add Room
          </button>
          <button
            onClick={() => {
              addToast('info', 'Food Reminder Sent', 'Automated WhatsApp & In-App reminder sent to 18 pending residents.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-colors"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-600" />
            Remind Food
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            Broadcast
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rooms & Beds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Rooms</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{rooms.length}</span>
            <span className="text-xs font-medium text-slate-500">({totalBeds} Total Beds)</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">{occupiedBeds} Occupied</span>
            <span className="text-slate-500">{availableBeds} Available</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{occupancyPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              High
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Active Tenants</span>
            <span className="font-bold text-slate-800">{tenants.length} Residents</span>
          </div>
        </div>

        {/* Rent Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rent Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{collectedRent.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pending:</span>
            <span className="font-bold text-rose-600">₹{pendingRent.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Dinner Food Count & Complaints */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Dinner</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{foodStats.dinner.confirmed} Meals</span>
            <span className="text-xs text-slate-500 font-medium">Confirmed</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Open Complaints:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${openComplaints > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
              {openComplaints} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Row (Rent Collection & Occupancy) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Rent Collection Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Rent Collection Trend</h3>
              <p className="text-xs text-slate-500">Collected vs Projected Rent Collection (INR)</p>
            </div>
            <button
              onClick={() => setActiveTab('rent')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View Invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="collected" name="Collected Rent" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Billing" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Occupancy Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Bed Occupancy Ratio</h3>
            <p className="text-xs text-slate-500">Overall bed capacity utilization</p>
          </div>

          <div className="h-48 my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-slate-900">{occupancyPercentage}%</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Occupied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <span className="text-[10px] text-indigo-600 block font-bold">Occupied</span>
              <span className="font-bold text-indigo-950">{occupiedBeds} Beds</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <span className="text-[10px] text-emerald-600 block font-bold">Available</span>
              <span className="font-bold text-emerald-950">{availableBeds} Beds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts & Food Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Food Meal Consumption Trends */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Food Consumption Trends (Past 7 Days)</h3>
              <p className="text-xs text-slate-500">Track meal counts to eliminate grocery wastage</p>
            </div>
            <button
              onClick={() => setActiveTab('food')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              Food Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={foodTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="breakfast" name="Breakfast" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lunch" name="Lunch" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="dinner" name="Dinner" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints Snapshot */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Complaints</h3>
                <p className="text-xs text-slate-500">Requires staff attention</p>
              </div>
              <button
                onClick={() => setActiveTab('complaints')}
                className="text-xs font-bold text-amber-600 hover:text-amber-800"
              >
                Manage
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {complaints.slice(0, 3).map((comp) => (
                <div key={comp.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{comp.ticketId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{comp.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Room {comp.roomNumber} • {comp.tenantName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('complaints')}
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            View All Complaints ({complaints.length})
          </button>
        </div>
      </div>
    </div>
  );
};
