import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  IndianRupee,
  UtensilsCrossed,
  MessageSquareWarning,
  UserCheck,
  Megaphone,
  BarChart3,
  Settings,
  CreditCard,
  FileText,
  UserCircle,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { currentUser, logout, activeTab, setActiveTab, complaints, invoices, foodStats } = useApp();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'super_admin';
  const isStaff = currentUser?.role === 'staff';

  const pendingComplaintsCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'In Progress').length;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'overdue').length;

  const ownerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble },
    { id: 'tenants', label: 'Tenants Directory', icon: Users },
    { id: 'rent', label: 'Rent Invoicing', icon: IndianRupee, badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} due` : undefined, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'food', label: 'Food Planning', icon: UtensilsCrossed, badge: `${foodStats.dinner.confirmed} meals`, badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'complaints', label: 'Complaints & SLA', icon: MessageSquareWarning, badge: pendingComplaintsCount > 0 ? String(pendingComplaintsCount) : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'staff', label: 'Staff & Team', icon: UserCheck },
    { id: 'announcements', label: 'Notice Board', icon: Megaphone },
    { id: 'reports', label: 'Reports & Audit', icon: BarChart3 },
    { id: 'settings', label: 'PG Settings', icon: Settings },
  ];

  const tenantNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-room', label: 'My Room & Keys', icon: BedDouble },
    { id: 'rent', label: 'Rent & Dues', icon: IndianRupee },
    { id: 'food', label: 'Food Confirmation', icon: UtensilsCrossed },
    { id: 'complaints', label: 'Complaints / Service', icon: MessageSquareWarning },
    { id: 'announcements', label: 'Notice Board', icon: Megaphone },
    { id: 'documents', label: 'Documents & KYC', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  const staffNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Assigned Work', icon: UserCheck },
    { id: 'complaints', label: 'Complaints Pool', icon: MessageSquareWarning, badge: String(pendingComplaintsCount), badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'food', label: 'Kitchen Counts', icon: UtensilsCrossed },
    { id: 'announcements', label: 'Notice Board', icon: Megaphone },
  ];

  const navItems = isOwner ? ownerNavItems : isStaff ? staffNavItems : tenantNavItems;

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-64px)] overflow-y-auto select-none">
        {/* Navigation list */}
        <div className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {isOwner ? 'Property Management' : isStaff ? 'Staff Operations' : 'Resident Portal'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Logout Action */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
              <span>Logout</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-rose-500 uppercase tracking-wider">
              Exit
            </span>
          </button>
        </div>

        {/* Bottom Property Tag */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="truncate">GreenNest Coliving PG</span>
          <span className="font-mono text-[10px] text-indigo-600 font-bold">v2.4</span>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </>
  );
};
