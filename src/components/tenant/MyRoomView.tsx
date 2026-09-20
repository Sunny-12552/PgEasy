import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BedDouble,
  Users,
  Wifi,
  Wind,
  Bath,
  IndianRupee,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Key
} from 'lucide-react';

export const MyRoomView: React.FC = () => {
  const { pgProfile, tenants, rooms, currentUser } = useApp();

  const myRoom = rooms.find((r) => r.roomNumber === '204') || rooms[0];
  const roommates = tenants.filter((t) => t.roomNumber === '204');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Accommodation Details</span>
        <h1 className="text-2xl font-black text-slate-900 mt-0.5">My Room &amp; Inventory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Room 204 • Floor 2 • Double Sharing AC • GreenNest Premium PG
        </p>
      </div>

      {/* Room Specifications & Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Info Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BedDouble className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Room Specifications</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Allocated Bed</span>
              <span className="font-black text-indigo-700 text-sm">Bed 1 (Window Side)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Sharing Type</span>
              <span className="font-bold text-slate-900 capitalize">{myRoom.sharingType} Sharing</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Monthly Rent</span>
              <span className="font-black text-slate-900">₹{myRoom.rentPerBed.toLocaleString('en-IN')}/mo</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Security Deposit</span>
              <span className="font-bold text-slate-800">₹{myRoom.securityDeposit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Air Conditioning:</span>
              <span className="font-semibold text-emerald-700">1.5 Ton Split AC Included</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Washroom:</span>
              <span className="font-semibold text-slate-800">Attached Western Bathroom with Geyser</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Housekeeping:</span>
              <span className="font-semibold text-slate-800">Daily cleaning (09:30 AM)</span>
            </div>
          </div>
        </div>

        {/* Roommates Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Roommates in Room 204</h3>
          </div>

          <div className="space-y-3">
            {roommates.map((mate) => (
              <div
                key={mate.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  mate.id === currentUser?.tenantId
                    ? 'bg-indigo-50/50 border-indigo-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                    {mate.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{mate.name}</span>
                      {mate.id === currentUser?.tenantId && (
                        <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">Bed {mate.bedNumber} • {mate.workplace}</span>
                  </div>
                </div>

                <a
                  href={`tel:${mate.phone}`}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold flex items-center gap-1 hover:bg-slate-50"
                >
                  <Phone className="w-3 h-3 text-emerald-600" /> Call
                </a>
              </div>
            ))}
          </div>

          {/* Wi-Fi Credentials Pill */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase block">Wi-Fi Network</span>
              <span className="font-mono font-bold text-slate-900">GreenNest_5G_Floor2</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-indigo-600 uppercase block">Password</span>
              <span className="font-mono font-bold text-slate-900">Nest@Bengaluru99</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Rules Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Community Living Rules &amp; Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {pgProfile.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
