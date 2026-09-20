import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { RoomManagement } from './components/rooms/RoomManagement';
import { TenantManagement } from './components/tenants/TenantManagement';
import { AdminRentManagement } from './components/rent/AdminRentManagement';
import { TenantRentPortal } from './components/rent/TenantRentPortal';
import { FoodManagement } from './components/food/FoodManagement';
import { ComplaintSystem } from './components/complaints/ComplaintSystem';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { StaffManagement } from './components/staff/StaffManagement';
import { ReportsView } from './components/reports/ReportsView';
import { OwnerSettings } from './components/settings/OwnerSettings';
import { TenantDashboard } from './components/tenant/TenantDashboard';
import { MyRoomView } from './components/tenant/MyRoomView';
import { DocumentsView } from './components/tenant/DocumentsView';
import { TenantProfileView } from './components/tenant/TenantProfileView';
import { ReceiptModal } from './components/common/ReceiptModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { isPublicLanding, activeTab, currentUser } = useApp();

  // If user clicked "View Public Website", show the public landing showcase
  if (isPublicLanding) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  // Render the current view according to activeTab and user persona role
  const renderTabContent = () => {
    const role = currentUser?.role;

    // Tenant Experience views
    if (role === 'tenant') {
      switch (activeTab) {
        case 'dashboard':
          return <TenantDashboard />;
        case 'my-room':
          return <MyRoomView />;
        case 'rent':
          return <TenantRentPortal />;
        case 'food':
          return <FoodManagement />;
        case 'complaints':
          return <ComplaintSystem />;
        case 'announcements':
          return <AnnouncementsView />;
        case 'documents':
          return <DocumentsView />;
        case 'profile':
          return <TenantProfileView />;
        default:
          return <TenantDashboard />;
      }
    }

    // Staff Experience views
    if (role === 'staff') {
      switch (activeTab) {
        case 'complaints':
          return <ComplaintSystem />;
        case 'food':
          return <FoodManagement />;
        case 'announcements':
          return <AnnouncementsView />;
        case 'staff':
        case 'dashboard':
        default:
          return <StaffManagement />;
      }
    }

    // PG Owner / Admin Experience views
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'rooms':
        return <RoomManagement />;
      case 'tenants':
        return <TenantManagement />;
      case 'rent':
        return <AdminRentManagement />;
      case 'food':
        return <FoodManagement />;
      case 'complaints':
        return <ComplaintSystem />;
      case 'staff':
        return <StaffManagement />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <OwnerSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {renderTabContent()}
        </main>
      </div>

      {/* Bottom Nav for Mobile Devices */}
      <MobileNav />

      {/* Modals & Portals */}
      <ReceiptModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
