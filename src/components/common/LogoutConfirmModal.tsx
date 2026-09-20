import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';
import { User } from '../../types';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <LogOut className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h3 className="text-base font-black text-slate-900">Sign Out of PGEase?</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {currentUser ? (
              <>
                You are signed in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role.toUpperCase()}). You can sign back in anytime.
              </>
            ) : (
              'Are you sure you want to end your current session?'
            )}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
