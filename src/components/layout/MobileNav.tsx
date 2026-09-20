import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Home, IndianRupee, UtensilsCrossed, MessageSquareWarning, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

interface MobileNavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

export const MobileNav: React.FC = () => {
  const { currentUser, logout, activeTab, setActiveTab, complaints, invoices } = useApp();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Show bottom nav only on small screens
  if (!currentUser) return null;

  const isTenant = currentUser.role === 'tenant';

  const tenantNav: MobileNavItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'rent', label: 'Rent', icon: IndianRupee },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning, badge: complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const ownerNav: MobileNavItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms', icon: Home },
    { id: 'rent', label: 'Rent', icon: IndianRupee },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning, badge: complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length },
  ];

  const items = isTenant ? tenantNav : ownerNav;

  return (
    <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          );
        })}

        {/* Mobile Logout Button */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl transition-all text-slate-500 hover:text-rose-600 font-medium"
        >
          <LogOut className="w-5 h-5 stroke-[1.8px]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </nav>
  );
};
