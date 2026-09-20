import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  IndianRupee,
  UtensilsCrossed,
  MessageSquareWarning,
  BedDouble,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wifi,
  Wind,
  Shirt,
  Sparkles,
  Zap,
  Bike,
  Flame,
  ArrowRight,
  Filter,
  Check,
  Send,
  X,
  ExternalLink
} from 'lucide-react';
import { SharingType, Room } from '../../types';
import { PgRoomCarousel } from './PgRoomCarousel';
import { LoginModal } from '../common/LoginModal';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';
import { LogOut } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { pgProfile, rooms, currentUser, logout, loginAs, setIsPublicView, setActiveTab, addToast } = useApp();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Filters for public rooms
  const [sharingFilter, setSharingFilter] = useState<string>('all');
  const [acFilter, setAcFilter] = useState<string>('all');
  const [maxRent, setMaxRent] = useState<number>(20000);

  // Enquiry Modal state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedRoomForEnquiry, setSelectedRoomForEnquiry] = useState<Room | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    sharingType: 'double',
    moveInDate: '2026-10-01',
    message: ''
  });

  const filteredRooms = rooms.filter((room) => {
    if (sharingFilter !== 'all' && room.sharingType !== sharingFilter) return false;
    if (acFilter === 'ac' && !room.isAC) return false;
    if (acFilter === 'non-ac' && room.isAC) return false;
    if (room.rentPerBed > maxRent) return false;
    return true;
  });

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      addToast('error', 'Incomplete Form', 'Please provide your name and phone number.');
      return;
    }
    setIsEnquiryOpen(false);
    addToast('success', 'Enquiry Submitted', `Thank you ${enquiryForm.name}! The PG manager will contact you at ${enquiryForm.phone} shortly.`);
    setEnquiryForm({
      name: '',
      phone: '',
      email: '',
      sharingType: 'double',
      moveInDate: '2026-10-01',
      message: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Available</span>;
      case 'few_beds_left':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Few Beds Left</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">Occupied</span>;
    }
  };

  const getRoomPhoto = (room: Room) => {
    if (room.sharingType === 'single') {
      return 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80';
    }
    if (room.sharingType === 'triple') {
      return 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80';
    }
    if (room.sharingType === 'four_sharing') {
      return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-black flex items-center justify-center text-xl shadow-sm">
              PG
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">PGEase</span>
              <span className="text-[10px] text-indigo-600 font-bold ml-1.5 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                SaaS
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-indigo-600 transition-colors">About PG</a>
            <a href="#rooms" className="hover:text-indigo-600 transition-colors">Rooms &amp; Rent</a>
            <a href="#facilities" className="hover:text-indigo-600 transition-colors">Facilities</a>
            <a href="#food" className="hover:text-indigo-600 transition-colors">Food Menu</a>
            <a href="#rules" className="hover:text-indigo-600 transition-colors">Rules</a>
            <a href="#location" className="hover:text-indigo-600 transition-colors">Location</a>
            <a href="#saas-features" className="text-indigo-600 hover:text-indigo-700 font-bold">SaaS Platform</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPublicView(false);
                    setActiveTab('dashboard');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>Go to {currentUser.role === 'owner' ? 'Admin' : currentUser.role === 'tenant' ? 'Resident' : 'Staff'} Portal</span>
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  title="Logout"
                  className="px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Sign In / Login
              </button>
            )}

            <button
              onClick={() => {
                setSelectedRoomForEnquiry(null);
                setIsEnquiryOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Book / Enquire
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Verified Premium PG Living • Marathahalli, Bengaluru
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart PG Management. <br />
                <span className="text-indigo-600">Simple Living.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Manage rooms, tenants, rent payments, food counts and complaints from one simple platform. Experience hassle-free stay at <strong className="text-slate-900">{pgProfile.name}</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#rooms"
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <BedDouble className="w-4 h-4" />
                  View Available Rooms
                </a>
                <a
                  href="#location"
                  className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Contact PG
                </a>
                <button
                  onClick={() => {
                    loginAs('owner');
                    setIsPublicView(false);
                  }}
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  View Live Demo
                </button>
              </div>

              {/* Verified Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-slate-900">50+</div>
                  <div className="text-xs text-slate-500 font-medium">Rooms Managed</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-emerald-600">98%</div>
                  <div className="text-xs text-slate-500 font-medium">Rent Collection</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-indigo-600">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Tenant Support</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                    4.8 <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Resident Rating</div>
                </div>
              </div>
            </div>

            {/* Right Hero Moving Room Pictures Carousel */}
            <div className="lg:col-span-5">
              <PgRoomCarousel
                pgName={pgProfile.name}
                onOpenEnquiry={(room) => {
                  setSelectedRoomForEnquiry(room || null);
                  setIsEnquiryOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 29: SaaS Marketing Features */}
      <section id="saas-features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Modern Indian Property Management
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Run Your PG Smarter.
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Rent collection, food planning, complaints, rooms and tenant management — all in one simple platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Smart Rent Collection */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Rent Collection</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automated monthly rent invoicing with UPI QR, Card, and Net Banking simulation. Automatic daily late penalty calculation to incentivize on-time payments.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-indigo-600 font-semibold">
                Auto Late Penalty • Instant Receipts
              </div>
            </div>

            {/* Card 2: Food Planning */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Food Planning &amp; Counts</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Daily automated cutoff reminders: "Will you be having dinner today?" Tenants tap YES or NO. PG owners see exact headcount to cut grocery wastage.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-emerald-600 font-semibold">
                Cutoff Timers • Headcount Dashboard
              </div>
            </div>

            {/* Card 3: Room Management */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Visual Bed Management</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Floor-wise visual bed matrix. View which bed in Room 204 is occupied and which is vacant. 1-click bed assignment with deposit and rent sync.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-blue-600 font-semibold">
                Single / Double / Triple • Visual Beds
              </div>
            </div>

            {/* Card 4: Complaint Tracking */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Complaint Tracking</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tenants log maintenance issues with category, priority, and photo. Owner assigns plumbing/electrician staff with live status updates and notifications.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-amber-600 font-semibold">
                Staff Assignment • Audit Logs
              </div>
            </div>

            {/* Card 5: Tenant Management */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Resident Profiles &amp; KYC</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Digital directory with Aadhaar/PAN tracking, emergency contacts, workplace info, payment status, and 30-day notice period workflows.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-purple-600 font-semibold">
                Digital KYC • Emergency Contacts
              </div>
            </div>

            {/* Card 6: Reports & Analytics */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reports &amp; Analytics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Visual charts for monthly collections, overdue penalties, occupancy rate trends, daily meal consumption graphs, and 1-click CSV export.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs text-rose-600 font-semibold">
                Interactive Recharts • CSV Export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 4 & 5: Public PG Profile & Room Availability */}
      <section id="rooms" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* PG Overview Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Property Profile</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{pgProfile.name}</h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  {pgProfile.address}, {pgProfile.area}, {pgProfile.city} - {pgProfile.pincode}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase block">Starting Rent</span>
                  <span className="text-lg font-black text-indigo-700">₹{pgProfile.startingRent.toLocaleString('en-IN')}<span className="text-xs font-normal">/mo</span></span>
                </div>
                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Security Deposit</span>
                  <span className="text-lg font-black text-slate-800">₹{pgProfile.standardDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase block">Total Rooms</span>
                  <span className="text-lg font-black text-emerald-700">50 Rooms</span>
                </div>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters:
                </span>
                {['all', 'single', 'double', 'triple'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSharingFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      sharingFilter === type
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? 'All Sharing' : `${type} Sharing`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={acFilter}
                  onChange={(e) => setAcFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="all">All (AC &amp; Non-AC)</option>
                  <option value="ac">AC Only</option>
                  <option value="non-ac">Non-AC Only</option>
                </select>

                <button
                  onClick={() => {
                    setSharingFilter('all');
                    setAcFilter('all');
                    setMaxRent(20000);
                  }}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
              const availableBedsCount = room.beds.filter((b) => b.status === 'available').length;
              return (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Room Photo Preview */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={getRoomPhoto(room)}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] shadow-sm">
                        Floor {room.floor}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(room.status)}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                      <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md capitalize">
                        {room.sharingType.replace('_', ' ')} Sharing
                      </span>
                      {room.isAC ? (
                        <span className="bg-indigo-600/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold">
                          AC Room
                        </span>
                      ) : (
                        <span className="bg-slate-800/80 backdrop-blur-xs px-2 py-0.5 rounded-md">
                          Non-AC
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Card Header */}
                  <div className="p-4 border-b border-slate-100 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">Room {room.roomNumber}</h4>
                        <span className="text-xs text-slate-400 font-medium">Floor {room.floor}</span>
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold capitalize mt-0.5">
                        {room.sharingType} Sharing {room.isAC ? '• AC' : '• Non-AC'}
                      </p>
                    </div>
                  </div>

                  {/* Room Body */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="flex items-baseline justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Rent</span>
                        <span className="text-xl font-black text-slate-900">
                          ₹{room.rentPerBed.toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500">/bed</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Deposit</span>
                        <span className="text-xs font-bold text-slate-700">₹{room.securityDeposit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Beds Availability representation */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">Bed Availability</span>
                        <span className="font-bold text-slate-900">
                          {availableBedsCount} / {room.totalBeds} Available
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {room.beds.map((bed) => (
                          <div
                            key={bed.id}
                            className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-bold border ${
                              bed.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            Bed {bed.bedNumber}: {bed.status === 'available' ? 'Open' : 'Taken'}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Facilities Tags */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                        Room Features
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {room.facilities.slice(0, 4).map((fac, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Room Card Footer CTA */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedRoomForEnquiry(room);
                        setIsEnquiryOpen(true);
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs text-center"
                    >
                      Book / Enquire Room
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Facilities & Amenities */}
      <section id="facilities" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              World Class Amenities
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">Everything Included In Your Stay</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">Zero hidden charges. High-speed internet, power backup, and food included.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgProfile.facilities.map((fac, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                  {idx === 0 && <Wifi className="w-5 h-5" />}
                  {idx === 1 && <Wind className="w-5 h-5" />}
                  {idx === 2 && <Shirt className="w-5 h-5" />}
                  {idx === 3 && <Sparkles className="w-5 h-5" />}
                  {idx === 4 && <ShieldCheck className="w-5 h-5" />}
                  {idx === 5 && <Zap className="w-5 h-5" />}
                  {idx === 6 && <Bike className="w-5 h-5" />}
                  {idx === 7 && <Flame className="w-5 h-5" />}
                  {idx === 8 && <UtensilsCrossed className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{fac.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Food Management & Daily Menu */}
      <section id="food" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Hygienic Homely Meals
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">3 Times Daily Food Service</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">Cooked fresh daily with automated meal count planning to ensure optimal quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Morning</span>
                  <h4 className="text-lg font-extrabold text-slate-900">Breakfast</h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg">
                  07:30 - 09:30 AM
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Hot Idli Sambar &amp; Chutney / Poha</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Masala Dosa / Upma / Poori Masala</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Fresh Filter Coffee &amp; Masala Tea</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Boiled Eggs (Optional)</li>
              </ul>
            </div>

            {/* Lunch */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Afternoon</span>
                  <h4 className="text-lg font-extrabold text-slate-900">Lunch</h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg">
                  12:30 - 02:30 PM
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Steamed Rice &amp; Dal Tadka</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Paneer Butter Masala / Aloo Gobi</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Fresh Phulkas / Rotis</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Fresh Curd, Pickle, &amp; Papad</li>
              </ul>
            </div>

            {/* Dinner */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Evening</span>
                  <h4 className="text-lg font-extrabold text-slate-900">Dinner</h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg">
                  07:45 - 10:00 PM
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Jeera Rice &amp; Dal Makhani</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Veg Kadai &amp; Butter Chapati</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Green Salad, Rasam &amp; Buttermilk</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Sunday Special: Veg / Chicken Biryani</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PG Rules & Location Section */}
      <section id="rules" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Rules */}
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Community Guidelines
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-3">PG Rules &amp; Policies</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">Designed to maintain safety, cleanliness, and peace of mind for every resident.</p>

              <div className="space-y-3">
                {pgProfile.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Google Maps Style Section */}
            <div id="location">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Prime Bengaluru Location
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-3">Close to Major Tech Parks</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">Quick commute to Bellandur, Outer Ring Road, and Whitefield tech hubs.</p>

              {/* Interactive Google Maps Simulation Container */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
                {/* Simulated Map Visual Header */}
                <div className="h-56 bg-slate-200 relative flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)]"
                    style={{ backgroundSize: '16px 16px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Simulated Map Pin */}
                    <div className="text-center transform -translate-y-4">
                      <div className="relative inline-flex">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <div className="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-2 bg-white px-3 py-1 rounded-lg shadow-md border border-slate-200 text-xs font-bold text-slate-900">
                        {pgProfile.name}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-slate-600 font-mono">
                    Marathahalli ORR, Bengaluru
                  </div>
                </div>

                {/* Nearby landmarks */}
                <div className="p-4 bg-white divide-y divide-slate-100 text-xs">
                  <div className="pb-2.5">
                    <span className="font-bold text-slate-800">Nearby Tech Parks &amp; Hubs:</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {pgProfile.locationDetails.nearbyLandmarks.map((mark, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                          {mark}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2.5 flex items-center justify-between text-slate-600">
                    <span>Manager Phone: <strong className="text-slate-900">{pgProfile.phone}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedRoomForEnquiry(null);
                        setIsEnquiryOpen(true);
                      }}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Public Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  PG
                </div>
                <span className="text-lg font-black tracking-tight">PGEase</span>
              </div>
              <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                Modern PG Management SaaS platform for Indian coliving and hostels. Enables PG owners to manage rent, food counts, complaints, and rooms effortlessly.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => loginAs('owner')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs"
                >
                  Owner Login
                </button>
                <button
                  onClick={() => loginAs('tenant')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs"
                >
                  Resident Login
                </button>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#about" className="hover:text-white">Property Details</a></li>
                <li><a href="#rooms" className="hover:text-white">Room Availability</a></li>
                <li><a href="#facilities" className="hover:text-white">Facilities &amp; Amenities</a></li>
                <li><a href="#food" className="hover:text-white">Food Menu</a></li>
                <li><a href="#rules" className="hover:text-white">Rules &amp; Timings</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contact PG</h5>
              <p className="text-slate-400 leading-relaxed">
                {pgProfile.name}<br />
                {pgProfile.address}<br />
                Marathahalli, Bengaluru - 560037
              </p>
              <p className="text-slate-300 font-semibold mt-2">
                Phone: {pgProfile.phone}<br />
                Email: {pgProfile.email}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} PGEase PG Management Platform. Built for Indian PG Owners &amp; Residents.</p>
            <div className="flex items-center gap-4">
              <span>UPI: {pgProfile.upiId}</span>
              <span>•</span>
              <span>24/7 Helpline: {pgProfile.phone}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Book / Enquire Modal */}
      {isEnquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedRoomForEnquiry ? `Enquire for Room ${selectedRoomForEnquiry.roomNumber}` : 'Book / Enquire Room'}
                </h4>
                <p className="text-xs text-slate-500">{pgProfile.name}, Marathahalli</p>
              </div>
              <button onClick={() => setIsEnquiryOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sharing Preference</label>
                  <select
                    value={enquiryForm.sharingType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, sharingType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="single">Single Sharing</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Move-in</label>
                  <input
                    type="date"
                    value={enquiryForm.moveInDate}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, moveInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Any specific requirement?</label>
                <textarea
                  rows={2}
                  placeholder="Need AC room, work from home desk, parking, etc."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign In / Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

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
