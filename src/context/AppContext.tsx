import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Room,
  Tenant,
  RentInvoice,
  Invoice,
  Complaint,
  ComplaintStatus,
  Staff,
  Announcement,
  AppNotification,
  PenaltySettings,
  FoodReminderSettings,
  PGProfile,
  FoodDailyStats,
  FoodStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_TENANTS,
  INITIAL_INVOICES,
  INITIAL_COMPLAINTS,
  INITIAL_STAFF,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PG_PROFILE
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface AppContextType {
  // Auth & View
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isPublicView: boolean;
  setIsPublicView: (val: boolean) => void;
  isPublicLanding: boolean;
  setIsPublicLanding: (val: boolean) => void;

  // Data
  pgProfile: PGProfile;
  rooms: Room[];
  tenants: Tenant[];
  invoices: RentInvoice[];
  complaints: Complaint[];
  staff: Staff[];
  announcements: Announcement[];
  notifications: AppNotification[];
  penaltySettings: PenaltySettings;
  foodSettings: FoodReminderSettings;
  foodStats: FoodDailyStats;
  selectedReceipt: RentInvoice | null;
  setSelectedReceipt: (invoice: RentInvoice | null) => void;

  // Food & Kitchen Cutoffs
  foodCutoffs: {
    breakfast: { cutoffTime: string };
    lunch: { cutoffTime: string };
    dinner: { cutoffTime: string };
  };
  updateFoodCutoff: (meal: string, time: string) => void;
  weeklyMenu: Record<string, { breakfast: string; lunch: string; dinner: string }>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Actions
  payRent: (invoiceId: string, paymentMethod?: string) => RentInvoice | null;
  confirmMeal: (mealType: 'breakfast' | 'lunch' | 'dinner', status: boolean | 'confirmed' | 'not_available') => void;
  submitComplaint: (data: { category: any; priority: any; description: string; imageUrl?: string; photoUrl?: string }) => void;
  assignStaffToComplaint: (complaintId: string, staffId: string, note?: string) => void;
  assignComplaintStaff: (complaintId: string, staffName: string) => void;
  updateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus, note?: string) => void;
  createTenant: (tenantData: Partial<Tenant>) => boolean;
  checkoutTenant: (tenantId: string) => void;
  createRoom: (roomData: Partial<Room>) => boolean;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  createAnnouncement: (announcement: Partial<Announcement>) => void;
  updatePenaltySettings: (settings: PenaltySettings) => void;
  updateFoodSettings: (settings: FoodReminderSettings) => void;
  updatePGProfile: (profile: Partial<PGProfile>) => void;
  updatePgProfile: (profile: Partial<PGProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const STORAGE_KEY_PREFIX = 'pgease_saas_v2_';

const DEFAULT_PENALTY_SETTINGS: PenaltySettings = {
  dueDay: 5,
  gracePeriodDays: 3,
  dailyPenalty: 100,
  dailyPenaltyAmount: 100,
  maxPenalty: 2000,
  maxPenaltyAmount: 2000
};

const DEFAULT_WEEKLY_MENU = {
  monday: {
    breakfast: 'Idli Sambar, Coconut Chutney, Banana & Masala Chai',
    lunch: 'Steamed Rice, South Indian Dal, Bhindi Fry, Curd & Papad',
    dinner: 'Phulkas, Paneer Tikka Masala, Jeera Pulao & Gulab Jamun'
  },
  tuesday: {
    breakfast: 'Poha with Roasted Peanuts, Sev, Lemon & Filter Coffee',
    lunch: 'Rice, Rajma Masala, Aloo Gobi, Roti & Fresh Buttermilk',
    dinner: 'Veg Biryani, Mixed Veg Raita, Salan & Seasonal Fruit'
  },
  wednesday: {
    breakfast: 'Masala Dosa, Tomato Chutney, Sambar & Filter Tea',
    lunch: 'Curd Rice, Tadka Dal, Mix Veg Curry & Chapati',
    dinner: 'Egg Curry / Paneer Lababdar, Jeera Rice, Rotis & Custard'
  },
  thursday: {
    breakfast: 'Aloo Paratha, Fresh Curd, Pickle & Ginger Tea',
    lunch: 'Rice, Chana Dal, Baingan Bharta, Warm Phulkas & Salad',
    dinner: 'Dal Makhani, Kadhai Paneer, Tawa Naan & Kheer'
  },
  friday: {
    breakfast: 'Upma with Coconut Chutney, Medu Vada & Hot Coffee',
    lunch: 'Lemon Rice, Dal Tadka, Gobi Manchurian & Curd',
    dinner: 'Special Fried Rice, Chilli Paneer Gravy, Spring Rolls & Ice Cream'
  },
  saturday: {
    breakfast: 'Puri Bhaji with Halwa, Pickle & Cutting Chai',
    lunch: 'Vegetable Khichdi with Desi Ghee, Kadhi & Roasted Papad',
    dinner: 'Butter Naan, Shahi Paneer, Pulao, Green Salad & Rasgulla'
  },
  sunday: {
    breakfast: 'Chole Bhature with Pickled Onions & Lassi',
    lunch: 'Hyderabadi Dum Biryani (Veg/Chicken), Mirchi Ka Salan & Raita',
    dinner: 'Light Phulkas, Moong Dal, Lauki Kofta & Fruit Salad'
  }
};

const DEFAULT_FOOD_STATS: FoodDailyStats = {
  date: '2026-09-19',
  totalTenants: 80,
  breakfast: {
    confirmed: 64,
    notAvailable: 16,
    optOut: 16,
    pending: 0,
    totalTenants: 80,
    attendees: [
      { tenantName: 'Rahul Sharma', roomNumber: '204', confirmed: true },
      { tenantName: 'Vikram Malhotra', roomNumber: '204', confirmed: true },
      { tenantName: 'Arjun Reddy', roomNumber: '101', confirmed: false },
      { tenantName: 'Vivek Raj', roomNumber: '102', confirmed: true },
      { tenantName: 'Amit Patel', roomNumber: '102', confirmed: true }
    ]
  },
  lunch: {
    confirmed: 61,
    notAvailable: 19,
    optOut: 19,
    pending: 0,
    totalTenants: 80,
    attendees: [
      { tenantName: 'Rahul Sharma', roomNumber: '204', confirmed: false },
      { tenantName: 'Vikram Malhotra', roomNumber: '204', confirmed: true },
      { tenantName: 'Arjun Reddy', roomNumber: '101', confirmed: true },
      { tenantName: 'Vivek Raj', roomNumber: '102', confirmed: false }
    ]
  },
  dinner: {
    confirmed: 68,
    notAvailable: 12,
    optOut: 12,
    pending: 0,
    totalTenants: 80,
    attendees: [
      { tenantName: 'Rahul Sharma', roomNumber: '204', confirmed: true },
      { tenantName: 'Vikram Malhotra', roomNumber: '204', confirmed: true },
      { tenantName: 'Arjun Reddy', roomNumber: '101', confirmed: true },
      { tenantName: 'Vivek Raj', roomNumber: '102', confirmed: true },
      { tenantName: 'Amit Patel', roomNumber: '102', confirmed: false }
    ]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always open the public Home Page directly when opening the link
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isPublicView, setIsPublicView] = useState<boolean>(true);

  const [pgProfile, setPgProfile] = useState<PGProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'profile');
    return saved ? JSON.parse(saved) : INITIAL_PG_PROFILE;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [invoices, setInvoices] = useState<RentInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [penaltySettings, setPenaltySettings] = useState<PenaltySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'penaltySettings');
    return saved ? JSON.parse(saved) : DEFAULT_PENALTY_SETTINGS;
  });

  const [foodCutoffs, setFoodCutoffs] = useState({
    breakfast: { cutoffTime: '10:00 PM (Prev Day)' },
    lunch: { cutoffTime: '09:00 AM' },
    dinner: { cutoffTime: '05:00 PM' }
  });

  const [foodStats, setFoodStats] = useState<FoodDailyStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'foodStats');
    return saved ? JSON.parse(saved) : DEFAULT_FOOD_STATS;
  });

  const [selectedReceipt, setSelectedReceipt] = useState<RentInvoice | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'profile', JSON.stringify(pgProfile));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'rooms', JSON.stringify(rooms));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tenants', JSON.stringify(tenants));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'invoices', JSON.stringify(invoices));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'complaints', JSON.stringify(complaints));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'staff', JSON.stringify(staff));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'announcements', JSON.stringify(announcements));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'penaltySettings', JSON.stringify(penaltySettings));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'foodStats', JSON.stringify(foodStats));
  }, [rooms, tenants, invoices, complaints, staff, announcements, notifications, penaltySettings, foodStats, pgProfile]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginAs = (role: UserRole) => {
    const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
    setIsPublicView(false);
    setActiveTab('dashboard');
    addToast('info', 'Switched Persona', `Switched to ${target.name} (${target.role.toUpperCase()})`);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsPublicView(true);
    setActiveTab('landing');
    addToast('info', 'Logged Out', 'You are now viewing the public PG website.');
  };

  // 1. Interconnected Rent Payment
  const payRent = (invoiceId: string, paymentMethod: string = 'UPI'): RentInvoice | null => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return null;

    const receiptNum = `PGE-REC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().split('T')[0];
    const txnId = `${paymentMethod.replace(/\s+/g, '').slice(0, 4).toUpperCase()}/${Date.now().toString().slice(-8)}/PGE`;

    const updatedInvoice: RentInvoice = {
      ...invoice,
      status: 'paid',
      paidDate: nowStr,
      paymentMethod,
      transactionId: txnId,
      receiptNumber: receiptNum
    };

    setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv)));
    setTenants((prev) =>
      prev.map((t) => (t.id === invoice.tenantId ? { ...t, paymentStatus: 'paid' } : t))
    );

    // Notification
    const notif: AppNotification = {
      id: 'notif-pay-' + Date.now(),
      targetRole: 'owner',
      title: 'Rent Payment Received',
      message: `${invoice.tenantName} paid ₹${invoice.totalAmount.toLocaleString('en-IN')} for ${invoice.month} via ${paymentMethod}.`,
      category: 'rent',
      linkTab: 'rent',
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('success', 'Rent Paid Successfully', `Receipt #${receiptNum} generated for ₹${invoice.totalAmount.toLocaleString('en-IN')}.`);
    return updatedInvoice;
  };

  // 2. Interconnected Food Confirmation
  const confirmMeal = (
    mealType: 'breakfast' | 'lunch' | 'dinner',
    statusInput: boolean | 'confirmed' | 'not_available'
  ) => {
    const isYes = statusInput === true || statusInput === 'confirmed';
    const statusStr = isYes ? 'confirmed' : 'not_available';

    setFoodStats((prev) => {
      const current = prev[mealType];
      const newConfirmed = isYes ? current.confirmed + 1 : Math.max(0, current.confirmed - 1);
      const newOptOut = isYes ? Math.max(0, (current.optOut || current.notAvailable) - 1) : (current.optOut || current.notAvailable) + 1;

      const updatedAttendees = [
        { tenantName: currentUser?.name || 'Rahul Sharma', roomNumber: '204', confirmed: isYes },
        ...(current.attendees || []).filter((a) => a.tenantName !== (currentUser?.name || 'Rahul Sharma'))
      ];

      return {
        ...prev,
        [mealType]: {
          ...current,
          confirmed: newConfirmed,
          notAvailable: newOptOut,
          optOut: newOptOut,
          pending: Math.max(0, current.pending - 1),
          attendees: updatedAttendees
        }
      };
    });

    if (currentUser?.tenantId) {
      setTenants((prev) =>
        prev.map((t) => (t.id === currentUser.tenantId ? { ...t, foodStatus: statusStr } : t))
      );
    }

    addToast(
      isYes ? 'success' : 'info',
      'Meal Confirmed',
      isYes ? `Confirmed for ${mealType}. Kitchen plate reserved!` : `Opted out of ${mealType}. Ration saved!`
    );
  };

  // 3. Submit Maintenance Complaint
  const submitComplaint = (data: { category: any; priority: any; description: string; imageUrl?: string; photoUrl?: string }) => {
    const ticketId = `CMP${Math.floor(1000 + Math.random() * 9000)}`;
    const tenantName = currentUser?.name || 'Rahul Sharma';
    const roomNumber = '204';

    const newComplaint: Complaint = {
      id: 'cmp-' + Date.now(),
      ticketId,
      tenantId: currentUser?.tenantId || 'tenant-101',
      tenantName,
      roomNumber,
      category: data.category,
      priority: data.priority,
      description: data.description,
      imageUrl: data.imageUrl || data.photoUrl,
      photoUrl: data.imageUrl || data.photoUrl,
      status: 'Submitted',
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      updates: [
        {
          id: 'upd-' + Date.now(),
          complaintId: 'cmp-' + Date.now(),
          updatedBy: tenantName,
          updaterRole: 'Tenant',
          message: 'Complaint submitted by resident.',
          timestamp: 'Just now'
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Notify Owner
    const notif: AppNotification = {
      id: 'notif-cmp-' + Date.now(),
      targetRole: 'owner',
      title: `New ${data.priority} Ticket: ${ticketId}`,
      message: `${tenantName} (Room ${roomNumber}) reported: ${data.description.slice(0, 60)}...`,
      category: 'complaint',
      linkTab: 'complaints',
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('success', 'Complaint Logged', `Ticket #${ticketId} created. Staff has been alerted.`);
  };

  const assignComplaintStaff = (complaintId: string, staffName: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, assignedStaff: staffName, status: 'In Progress' } : c))
    );
    addToast('success', 'Staff Assigned', `Assigned ${staffName} to ticket.`);
  };

  const assignStaffToComplaint = (complaintId: string, staffId: string, note?: string) => {
    const staffObj = staff.find((s) => s.id === staffId);
    assignComplaintStaff(complaintId, staffObj ? `${staffObj.name} (${staffObj.role})` : staffId);
  };

  const updateComplaintStatus = (complaintId: string, newStatus: ComplaintStatus, note?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus, updatedAt: 'Just now' } : c))
    );
    addToast('info', 'Status Updated', `Complaint status marked as ${newStatus}.`);
  };

  // 4. Onboard Tenant
  const createTenant = (tenantData: Partial<Tenant>): boolean => {
    if (!tenantData.name || !tenantData.roomId) return false;

    const targetRoom = rooms.find((r) => r.id === tenantData.roomId);
    if (!targetRoom) return false;

    const availableBed = targetRoom.beds.find((b) => b.status === 'available');
    if (!availableBed) {
      addToast('error', 'Room Full', `Room ${targetRoom.roomNumber} has no available beds.`);
      return false;
    }

    const newTenantId = 'tenant-' + Date.now();
    const newUserId = 'user-' + Date.now();

    const newTenant: Tenant = {
      id: newTenantId,
      userId: newUserId,
      name: tenantData.name,
      email: tenantData.email || `${tenantData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: tenantData.phone || '+91 98765 43210',
      emergencyContact: tenantData.emergencyContact || '+91 98450 00000',
      emergencyRelation: tenantData.emergencyRelation || 'Parent / Guardian',
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      bedId: availableBed.id,
      bedNumber: availableBed.bedNumber,
      sharingType: targetRoom.sharingType,
      joinDate: new Date().toISOString().split('T')[0],
      joiningDate: new Date().toISOString().split('T')[0],
      monthlyRent: targetRoom.rentPerBed,
      depositPaid: targetRoom.securityDeposit,
      securityDeposit: targetRoom.securityDeposit,
      paymentStatus: 'pending',
      foodStatus: 'confirmed',
      accountStatus: 'active',
      idProofType: tenantData.idProofType || 'Aadhaar Card',
      idProofNumber: tenantData.idProofNumber || 'XXXX-XXXX-0000',
      aadhaarNumber: tenantData.aadhaarNumber || '9876-5432-1098',
      workplaceOrCollege: tenantData.workplaceOrCollege || 'Tech Professional',
      workplace: tenantData.workplace || tenantData.workplaceOrCollege || 'Tech Professional',
      kycStatus: 'Verified'
    };

    const updatedBeds = targetRoom.beds.map((b) =>
      b.id === availableBed.id
        ? { ...b, status: 'occupied' as const, tenantId: newTenantId, tenantName: newTenant.name }
        : b
    );
    const newOccupiedCount = targetRoom.occupiedBeds + 1;
    const newRoomStatus = newOccupiedCount >= targetRoom.totalBeds ? 'occupied' : 'few_beds_left';

    setRooms((prev) =>
      prev.map((r) => (r.id === targetRoom.id ? { ...r, beds: updatedBeds, occupiedBeds: newOccupiedCount, status: newRoomStatus } : r))
    );

    setTenants((prev) => [newTenant, ...prev]);

    // Create current invoice
    const newInvoice: RentInvoice = {
      id: 'inv-' + Date.now(),
      tenantId: newTenantId,
      tenantName: newTenant.name,
      roomNumber: targetRoom.roomNumber,
      month: 'September 2026',
      baseRent: targetRoom.rentPerBed,
      dueDate: '2026-09-25',
      lateDays: 0,
      dailyPenalty: penaltySettings.dailyPenalty,
      penaltyAmount: 0,
      totalAmount: targetRoom.rentPerBed,
      status: 'pending'
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    addToast('success', 'Resident Added', `${newTenant.name} allocated to Room ${targetRoom.roomNumber}, Bed ${availableBed.bedNumber}.`);
    return true;
  };

  const checkoutTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === tenant.roomId) {
          const updatedBeds = r.beds.map((b) =>
            b.id === tenant.bedId ? { ...b, status: 'available' as const, tenantId: undefined, tenantName: undefined } : b
          );
          const newOccupied = Math.max(0, r.occupiedBeds - 1);
          return {
            ...r,
            beds: updatedBeds,
            occupiedBeds: newOccupied,
            status: newOccupied === 0 ? 'available' : 'few_beds_left'
          };
        }
        return r;
      })
    );

    setTenants((prev) => prev.filter((t) => t.id !== tenantId));
    addToast('info', 'Resident Checked Out', `${tenant.name} has been marked as checked out. Security deposit reconciled.`);
  };

  const createRoom = (roomData: Partial<Room>): boolean => {
    if (!roomData.roomNumber || !roomData.sharingType) return false;

    const totalBeds =
      roomData.sharingType === 'single'
        ? 1
        : roomData.sharingType === 'double'
        ? 2
        : roomData.sharingType === 'triple'
        ? 3
        : 4;

    const roomId = 'room-' + roomData.roomNumber;
    const beds = Array.from({ length: totalBeds }, (_, i) => ({
      id: `bed-${roomData.roomNumber}-${i + 1}`,
      bedNumber: i + 1,
      roomId,
      status: 'available' as const
    }));

    const newRoom: Room = {
      id: roomId,
      roomNumber: roomData.roomNumber,
      floor: roomData.floor || 1,
      sharingType: roomData.sharingType,
      totalBeds,
      occupiedBeds: 0,
      rentPerBed: roomData.rentPerBed || 9000,
      securityDeposit: roomData.securityDeposit || 15000,
      isAC: !!roomData.isAC,
      hasAttachedBathroom: roomData.hasAttachedBathroom ?? true,
      hasBalcony: !!roomData.hasBalcony,
      status: 'available',
      beds,
      facilities: roomData.facilities || ['High Speed Wi-Fi', 'Attached Bath', 'Wardrobe', 'Study Desk']
    };

    setRooms((prev) => [...prev, newRoom]);
    addToast('success', 'Room Created', `Room ${newRoom.roomNumber} with ${totalBeds} beds added.`);
    return true;
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r)));
    addToast('success', 'Room Updated', 'Room details saved.');
  };

  const deleteRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && room.occupiedBeds > 0) {
      addToast('error', 'Cannot Delete', 'Room has active tenants. Vacate beds first.');
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    addToast('info', 'Room Deleted', 'Room removed from property.');
  };

  const updatePenaltySettings = (newSettings: PenaltySettings) => {
    setPenaltySettings(newSettings);
    addToast('success', 'Penalty Rule Saved', `Due on ${newSettings.dueDay}th, grace ${newSettings.gracePeriodDays} days, ₹${newSettings.dailyPenalty}/day.`);
  };

  const updateFoodSettings = (settings: FoodReminderSettings) => {
    // food settings update
  };

  const updateFoodCutoff = (meal: string, time: string) => {
    setFoodCutoffs((prev: any) => ({
      ...prev,
      [meal]: { cutoffTime: time }
    }));
    addToast('success', 'Cutoff Saved', `${meal} cutoff updated to ${time}.`);
  };

  const updatePGProfile = (updates: Partial<PGProfile>) => {
    setPgProfile((prev) => ({ ...prev, ...updates }));
    addToast('success', 'Profile Updated', 'PG property information saved.');
  };

  const createAnnouncement = (announcement: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title: announcement.title || 'Notice',
      content: announcement.content || '',
      target: announcement.target || 'all',
      targetAudience: announcement.targetAudience || 'All Tenants',
      createdAt: 'Just now',
      author: currentUser?.name || 'PG Management',
      priority: announcement.priority || 'Normal',
      isPinned: announcement.isPinned ?? false
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    addToast('success', 'Notice Published', 'Notice published to resident board.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'Notifications Read', 'All notifications marked as read.');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsPublicView(true);
    setActiveTab('landing');
    setPgProfile(INITIAL_PG_PROFILE);
    setRooms(INITIAL_ROOMS);
    setTenants(INITIAL_TENANTS);
    setInvoices(INITIAL_INVOICES);
    setComplaints(INITIAL_COMPLAINTS);
    setStaff(INITIAL_STAFF);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPenaltySettings(DEFAULT_PENALTY_SETTINGS);
    setFoodStats(DEFAULT_FOOD_STATS);
    addToast('info', 'Demo Data Reset', 'All records restored to original default demo dataset.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        setActiveTab,
        loginAs,
        logout,
        isPublicView,
        setIsPublicView,
        isPublicLanding: isPublicView,
        setIsPublicLanding: setIsPublicView,
        pgProfile,
        rooms,
        tenants,
        invoices,
        complaints,
        staff,
        announcements,
        notifications,
        penaltySettings,
        foodSettings: {
          breakfastCutoff: '10:00 PM',
          lunchCutoff: '09:00 AM',
          dinnerCutoff: '05:00 PM',
          enableInApp: true,
          enableWhatsApp: true,
          enableSMS: true
        },
        foodStats,
        foodCutoffs,
        updateFoodCutoff,
        weeklyMenu: DEFAULT_WEEKLY_MENU,
        selectedReceipt,
        setSelectedReceipt,
        toasts,
        addToast,
        removeToast,
        payRent,
        confirmMeal,
        submitComplaint,
        assignStaffToComplaint,
        assignComplaintStaff,
        updateComplaintStatus,
        createTenant,
        checkoutTenant,
        createRoom,
        updateRoom,
        deleteRoom,
        createAnnouncement,
        updatePenaltySettings,
        updateFoodSettings,
        updatePGProfile,
        updatePgProfile: updatePGProfile,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
