import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/initialData';
import { UserRole } from '../../types';
import { 
  X, 
  LogIn, 
  Building2, 
  User as UserIcon, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, addToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
    onClose();
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      addToast('error', 'Login Failed', 'Please enter your email or mobile number.');
      return;
    }

    // Match known demo users by email or fallback
    const matched = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (matched) {
      loginAs(matched.role);
    } else {
      // Default to selected role if customized
      loginAs(selectedRole);
    }
    onClose();
  };

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: any; color: string; bg: string; badge: string }[] = [
    {
      role: 'owner',
      title: 'PG Owner / Admin',
      subtitle: 'Vikram Hegde • Full access to rooms, rent, tenants & staff',
      icon: Building2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      badge: 'Admin Access'
    },
    {
      role: 'tenant',
      title: 'Resident Tenant',
      subtitle: 'Rahul Sharma • Room 204 • Pay rent, food confirmation, tickets',
      icon: UserIcon,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      badge: 'Room 204'
    },
    {
      role: 'staff',
      title: 'Staff / Maintenance',
      subtitle: 'Suresh Kumar • Resolve plumbing, electrical & kitchen work',
      icon: Wrench,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200 hover:border-amber-400',
      badge: 'Staff Lead'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Sign In to PGEase</h3>
              <p className="text-[11px] text-slate-500">Choose your portal account or role</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Sign In
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Sign In with Email / ID
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'quick' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium mb-1">
                Select a user role to explore the PGEase system instantly:
              </p>
              {rolesConfig.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    onClick={() => handleQuickLogin(item.role)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${item.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-white shadow-xs ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/80">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address / Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. owner@demo.com or 9880123456"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50 focus:bg-white transition-all"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Demo hint: Use owner@demo.com, tenant@demo.com, or staff@demo.com
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password / PIN
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Role / Portal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['owner', 'tenant', 'staff'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                        selectedRole === r
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Dashboard
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL Protected</span>
          </div>
          <span className="text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => handleQuickLogin('owner')}>
            Auto-fill Owner Credentials
          </span>
        </div>
      </div>
    </div>
  );
};
