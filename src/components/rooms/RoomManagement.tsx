import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BedDouble,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Wind,
  Bath,
  Maximize2,
  Trash2,
  Edit2,
  User,
  X
} from 'lucide-react';
import { Room, SharingType } from '../../types';

export const RoomManagement: React.FC = () => {
  const { rooms, createRoom, deleteRoom, updateRoom, tenants, setActiveTab, addToast } = useApp();

  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [sharingFilter, setSharingFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New room form
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    floor: 1,
    sharingType: 'double' as SharingType,
    rentPerBed: 9000,
    securityDeposit: 15000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: false
  });

  const filteredRooms = rooms.filter((r) => {
    if (floorFilter !== 'all' && r.floor !== Number(floorFilter)) return false;
    if (sharingFilter !== 'all' && r.sharingType !== sharingFilter) return false;
    return true;
  });

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.roomNumber) {
      addToast('error', 'Missing Room Number', 'Please provide a valid room number.');
      return;
    }
    const success = createRoom(newRoomData);
    if (success) {
      setIsAddModalOpen(false);
      setNewRoomData({
        roomNumber: '',
        floor: 1,
        sharingType: 'double',
        rentPerBed: 9000,
        securityDeposit: 15000,
        isAC: true,
        hasAttachedBathroom: true,
        hasBalcony: false
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Inventory &amp; Layout</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Room &amp; Bed Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage floor layouts, monitor real-time bed availability, and assign tenants.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Floor:
          </span>
          {['all', '1', '2', '3'].map((fl) => (
            <button
              key={fl}
              onClick={() => setFloorFilter(fl)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                floorFilter === fl
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {fl === 'all' ? 'All Floors' : `Floor ${fl}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Sharing:</span>
          <select
            value={sharingFilter}
            onChange={(e) => setSharingFilter(e.target.value)}
            className="px-3 py-1 text-xs bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Sharing Types</option>
            <option value="single">Single Sharing</option>
            <option value="double">Double Sharing</option>
            <option value="triple">Triple Sharing</option>
          </select>
        </div>
      </div>

      {/* Visual Room & Bed Cards Grid (Section 16 Visual Bed Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isFullyOccupied = room.occupiedBeds >= room.totalBeds;
          return (
            <div
              key={room.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                isFullyOccupied ? 'border-slate-200' : 'border-indigo-200/80 ring-1 ring-indigo-500/10'
              }`}
            >
              {/* Room Card Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">Room {room.roomNumber}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      Floor {room.floor}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold capitalize mt-0.5">
                    {room.sharingType} Sharing • ₹{room.rentPerBed.toLocaleString('en-IN')}/bed
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      room.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.status === 'few_beds_left'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {room.status === 'few_beds_left' ? 'Few Left' : room.status}
                  </span>
                  <button
                    onClick={() => deleteRoom(room.id)}
                    title="Delete Room"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Room Amenities Badges */}
              <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                {room.isAC && (
                  <span className="flex items-center gap-1 text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded">
                    <Wind className="w-3 h-3" /> AC
                  </span>
                )}
                {room.hasAttachedBathroom && (
                  <span className="flex items-center gap-1 text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                    <Bath className="w-3 h-3" /> Attached Bath
                  </span>
                )}
                {room.hasBalcony && (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    <Maximize2 className="w-3 h-3" /> Balcony
                  </span>
                )}
              </div>

              {/* Visual Beds Representation (Section 16) */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Bed Allocation Matrix:</span>
                  <span className="font-semibold text-slate-500">
                    {room.occupiedBeds} / {room.totalBeds} Occupied
                  </span>
                </div>

                <div className="space-y-2">
                  {room.beds.map((bed) => {
                    const isOccupied = bed.status === 'occupied';
                    return (
                      <div
                        key={bed.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          isOccupied
                            ? 'bg-slate-50 border-slate-200 text-slate-800'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isOccupied ? 'bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white'
                            }`}
                          >
                            B{bed.bedNumber}
                          </div>
                          <div>
                            <span className="font-bold block">
                              Bed {bed.bedNumber} — {isOccupied ? 'Occupied' : 'Available'}
                            </span>
                            {isOccupied && bed.tenantName ? (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <User className="w-3 h-3 text-indigo-600" /> {bed.tenantName}
                              </span>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-medium">
                                Ready for tenant move-in
                              </span>
                            )}
                          </div>
                        </div>

                        {!isOccupied ? (
                          <button
                            onClick={() => setActiveTab('tenants')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-2xs"
                          >
                            Assign
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200/80 text-slate-600 rounded">
                            Allocated
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room Deposit & Rent Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Security Deposit:</span>
                <span className="font-bold text-slate-800">₹{room.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Add New Room</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 205"
                    value={newRoomData.roomNumber}
                    onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newRoomData.floor}
                    onChange={(e) => setNewRoomData({ ...newRoomData, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sharing Type</label>
                  <select
                    value={newRoomData.sharingType}
                    onChange={(e) => setNewRoomData({ ...newRoomData, sharingType: e.target.value as SharingType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="single">Single (1 Bed)</option>
                    <option value="double">Double (2 Beds)</option>
                    <option value="triple">Triple (3 Beds)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rent / Bed (₹)</label>
                  <input
                    type="number"
                    step={500}
                    value={newRoomData.rentPerBed}
                    onChange={(e) => setNewRoomData({ ...newRoomData, rentPerBed: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  step={1000}
                  value={newRoomData.securityDeposit}
                  onChange={(e) => setNewRoomData({ ...newRoomData, securityDeposit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoomData.isAC}
                    onChange={(e) => setNewRoomData({ ...newRoomData, isAC: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Air Conditioning (AC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoomData.hasAttachedBathroom}
                    onChange={(e) => setNewRoomData({ ...newRoomData, hasAttachedBathroom: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Attached Washroom</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoomData.hasBalcony}
                    onChange={(e) => setNewRoomData({ ...newRoomData, hasBalcony: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Balcony Access</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
