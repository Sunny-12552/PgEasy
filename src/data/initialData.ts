import {
  User,
  Room,
  Tenant,
  RentInvoice,
  Complaint,
  Staff,
  Announcement,
  AppNotification,
  PenaltySettings,
  FoodReminderSettings,
  PGProfile,
  FoodDailyStats
} from '../types';

export const INITIAL_PG_PROFILE: PGProfile = {
  id: 'pg-greennest-01',
  name: 'GreenNest Premium PG',
  tagline: 'Smart PG Living for Professionals & Students',
  address: '14/3, Near Kalamandir, Outer Ring Road, Marathahalli',
  area: 'Marathahalli',
  city: 'Bengaluru',
  pincode: '560037',
  phone: '+91 98801 23456',
  email: 'stay@greennestpg.com',
  upiId: 'greennestpg@icici',
  startingRent: 8500,
  standardDeposit: 15000,
  totalRooms: 50,
  checkInTime: '08:00 AM',
  checkOutTime: '12:00 PM',
  gateClosingTime: '10:30 PM',
  visitingHours: '10:00 AM to 08:00 PM',
  rules: [
    'Gate closes at 10:30 PM sharp for resident safety. Late entry requires prior notice.',
    'Smoking and consumption of alcohol are strictly prohibited inside the premises.',
    'Guests are allowed in common lounge areas between 10:00 AM and 08:00 PM.',
    'Maintain silence in corridors and rooms after 11:00 PM.',
    'Notice period of 30 days is mandatory before vacating.',
    'Keep your room and common areas neat and tidy.'
  ],
  facilities: [
    { name: 'High Speed Wi-Fi', icon: 'Wifi', description: 'Dual-band 300 Mbps fiber internet with seamless roaming.' },
    { name: 'Air Conditioning', icon: 'Wind', description: 'Energy efficient inverter ACs in all AC-tier rooms.' },
    { name: 'Automatic Laundry', icon: 'Shirt', description: 'Fully automatic washing machines with detergent stations.' },
    { name: 'Daily Housekeeping', icon: 'Sparkles', description: 'Professional room and bathroom sanitation every single day.' },
    { name: '24/7 CCTV & Security', icon: 'ShieldCheck', description: 'CCTV surveillance across all hallways and biometric entry.' },
    { name: '100% Power Backup', icon: 'Zap', description: 'Heavy diesel generator for uninterrupted power and lights.' },
    { name: 'Covered Parking', icon: 'Bike', description: 'Spacious two-wheeler and reserved bicycle parking bay.' },
    { name: '24/7 Hot Water', icon: 'Flame', description: 'Commercial solar and heat pump geysers for all bathrooms.' },
    { name: 'Self-Cooking Kitchen', icon: 'UtensilsCrossed', description: 'Equipped with induction, microwave, and RO water dispenser.' }
  ],
  locationDetails: {
    lat: 12.9569,
    lng: 77.7011,
    nearbyLandmarks: [
      'Prestige Tech Park (1.4 km)',
      'Cessna Business Park (2.1 km)',
      'RMZ Ecospace & Bellandur (3.2 km)',
      'Kalamandir Junction (300 m)'
    ],
    metroStation: 'Upcoming Marathahalli Metro (500 m)',
    techParks: ['Prestige Tech Park', 'Cessna Business Park', 'Embassy TechVillage', 'Bagmane Constellation']
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-owner',
    name: 'Vikram Hegde',
    email: 'owner@demo.com',
    phone: '+91 98801 23456',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-tenant-1',
    name: 'Rahul Sharma',
    email: 'tenant@demo.com',
    phone: '+91 97421 88321',
    role: 'tenant',
    tenantId: 'tenant-101',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-staff-1',
    name: 'Suresh Kumar',
    email: 'staff@demo.com',
    phone: '+91 96112 34567',
    role: 'staff',
    staffRole: 'Maintenance & Plumbing Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STAFF: Staff[] = [
  { id: 'staff-1', name: 'Suresh Kumar', phone: '+91 96112 34567', role: 'Plumbing & Maintenance', status: 'active', assignedComplaintsCount: 2 },
  { id: 'staff-2', name: 'Ramesh Babu', phone: '+91 98450 99881', role: 'Electrician', status: 'active', assignedComplaintsCount: 1 },
  { id: 'staff-3', name: 'Anand Murthy', phone: '+91 99160 55443', role: 'Housekeeping Supervisor', status: 'active', assignedComplaintsCount: 0 },
  { id: 'staff-4', name: 'Ganesh Shinde', phone: '+91 98231 11223', role: 'Head Chef / Catering', status: 'active', assignedComplaintsCount: 0 }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    floor: 1,
    sharingType: 'single',
    totalBeds: 1,
    occupiedBeds: 1,
    rentPerBed: 15500,
    securityDeposit: 25000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: true,
    status: 'occupied',
    facilities: ['Split AC', 'Private Balcony', 'Attached Bath', 'Study Desk', 'Ergonomic Chair', 'Wardrobe with Mirror'],
    beds: [
      { id: 'bed-101-1', bedNumber: 1, roomId: 'room-101', status: 'occupied', tenantId: 'tenant-102', tenantName: 'Arjun Reddy' }
    ]
  },
  {
    id: 'room-102',
    roomNumber: '102',
    floor: 1,
    sharingType: 'double',
    totalBeds: 2,
    occupiedBeds: 2,
    rentPerBed: 10500,
    securityDeposit: 18000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: false,
    status: 'occupied',
    facilities: ['Split AC', 'Attached Bath', 'Individual Wardrobes', 'Twin Study Tables'],
    beds: [
      { id: 'bed-102-1', bedNumber: 1, roomId: 'room-102', status: 'occupied', tenantId: 'tenant-103', tenantName: 'Vivek Raj' },
      { id: 'bed-102-2', bedNumber: 2, roomId: 'room-102', status: 'occupied', tenantId: 'tenant-104', tenantName: 'Amit Patel' }
    ]
  },
  {
    id: 'room-201',
    roomNumber: '201',
    floor: 2,
    sharingType: 'triple',
    totalBeds: 3,
    occupiedBeds: 2,
    rentPerBed: 8500,
    securityDeposit: 15000,
    isAC: false,
    hasAttachedBathroom: true,
    hasBalcony: true,
    status: 'few_beds_left',
    facilities: ['High Speed Wi-Fi', 'Balcony View', 'Attached Bath', 'Individual Lockers'],
    beds: [
      { id: 'bed-201-1', bedNumber: 1, roomId: 'room-201', status: 'occupied', tenantId: 'tenant-105', tenantName: 'Rohan Nair' },
      { id: 'bed-201-2', bedNumber: 2, roomId: 'room-201', status: 'occupied', tenantId: 'tenant-106', tenantName: 'Karthik S.' },
      { id: 'bed-201-3', bedNumber: 3, roomId: 'room-201', status: 'available' }
    ]
  },
  {
    id: 'room-204',
    roomNumber: '204',
    floor: 2,
    sharingType: 'double',
    totalBeds: 2,
    occupiedBeds: 1,
    rentPerBed: 9000,
    securityDeposit: 15000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: true,
    status: 'few_beds_left',
    facilities: ['Inverter AC', 'Attached Bath', 'Sunny Balcony', 'Modular Wardrobe', 'Personal Study Desk'],
    beds: [
      { id: 'bed-204-1', bedNumber: 1, roomId: 'room-204', status: 'occupied', tenantId: 'tenant-101', tenantName: 'Rahul Sharma' },
      { id: 'bed-204-2', bedNumber: 2, roomId: 'room-204', status: 'available' }
    ]
  },
  {
    id: 'room-301',
    roomNumber: '301',
    floor: 3,
    sharingType: 'single',
    totalBeds: 1,
    occupiedBeds: 0,
    rentPerBed: 16000,
    securityDeposit: 25000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: true,
    status: 'available',
    facilities: ['Top Floor Terrace Access', 'Split AC', 'Smart TV', 'Balcony', 'Ensuite Bathroom'],
    beds: [
      { id: 'bed-301-1', bedNumber: 1, roomId: 'room-301', status: 'available' }
    ]
  },
  {
    id: 'room-302',
    roomNumber: '302',
    floor: 3,
    sharingType: 'double',
    totalBeds: 2,
    occupiedBeds: 1,
    rentPerBed: 9500,
    securityDeposit: 16000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: false,
    status: 'few_beds_left',
    facilities: ['Split AC', 'Spacious Room', 'Attached Bath', 'Twin Wardrobes'],
    beds: [
      { id: 'bed-302-1', bedNumber: 1, roomId: 'room-302', status: 'occupied', tenantId: 'tenant-107', tenantName: 'Sneha Reddy' },
      { id: 'bed-302-2', bedNumber: 2, roomId: 'room-302', status: 'available' }
    ]
  },
  {
    id: 'room-303',
    roomNumber: '303',
    floor: 3,
    sharingType: 'triple',
    totalBeds: 3,
    occupiedBeds: 0,
    rentPerBed: 8000,
    securityDeposit: 14000,
    isAC: false,
    hasAttachedBathroom: true,
    hasBalcony: true,
    status: 'available',
    facilities: ['Ceiling Fans', 'Attached Washroom', 'Terrace View', 'Lockers'],
    beds: [
      { id: 'bed-303-1', bedNumber: 1, roomId: 'room-303', status: 'available' },
      { id: 'bed-303-2', bedNumber: 2, roomId: 'room-303', status: 'available' },
      { id: 'bed-303-3', bedNumber: 3, roomId: 'room-303', status: 'available' }
    ]
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-101',
    userId: 'user-tenant-1',
    name: 'Rahul Sharma',
    email: 'tenant@demo.com',
    phone: '+91 97421 88321',
    emergencyContact: '+91 98450 11223 (Father)',
    roomId: 'room-204',
    roomNumber: '204',
    bedId: 'bed-204-1',
    bedNumber: 1,
    sharingType: 'double',
    joinDate: '2025-07-01',
    monthlyRent: 9000,
    depositPaid: 15000,
    paymentStatus: 'paid',
    foodStatus: 'confirmed',
    accountStatus: 'active',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-4819',
    workplaceOrCollege: 'Infosys BPM, Electronic City'
  },
  {
    id: 'tenant-102',
    userId: 'user-tenant-2',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@gmail.com',
    phone: '+91 98451 22334',
    emergencyContact: '+91 94401 55667',
    roomId: 'room-101',
    roomNumber: '101',
    bedId: 'bed-101-1',
    bedNumber: 1,
    sharingType: 'single',
    joinDate: '2025-05-15',
    monthlyRent: 15500,
    depositPaid: 25000,
    paymentStatus: 'paid',
    foodStatus: 'confirmed',
    accountStatus: 'active',
    idProofType: 'PAN Card',
    idProofNumber: 'ABCDP1234F',
    workplaceOrCollege: 'Flipkart Tech, Cessna Business Park'
  },
  {
    id: 'tenant-103',
    userId: 'user-tenant-3',
    name: 'Vivek Raj',
    email: 'vivek.raj@outlook.com',
    phone: '+91 99012 34512',
    emergencyContact: '+91 98480 88990',
    roomId: 'room-102',
    roomNumber: '102',
    bedId: 'bed-102-1',
    bedNumber: 1,
    sharingType: 'double',
    joinDate: '2025-08-10',
    monthlyRent: 10500,
    depositPaid: 18000,
    paymentStatus: 'pending',
    foodStatus: 'not_available',
    accountStatus: 'active',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-9901',
    workplaceOrCollege: 'Wipro Technologies, Sarjapur'
  },
  {
    id: 'tenant-104',
    userId: 'user-tenant-4',
    name: 'Amit Patel',
    email: 'amit.patel@accenture.com',
    phone: '+91 97110 56789',
    emergencyContact: '+91 99220 33445',
    roomId: 'room-102',
    roomNumber: '102',
    bedId: 'bed-102-2',
    bedNumber: 2,
    sharingType: 'double',
    joinDate: '2025-09-01',
    monthlyRent: 10500,
    depositPaid: 18000,
    paymentStatus: 'overdue',
    foodStatus: 'confirmed',
    accountStatus: 'active',
    idProofType: 'Passport',
    idProofNumber: 'K4891023',
    workplaceOrCollege: 'Accenture Solutions, Prestige Tech Park'
  },
  {
    id: 'tenant-105',
    userId: 'user-tenant-5',
    name: 'Rohan Nair',
    email: 'rohan.nair@swiggy.in',
    phone: '+91 98450 67123',
    emergencyContact: '+91 94471 22998',
    roomId: 'room-201',
    roomNumber: '201',
    bedId: 'bed-201-1',
    bedNumber: 1,
    sharingType: 'triple',
    joinDate: '2025-06-20',
    monthlyRent: 8500,
    depositPaid: 15000,
    paymentStatus: 'paid',
    foodStatus: 'confirmed',
    accountStatus: 'active',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-1123',
    workplaceOrCollege: 'Swiggy Engineering, Bellandur'
  },
  {
    id: 'tenant-106',
    userId: 'user-tenant-6',
    name: 'Karthik Subramanian',
    email: 'karthik.s@tcs.com',
    phone: '+91 99401 23890',
    emergencyContact: '+91 94440 77881',
    roomId: 'room-201',
    roomNumber: '201',
    bedId: 'bed-201-2',
    bedNumber: 2,
    sharingType: 'triple',
    joinDate: '2025-07-15',
    monthlyRent: 8500,
    depositPaid: 15000,
    paymentStatus: 'paid',
    foodStatus: 'pending',
    accountStatus: 'active',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-7721',
    workplaceOrCollege: 'TCS Whitefield'
  },
  {
    id: 'tenant-107',
    userId: 'user-tenant-7',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@dell.com',
    phone: '+91 98860 12789',
    emergencyContact: '+91 98490 66554',
    roomId: 'room-302',
    roomNumber: '302',
    bedId: 'bed-302-1',
    bedNumber: 1,
    sharingType: 'double',
    joinDate: '2025-08-01',
    monthlyRent: 9500,
    depositPaid: 16000,
    paymentStatus: 'paid',
    foodStatus: 'confirmed',
    accountStatus: 'active',
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-5544',
    workplaceOrCollege: 'Dell Technologies, Domlur'
  }
];

export const INITIAL_PENALTY_SETTINGS: PenaltySettings = {
  dueDay: 5,
  gracePeriodDays: 3,
  dailyPenalty: 100,
  dailyPenaltyAmount: 100,
  maxPenalty: 2000,
  maxPenaltyAmount: 2000
};

export const INITIAL_FOOD_REMINDER_SETTINGS: FoodReminderSettings = {
  breakfastCutoff: '08:00 AM',
  lunchCutoff: '11:00 AM',
  dinnerCutoff: '05:00 PM',
  enableInApp: true,
  enableWhatsApp: true,
  enableSMS: false
};

export const INITIAL_INVOICES: RentInvoice[] = [
  {
    id: 'inv-sept-2026-101',
    tenantId: 'tenant-101',
    tenantName: 'Rahul Sharma',
    roomNumber: '204',
    month: 'September 2026',
    baseRent: 9000,
    dueDate: '2026-09-05',
    paidDate: '2026-09-07',
    lateDays: 2,
    dailyPenalty: 100,
    penaltyAmount: 200,
    totalAmount: 9200,
    status: 'paid',
    paymentMethod: 'UPI',
    transactionId: 'UPI/26090714920/HDFC',
    receiptNumber: 'PGE-REC-202609-014'
  },
  {
    id: 'inv-oct-2026-101',
    tenantId: 'tenant-101',
    tenantName: 'Rahul Sharma',
    roomNumber: '204',
    month: 'October 2026',
    baseRent: 9000,
    dueDate: '2026-10-05',
    lateDays: 0,
    dailyPenalty: 100,
    penaltyAmount: 0,
    totalAmount: 9000,
    status: 'pending'
  },
  {
    id: 'inv-sept-2026-102',
    tenantId: 'tenant-102',
    tenantName: 'Arjun Reddy',
    roomNumber: '101',
    month: 'September 2026',
    baseRent: 15500,
    dueDate: '2026-09-05',
    paidDate: '2026-09-04',
    lateDays: 0,
    dailyPenalty: 100,
    penaltyAmount: 0,
    totalAmount: 15500,
    status: 'paid',
    paymentMethod: 'Net Banking',
    transactionId: 'IMPS/60904123490',
    receiptNumber: 'PGE-REC-202609-003'
  },
  {
    id: 'inv-sept-2026-103',
    tenantId: 'tenant-103',
    tenantName: 'Vivek Raj',
    roomNumber: '102',
    month: 'September 2026',
    baseRent: 10500,
    dueDate: '2026-09-05',
    lateDays: 14,
    dailyPenalty: 100,
    penaltyAmount: 1400,
    totalAmount: 11900,
    status: 'overdue'
  },
  {
    id: 'inv-sept-2026-104',
    tenantId: 'tenant-104',
    tenantName: 'Amit Patel',
    roomNumber: '102',
    month: 'September 2026',
    baseRent: 10500,
    dueDate: '2026-09-05',
    lateDays: 14,
    dailyPenalty: 100,
    penaltyAmount: 1400,
    totalAmount: 11900,
    status: 'overdue'
  },
  {
    id: 'inv-sept-2026-105',
    tenantId: 'tenant-105',
    tenantName: 'Rohan Nair',
    roomNumber: '201',
    month: 'September 2026',
    baseRent: 8500,
    dueDate: '2026-09-05',
    paidDate: '2026-09-05',
    lateDays: 0,
    dailyPenalty: 100,
    penaltyAmount: 0,
    totalAmount: 8500,
    status: 'paid',
    paymentMethod: 'UPI',
    transactionId: 'UPI/26090510101/ICICI',
    receiptNumber: 'PGE-REC-202609-008'
  },
  {
    id: 'inv-sept-2026-107',
    tenantId: 'tenant-107',
    tenantName: 'Sneha Reddy',
    roomNumber: '302',
    month: 'September 2026',
    baseRent: 9500,
    dueDate: '2026-09-05',
    paidDate: '2026-09-03',
    lateDays: 0,
    dailyPenalty: 100,
    penaltyAmount: 0,
    totalAmount: 9500,
    status: 'paid',
    paymentMethod: 'Card',
    transactionId: 'TXN/CARD/9982348',
    receiptNumber: 'PGE-REC-202609-002'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-1024',
    ticketId: 'CMP1024',
    tenantId: 'tenant-101',
    tenantName: 'Rahul Sharma',
    roomNumber: '204',
    category: 'Plumbing',
    priority: 'Medium',
    description: 'Bathroom washbasin tap is continuously dripping and leaking water under the sink cabinet.',
    status: 'In Progress',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Suresh Kumar (Plumbing)',
    createdAt: '2026-09-18 10:30 AM',
    updatedAt: '2026-09-18 02:15 PM',
    updates: [
      {
        id: 'upd-1',
        complaintId: 'cmp-1024',
        updatedBy: 'Rahul Sharma',
        updaterRole: 'Tenant',
        message: 'Complaint submitted with issue description.',
        timestamp: '2026-09-18 10:30 AM',
        statusChange: 'Submitted'
      },
      {
        id: 'upd-2',
        complaintId: 'cmp-1024',
        updatedBy: 'Vikram Hegde (Owner)',
        updaterRole: 'Owner',
        message: 'Assigned to Suresh Kumar for washer replacement.',
        timestamp: '2026-09-18 11:15 AM',
        statusChange: 'Acknowledged'
      },
      {
        id: 'upd-3',
        complaintId: 'cmp-1024',
        updatedBy: 'Suresh Kumar',
        updaterRole: 'Staff',
        message: 'Inspected the valve. Replacement cartridge ordered, will fix by today 4 PM.',
        timestamp: '2026-09-18 02:15 PM',
        statusChange: 'In Progress'
      }
    ]
  },
  {
    id: 'cmp-1025',
    ticketId: 'CMP1025',
    tenantId: 'tenant-101',
    tenantName: 'Rahul Sharma',
    roomNumber: '204',
    category: 'Wi-Fi',
    priority: 'High',
    description: 'Wi-Fi 5GHz signal drops frequently in room 204 balcony area during work meetings.',
    status: 'Submitted',
    createdAt: '2026-09-19 08:45 AM',
    updatedAt: '2026-09-19 08:45 AM',
    updates: [
      {
        id: 'upd-4',
        complaintId: 'cmp-1025',
        updatedBy: 'Rahul Sharma',
        updaterRole: 'Tenant',
        message: 'Complaint submitted.',
        timestamp: '2026-09-19 08:45 AM',
        statusChange: 'Submitted'
      }
    ]
  },
  {
    id: 'cmp-1019',
    ticketId: 'CMP1019',
    tenantId: 'tenant-102',
    tenantName: 'Arjun Reddy',
    roomNumber: '101',
    category: 'Maintenance',
    priority: 'Low',
    description: 'AC filter cleaning and routine general servicing requested.',
    status: 'Resolved',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Ramesh Babu (Electrician)',
    createdAt: '2026-09-12 11:00 AM',
    updatedAt: '2026-09-13 04:30 PM',
    updates: [
      {
        id: 'upd-5',
        complaintId: 'cmp-1019',
        updatedBy: 'Arjun Reddy',
        updaterRole: 'Tenant',
        message: 'AC filter cleaning needed.',
        timestamp: '2026-09-12 11:00 AM'
      },
      {
        id: 'upd-6',
        complaintId: 'cmp-1019',
        updatedBy: 'Ramesh Babu',
        updaterRole: 'Staff',
        message: 'Filters cleaned and cooling coil tested. Working fine.',
        timestamp: '2026-09-13 04:30 PM',
        statusChange: 'Resolved'
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Water Overhead Tank Cleaning Tomorrow',
    content: 'Routine bi-monthly overhead tank cleaning scheduled tomorrow between 10:00 AM and 01:00 PM. Water supply will be paused during this period. Please store water in advance.',
    target: 'all',
    targetLabel: 'All Residents',
    createdAt: '2026-09-18 06:00 PM',
    authorName: 'Vikram Hegde (Management)',
    priority: 'important'
  },
  {
    id: 'ann-2',
    title: 'Weekend Special Sunday Feast & Ice Cream',
    content: 'Special North Indian & South Indian buffet dinner planned this Sunday at 08:00 PM. Includes Paneer Butter Masala, Biryani, Gulab Jamun and Mango Kulfi.',
    target: 'all',
    targetLabel: 'All Residents',
    createdAt: '2026-09-17 04:30 PM',
    authorName: 'Ganesh Shinde (Chef)',
    priority: 'normal'
  },
  {
    id: 'ann-3',
    title: '2nd Floor Wi-Fi Access Point Upgrade',
    content: 'We are installing an additional Wi-Fi 6 access point on the 2nd floor corridor on Saturday between 02:00 PM and 04:00 PM for higher speed coverage.',
    target: 'floor_2',
    targetLabel: '2nd Floor Only',
    createdAt: '2026-09-16 02:00 PM',
    authorName: 'Management',
    priority: 'normal'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-tenant-1',
    targetRole: 'tenant',
    title: 'Dinner Confirmation Reminder',
    message: 'Please confirm if you will be having dinner today before 5:00 PM.',
    category: 'food',
    linkTab: 'food',
    isRead: false,
    createdAt: 'Today, 04:15 PM'
  },
  {
    id: 'notif-2',
    userId: 'user-tenant-1',
    targetRole: 'tenant',
    title: 'Complaint #CMP1024 Updated',
    message: 'Suresh Kumar (Plumbing) updated your complaint status to "In Progress".',
    category: 'complaint',
    linkTab: 'complaints',
    isRead: false,
    createdAt: 'Today, 02:15 PM'
  },
  {
    id: 'notif-3',
    targetRole: 'owner',
    title: 'New Complaint Submitted',
    message: 'Rahul Sharma (Room 204) submitted complaint #CMP1025 for Wi-Fi signal drop.',
    category: 'complaint',
    linkTab: 'complaints',
    isRead: false,
    createdAt: 'Today, 08:45 AM'
  },
  {
    id: 'notif-4',
    userId: 'user-tenant-1',
    targetRole: 'tenant',
    title: 'Rent Due in 5 Days',
    message: 'Your October rent of ₹9,000 is due on 05 October.',
    category: 'rent',
    linkTab: 'rent',
    isRead: true,
    createdAt: 'Yesterday'
  }
];

export const INITIAL_FOOD_STATS: FoodDailyStats = {
  date: '2026-09-19',
  totalTenants: 80,
  breakfast: { confirmed: 58, notAvailable: 16, pending: 6 },
  lunch: { confirmed: 65, notAvailable: 11, pending: 4 },
  dinner: { confirmed: 62, notAvailable: 13, pending: 5 }
};
