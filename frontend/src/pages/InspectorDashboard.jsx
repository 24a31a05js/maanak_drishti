import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Camera,
  Upload,
  FileCheck2,
  FileText,
  AlertTriangle,
  History,
  LogOut,
  User,
  Info,
  Clock,
  ChevronRight,
  Search,
  Scale,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService';

export default function InspectorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/inspector/auth');
    } else if (currentUser.role === 'consumer') {
      navigate('/consumer/dashboard');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan & Upload Label', icon: Camera },
    { id: 'verification', label: 'Compliance Verification', icon: FileCheck2 },
    { id: 'records', label: 'Inspection Records', icon: History },
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'violations', label: 'Violation History', icon: AlertTriangle },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      
      {/* Top Inspector Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand & Workspace Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-wide block">
                  MAANAK DRISHTI
                </span>
                <span className="text-[10px] text-sky-400 font-mono block -mt-1">
                  Inspector Workspace
                </span>
              </div>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
              Legal Metrology Rules, 2011
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-200 font-medium">{user?.name || 'Field Officer'}</span>
              {user?.inspectorId && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                  {user.inspectorId}
                </span>
              )}
              {user?.isDemoAccount && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  DEMO JURY
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 hover:border-rose-800 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Main Panel */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-grow flex flex-col md:flex-row gap-6">
        
        {/* Workspace Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1 sticky top-20 shadow-lg">
            <div className="px-3 py-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Enforcement Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-700/70 px-3 pb-2 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold block mb-0.5">Statutory Standard</span>
              <p className="leading-snug text-slate-500">
                Rule 6 Declarations under Legal Metrology Act, 2009.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                      OFFICIAL ENFORCEMENT DESK
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Inspector Verification Desk
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Welcome to your dedicated preliminary compliance workspace. Upload product package images to trigger OCR and evaluate mandatory declarations under Rule 6.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('scan')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Initiate New Inspection</span>
                  </button>
                </div>
              </div>

              {/* Status Overview Cards (No fake statistics, realistic session states) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Session</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Ready for Scanning</div>
                  <p className="text-xs text-slate-400">Camera / File input stream available.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Rule Base</span>
                    <Scale className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Rules 2011 (v2.4)</div>
                  <p className="text-xs text-slate-400">Mandatory Rule 6 declaration checklists active.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Diagnostic Engine</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Explainable Mode</div>
                  <p className="text-xs text-slate-400">Flags potential issues with legal citations.</p>
                </div>
              </div>

              {/* Empty State Table for Inspection Records */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <h3 className="text-base font-bold text-white">Recent Field Inspections</h3>
                  <span className="text-xs text-slate-400">Session Audit Stream</span>
                </div>

                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700/60 text-slate-400 flex items-center justify-center mx-auto">
                    <History className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">
                    No Inspections Recorded in Current Session
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Once you upload or scan a packaged commodity label, preliminary compliance flags and structured records will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('scan')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Product Label</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SCAN & UPLOAD */}
          {activeTab === 'scan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Scan or Upload Product Label</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Capture or select a high-resolution photograph of the commodity packaging showing mandatory printed declarations.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-2xl p-8 text-center bg-slate-900/60 transition-colors">
                  <input
                    type="file"
                    id="label-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="label-upload" className="cursor-pointer block space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/30">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white hover:text-sky-400 block">
                        Click to select image or drag & drop here
                      </span>
                      <span className="text-xs text-slate-500 block mt-1">
                        PNG, JPG, or WEBP (Max: 10MB) • Ensure legible packaging text
                      </span>
                    </div>
                  </label>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-sky-400" />
                      <div>
                        <span className="text-sm font-semibold text-white block">{selectedFile.name}</span>
                        <span className="text-xs text-slate-400 block">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Ready for OCR preprocessing
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('verification')}
                      className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Run Preliminary Check
                    </button>
                  </div>
                )}

                {/* Backend Integration Note */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>OCR & Verification Engine:</strong> The frontend upload interface is active. In the subsequent development phase, this pipeline connects to the FastAPI OCR and Legal Metrology rule engine.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: COMPLIANCE VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-xl font-bold text-white">Compliance Verification Engine</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Statutory Rule 6 Checklist under Legal Metrology (Packaged Commodities) Rules, 2011.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-sky-950 text-sky-300 border border-sky-800">
                  Rule 6 Checklist
                </span>
              </div>

              {/* Empty state verification view */}
              <div className="p-8 text-center space-y-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <FileCheck2 className="w-10 h-10 text-sky-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No Active Product Analysis Session</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Upload or scan a packaged commodity label to trigger automatic field extraction for MRP, Net Quantity, Packing Date, and Manufacturer details.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('scan')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Go to Scan & Upload
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INSPECTION RECORDS */}
          {activeTab === 'records' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Inspection Records</h3>
              <p className="text-xs text-slate-400">
                Comprehensive repository of all preliminary inspection sessions and cataloged commodity labels.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <History className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No inspection records logged yet.</p>
                <p className="text-xs text-slate-500">Historical records will be stored and indexed when inspections are verified.</p>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Inspection Reports</h3>
              <p className="text-xs text-slate-400">
                Downloadable diagnostic summaries and formal preliminary audit records.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No inspection reports generated yet.</p>
                <p className="text-xs text-slate-500">Standardized PDF/CSV reports will be available for export upon completing inspections.</p>
              </div>
            </div>
          )}

          {/* TAB 6: VIOLATION HISTORY */}
          {activeTab === 'violations' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Violation History & Trends</h3>
              <p className="text-xs text-slate-400">
                Catalog of flagged potential discrepancies for recurring issue tracking across commodity categories.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No violation flags in history.</p>
                <p className="text-xs text-slate-500">Discrepancy logs will populate once real products with missing declarations are scanned.</p>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
