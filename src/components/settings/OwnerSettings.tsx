import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  CreditCard,
  Clock,
  Bell,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

export const OwnerSettings: React.FC = () => {
  const {
    currentUser,
    logout,
    pgProfile,
    updatePgProfile,
    penaltySettings,
    updatePenaltySettings,
    foodCutoffs,
    updateFoodCutoff,
    resetDemoData,
    addToast
  } = useApp();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Local form states
  const [profileForm, setProfileForm] = useState(pgProfile);
  const [penaltyForm, setPenaltyForm] = useState(penaltySettings);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePgProfile(profileForm);
  };

  const handleSavePenalty = (e: React.FormEvent) => {
    e.preventDefault();
    updatePenaltySettings(penaltyForm);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Configuration</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">PG Settings &amp; Rules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize PG property profile, UPI payment IDs, penalty formulas, and cutoffs.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. PG Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Property &amp; Contact Details</h3>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">PG Business Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Area</label>
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={profileForm.pincode}
                onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Receiving UPI VPA ID</label>
            <input
              type="text"
              value={profileForm.upiId}
              onChange={(e) => setProfileForm({ ...profileForm, upiId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Property Profile
            </button>
          </div>
        </form>

        {/* 2. Rent Penalty & Financial Rules Form */}
        <div className="space-y-6">
          <form onSubmit={handleSavePenalty} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Rent Due &amp; Late Penalty Engine</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rent Due Day of Month</label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={penaltyForm.dueDay}
                  onChange={(e) => setPenaltyForm({ ...penaltyForm, dueDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">e.g. 5th of each month</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Grace Period (Days)</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={penaltyForm.gracePeriodDays}
                  onChange={(e) => setPenaltyForm({ ...penaltyForm, gracePeriodDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Penalty starts after {penaltyForm.dueDay + penaltyForm.gracePeriodDays}th</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Daily Penalty (₹/day)</label>
                <input
                  type="number"
                  step={50}
                  value={penaltyForm.dailyPenalty}
                  onChange={(e) => setPenaltyForm({ ...penaltyForm, dailyPenalty: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Penalty Cap (₹)</label>
                <input
                  type="number"
                  step={500}
                  value={penaltyForm.maxPenalty}
                  onChange={(e) => setPenaltyForm({ ...penaltyForm, maxPenalty: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Penalty Rules
              </button>
            </div>
          </form>

          {/* 3. Kitchen Cutoff Timers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Meal Confirmation Cutoffs</h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Breakfast Cutoff</span>
                  <span className="text-[11px] text-slate-400">Previous day evening</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-slate-200">
                  {foodCutoffs.breakfast.cutoffTime}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Lunch Cutoff</span>
                  <span className="text-[11px] text-slate-400">Same morning</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-slate-200">
                  {foodCutoffs.lunch.cutoffTime}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Dinner Cutoff</span>
                  <span className="text-[11px] text-slate-400">Same evening</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-slate-200">
                  {foodCutoffs.dinner.cutoffTime}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Session & Sign Out */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-2xs space-y-3 text-xs bg-gradient-to-br from-white to-rose-50/30">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-100">
              <LogOut className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Account Session</h3>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Currently signed in as <strong className="text-slate-900">{currentUser?.name || 'Owner'}</strong> ({currentUser?.email || 'admin@pgease.com'}).
            </p>
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Account
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
