export type UserRole = 'super_admin' | 'owner' | 'staff' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string; // If tenant
  staffRole?: string; // If staff
}

export type SharingType = 'single' | 'double' | 'triple' | 'four_sharing';
export type RoomStatus = 'available' | 'few_beds_left' | 'occupied' | 'maintenance';
export type BedStatus = 'available' | 'occupied' | 'reserved';

export interface Bed {
  id: string;
  bedNumber: number;
  roomId: string;
  status: BedStatus;
  tenantId?: string;
  tenantName?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  sharingType: SharingType;
  totalBeds: number;
  occupiedBeds: number;
  rentPerBed: number;
  securityDeposit: number;
  isAC: boolean;
  hasAttachedBathroom: boolean;
  hasBalcony: boolean;
  status: RoomStatus;
  beds: Bed[];
  facilities: string[];
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partially_paid';
export type FoodStatus = 'confirmed' | 'not_available' | 'pending';
export type AccountStatus = 'active' | 'notice_period' | 'inactive';

export interface Tenant {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyRelation?: string;
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: number;
  sharingType: SharingType;
  joinDate: string;
  joiningDate?: string;
  monthlyRent: number;
  depositPaid: number;
  securityDeposit?: number;
  paymentStatus: PaymentStatus;
  foodStatus: FoodStatus;
  accountStatus: AccountStatus;
  idProofType: string;
  idProofNumber: string;
  workplaceOrCollege: string;
  workplace?: string;
  aadhaarNumber?: string;
  kycStatus?: 'Verified' | 'Pending' | 'Rejected' | string;
}

export interface RentInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  month: string; // e.g., "September 2026"
  baseRent: number;
  dueDate: string; // YYYY-MM-DD
  paidDate?: string;
  lateDays: number;
  dailyPenalty: number;
  penaltyAmount: number;
  totalAmount: number;
  status: PaymentStatus;
  paymentMethod?: 'UPI' | 'Card' | 'Net Banking' | 'Cash' | string;
  transactionId?: string;
  receiptNumber?: string;
}

export type Invoice = RentInvoice;

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface FoodConfirmation {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  status: 'confirmed' | 'not_available';
  confirmedAt: string;
}

export interface MealStats {
  confirmed: number;
  notAvailable: number;
  optOut?: number;
  pending: number;
  totalTenants?: number;
  attendees?: { tenantName: string; roomNumber: string; confirmed: boolean }[];
}

export interface FoodDailyStats {
  date: string;
  totalTenants: number;
  breakfast: MealStats;
  lunch: MealStats;
  dinner: MealStats;
}

export type ComplaintCategory =
  | 'Electricity'
  | 'Plumbing'
  | 'Wi-Fi'
  | 'Cleaning'
  | 'Food'
  | 'Room'
  | 'Maintenance'
  | 'Noise'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | 'Emergency';
export type ComplaintStatus = 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Closed';

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  updatedBy: string;
  updaterRole: string;
  message: string;
  timestamp: string;
  statusChange?: ComplaintStatus;
}

export interface Complaint {
  id: string;
  ticketId: string; // e.g., "CMP1024"
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  description: string;
  photoUrl?: string;
  imageUrl?: string;
  status: ComplaintStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  updates: ComplaintUpdate[];
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string; // e.g. "Electrician", "Plumber", "Housekeeping Supervisor", "Cook"
  status: 'active' | 'on_leave';
  assignedComplaintsCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target?: 'all' | 'floor_1' | 'floor_2' | 'floor_3' | 'specific_tenant' | string;
  targetAudience?: string;
  targetLabel?: string;
  createdAt: string;
  authorName?: string;
  author?: string;
  priority: 'Normal' | 'Important' | 'Urgent' | 'normal' | 'important' | 'urgent';
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string; // specific user or all if undefined
  targetRole?: UserRole;
  title: string;
  message: string;
  category: 'rent' | 'food' | 'complaint' | 'announcement' | 'system';
  linkTab?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PenaltySettings {
  gracePeriodDays: number;
  dailyPenaltyAmount?: number;
  maxPenaltyAmount?: number;
  dueDay: number;
  dailyPenalty: number;
  maxPenalty: number;
}

export interface FoodReminderSettings {
  breakfastCutoff: string; // e.g., "08:00 AM"
  lunchCutoff: string;     // e.g., "11:00 AM"
  dinnerCutoff: string;    // e.g., "05:00 PM"
  enableInApp: boolean;
  enableWhatsApp: boolean;
  enableSMS: boolean;
}

export interface PGProfile {
  id: string;
  name: string;
  tagline: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  upiId: string;
  startingRent: number;
  standardDeposit: number;
  totalRooms: number;
  checkInTime: string;
  checkOutTime: string;
  gateClosingTime: string;
  visitingHours: string;
  rules: string[];
  facilities: { name: string; icon: string; description: string }[];
  locationDetails: {
    lat: number;
    lng: number;
    nearbyLandmarks: string[];
    metroStation: string;
    techParks: string[];
  };
}
