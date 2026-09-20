import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Pin, AlertTriangle, Calendar, Users, X, Send } from 'lucide-react';
import { Announcement } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const { announcements, createAnnouncement, currentUser, addToast } = useApp();
  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'super_admin';

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'All Tenants' as const,
    priority: 'Normal' as 'Normal' | 'Important' | 'Urgent',
    isPinned: false
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      addToast('error', 'Missing Information', 'Please provide a title and notice description.');
      return;
    }
    createAnnouncement(formData);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      content: '',
      targetAudience: 'All Tenants',
      priority: 'Normal',
      isPinned: false
    });
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Community &amp; Notices</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Announcements &amp; Notice Board</h1>
          <p className="text-xs text-slate-500 mt-1">
            Important updates, maintenance alerts, and festival announcements for all residents.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Notice
          </button>
        )}
      </div>

      {/* Announcements Cards Feed */}
      <div className="space-y-4">
        {sortedAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-2xl border transition-all bg-white shadow-2xs ${
              ann.isPinned ? 'border-indigo-300 ring-1 ring-indigo-500/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {ann.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    <Pin className="w-3 h-3 text-indigo-600" /> Pinned Notice
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    ann.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : ann.priority === 'Important'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {ann.priority} Priority
                </span>
                <span className="text-[11px] text-slate-400">Target: {ann.targetAudience}</span>
              </div>

              <span className="text-xs text-slate-400 font-medium">{ann.createdAt}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-3">{ann.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{ann.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Posted by: {ann.author}</span>
              <span className="font-semibold text-slate-500">PGEase Broadcast Network</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Create New Notice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Water Tank Cleaning"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="All Tenants">All Residents</option>
                    <option value="Floor 1">Floor 1 Only</option>
                    <option value="Floor 2">Floor 2 Only</option>
                    <option value="Floor 3">Floor 3 Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the maintenance schedule, timings, instructions for residents..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Pin notice to the top of resident feeds</span>
              </label>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
