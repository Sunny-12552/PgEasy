import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, User, Wrench, Globe, RotateCcw, ChevronRight, LogOut } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { currentUser, loginAs, logout, isPublicView, setIsPublicView, setActiveTab, resetDemoData } = useApp();

  return (
    <div className="no-print bg-slate-900 text-white px-4 py-2 text-xs border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
            Demo Interactive Mode:
          </span>
          <span className="text-slate-300 font-medium">
            {isPublicView
              ? 'Public PG Showcase & Landing'
              : currentUser?.role === 'owner'
              ? 'PG Owner / Admin View'
              : currentUser?.role === 'tenant'
              ? 'Resident Portal (Rahul Sharma - Room 204)'
              : 'Staff Portal (Suresh Kumar)'}
          </span>
        </div>

        {/* Right: Quick Persona Switcher buttons */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            onClick={() => {
              setIsPublicView(true);
              setActiveTab('landing');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              isPublicView
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Website
          </button>

          <button
            onClick={() => loginAs('owner')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              !isPublicView && currentUser?.role === 'owner'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            PG Owner Demo
          </button>

          <button
            onClick={() => loginAs('tenant')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              !isPublicView && currentUser?.role === 'tenant'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            Tenant Demo (Room 204)
          </button>

          <button
            onClick={() => loginAs('staff')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              !isPublicView && currentUser?.role === 'staff'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Staff Demo
          </button>

          <button
            onClick={resetDemoData}
            title="Reset all rooms, payments and food counts to demo defaults"
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-900/50 text-rose-200 border border-rose-800/80 rounded-md hover:bg-rose-900 transition-colors ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo Data
          </button>

          {currentUser && (
            <button
              onClick={logout}
              title="Logout current user session"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white border border-slate-700 hover:border-rose-500 rounded-md transition-colors ml-1 font-medium"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
