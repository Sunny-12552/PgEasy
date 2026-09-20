import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, Building, Calendar, ShieldCheck, AlertCircle, Save, LogOut } from 'lucide-react';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

export const TenantProfileView: React.FC = () => {
  const { currentUser, tenants, logout, addToast, pgProfile } = useApp();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const currentTenant = tenants.find((t) => t.id === currentUser?.tenantId) || tenants[0];

  const [onNotice, setOnNotice] = useState(false);
  const [expectedMoveOut, setExpectedMoveOut] = useState('2026-10-31');

  const handleNoticeToggle = () => {
    setOnNotice(!onNotice);
    if (!onNotice) {
      addToast('info', 'Notice Period Initiated', '30-day notice period submitted to PG owner. Vacating date set to October 31, 2026.');
    } else {
      addToast('success', 'Notice Cancelled', 'Notice period status reverted.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Account Details</span>
        <h1 className="text-2xl font-black text-slate-900 mt-0.5">Resident Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, workplace info, and notice period requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
          <div className="w-20 h-20 rounded-full mx-auto bg-indigo-600 text-white text-2xl font-black flex items-center justify-center shadow-md shadow-indigo-200">
            {currentTenant.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{currentTenant.name}</h3>
            <p className="text-xs text-indigo-600 font-bold">Room {currentTenant.roomNumber} • Bed {currentTenant.bedNumber}</p>
            <p className="text-xs text-slate-500 mt-0.5">{currentTenant.workplace}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Resident
            </span>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Personal &amp; Stay Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Mobile Phone</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentTenant.phone}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Email Address</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentTenant.email}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Move-in Date</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{currentTenant.joiningDate}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Security Deposit Paid</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                ₹{(currentTenant.securityDeposit ?? currentTenant.depositPaid ?? 15000).toLocaleString('en-IN')} (Refundable)
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Emergency Contact</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {currentTenant.emergencyContact} ({currentTenant.emergencyRelation})
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Aadhaar Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{currentTenant.aadhaarNumber}</span>
            </div>
          </div>

          {/* 30-Day Notice Period Trigger */}
          <div className="mt-6 pt-6 border-t border-slate-100 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">30-Day Move-out Notice</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  As per agreement, please give at least 30 days notice prior to moving out to ensure full security deposit refund.
                </p>
                {onNotice && (
                  <p className="text-xs text-rose-600 font-bold mt-2">
                    Notice active. Expected vacating date: {expectedMoveOut}
                  </p>
                )}
              </div>

              <button
                onClick={handleNoticeToggle}
                className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 transition-colors ${
                  onNotice
                    ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {onNotice ? 'Withdraw Notice' : 'Initiate Move-out Notice'}
              </button>
            </div>
          </div>

          {/* Account Session & Logout */}
          <div className="mt-4 p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-950 text-sm">Account Session</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sign out of your resident portal account on this device.
              </p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-4 py-2 bg-white hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-300 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
};
