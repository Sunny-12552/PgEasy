import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, ShieldCheck, Download, Eye, Upload, CheckCircle2 } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const handleDownloadDoc = (docName: string) => {
    addToast('success', 'Download Started', `Downloading official ${docName} PDF...`);
  };

  const handleUploadNew = () => {
    addToast('info', 'Upload Document', 'Select document (PDF or JPG) to upload for manager verification.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">KYC &amp; Legal</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Documents &amp; Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your signed lease agreement, verified ID proof, and police verification clearance.
          </p>
        </div>

        <button
          onClick={handleUploadNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* KYC Status Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950">KYC Status: Fully Verified</h4>
            <p className="text-emerald-800">All identity and police verification formalities are 100% completed.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white text-emerald-700 font-bold rounded-lg border border-emerald-300">
          Clearance #KA-BLR-8912
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Official Rental Agreement</h4>
              <p className="text-xs text-slate-500 mt-0.5">11 Months Lease • Signed by Owner &amp; Resident</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid until August 2027
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDownloadDoc('Rental_Agreement_Rahul_Sharma')}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Aadhaar Card (Masked)</h4>
              <p className="text-xs text-slate-500 mt-0.5">ID Proof UID: XXXX-XXXX-9812</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> UIDAI Verified
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDownloadDoc('Aadhaar_Card_Masked')}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Police Verification Certificate</h4>
              <p className="text-xs text-slate-500 mt-0.5">Bengaluru City Police Commissionerate</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved No Objection
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDownloadDoc('Police_Verification_Report')}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">PG Handbook &amp; House Rules</h4>
              <p className="text-xs text-slate-500 mt-0.5">GreenNest Coliving Community Policy</p>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-2">
                PDF Document • 4 Pages
              </span>
            </div>
          </div>
          <button
            onClick={() => handleDownloadDoc('PG_Rules_Handbook')}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
