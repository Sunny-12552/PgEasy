import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  IndianRupee,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon,
  ArrowUpRight
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

export const ReportsView: React.FC = () => {
  const { invoices, rooms, tenants, foodStats, addToast } = useApp();

  const [dateRange, setDateRange] = useState('september-2026');

  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPending = invoices.filter((i) => i.status !== 'paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPenalties = invoices.reduce((acc, i) => acc + i.penaltyAmount, 0);

  // Financial summary data
  const revenueData = [
    { category: 'Room Rent', amount: totalCollected, projected: totalCollected + totalPending },
    { category: 'Late Penalties', amount: totalPenalties, projected: totalPenalties + 1200 },
    { category: 'Maintenance & Misc', amount: 18000, projected: 18000 }
  ];

  const handleExportCSV = (reportType: string) => {
    let csvData = 'data:text/csv;charset=utf-8,';
    if (reportType === 'Rent Collection') {
      csvData += 'Invoice ID,Tenant,Room,Month,Base Rent,Penalty,Total,Status\n';
      invoices.forEach((i) => {
        csvData += `${i.id},"${i.tenantName}",${i.roomNumber},${i.month},${i.baseRent},${i.penaltyAmount},${i.totalAmount},${i.status}\n`;
      });
    } else if (reportType === 'Tenant Directory') {
      csvData += 'Tenant Name,Phone,Email,Room,Bed,Rent,Deposit,Joining Date\n';
      tenants.forEach((t) => {
        csvData += `"${t.name}",${t.phone},${t.email},${t.roomNumber},${t.bedNumber},${t.monthlyRent},${t.securityDeposit},${t.joiningDate}\n`;
      });
    }

    const encodedUri = encodeURI(csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportType.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report Exported', `Downloaded ${reportType} as CSV spreadsheet.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Analytics &amp; Compliance</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Financial &amp; Operational Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Export accounting spreadsheets, tax audit summaries, and food wastage reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="september-2026">September 2026 (Current)</option>
            <option value="august-2026">August 2026</option>
            <option value="q3-2026">Q3 (Jul - Sep 2026)</option>
            <option value="fy-2026">Financial Year 2026-27</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* 4 Report Types Quick Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase">Rent Summary</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">Rent Invoices Report</h4>
            <p className="text-xs text-slate-500 mt-1">
              Detailed list of all collections, pending dues, and penalty calculations.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('Rent Collection')}
            className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase">Occupancy</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">Bed Utilization Report</h4>
            <p className="text-xs text-slate-500 mt-1">
              Vacant vs occupied beds by floor with security deposit reconciliation.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('Tenant Directory')}
            className="mt-4 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase">Kitchen</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">Food Wastage Report</h4>
            <p className="text-xs text-slate-500 mt-1">
              Daily meal headcount trends with estimated grocery ration savings.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('Rent Collection')}
            className="mt-4 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 uppercase">Audits</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">Resident KYC Directory</h4>
            <p className="text-xs text-slate-500 mt-1">
              Complete resident records with verified Aadhaar and emergency contacts.
            </p>
          </div>
          <button
            onClick={() => handleExportCSV('Tenant Directory')}
            className="mt-4 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue Stream Performance (September 2026)</h3>
            <p className="text-xs text-slate-500">Collected vs Projected Revenue Across Revenue Heads</p>
          </div>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="amount" name="Collected Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" name="Projected Billing" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
