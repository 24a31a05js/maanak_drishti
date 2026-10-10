import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Camera,
  FileCheck2,
  FileText,
  AlertTriangle,
  History,
  LogOut,
  User,
  Clock,
  Scale,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';
import { authService } from '../services/authService';
import { reportService } from '../services/reportService';
import { extractProductLabel } from '../services/ocrService';
import InspectorConsumerReports from '../components/InspectorConsumerReports';
import ExtractedLabelDetails from '../components/ExtractedLabelDetails';
import LabelComplianceSection from '../components/LabelComplianceSection';
import ConsumerScanner from '../components/ConsumerScanner';

export default function InspectorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user] = useState(() => authService.getCurrentUser());

  // Report metrics for badges
  const [reportStats, setReportStats] = useState({
    total: 0,
    pending: 0,
    underInvestigation: 0,
    resolved: 0,
    rejected: 0,
  });

  // Inspection Scan state
  const [inspectorScanData, setInspectorScanData] = useState(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/inspector/auth');
    } else if (currentUser.role === 'consumer') {
      navigate('/consumer/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await reportService.getReportStats();
        setReportStats(stats);
      } catch {
        setReportStats(reportService.getReportStatsSync());
      }
    };
    updateStats();

    window.addEventListener('maanak_reports_updated', updateStats);
    return () => window.removeEventListener('maanak_reports_updated', updateStats);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'consumerReports',
      label: 'Consumer Reports',
      icon: AlertOctagon,
      badge: reportStats.pending > 0 ? `${reportStats.pending} New` : null,
      badgeColor: 'bg-rose-900 text-rose-300 border-rose-700',
    },
    { id: 'scan', label: 'Scan & Upload Label', icon: Camera },
    { id: 'verification', label: 'Compliance Verification', icon: FileCheck2 },
    { id: 'records', label: 'Inspection Records', icon: History },
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'violations', label: 'Violation History', icon: AlertTriangle },
  ];

  const handleInspectorScan = async ({ imageData, fileName }) => {
    setIsProcessingScan(true);
    try {
      const extracted = await extractProductLabel(imageData, fileName);
      setInspectorScanData(extracted);
      setActiveTab('verification');
    } catch {
      alert('Failed to parse label. Please try again.');
    } finally {
      setIsProcessingScan(false);
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        item.badgeColor || 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
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
              <div className="bg-gradient-to-r from-slate-800 to-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                      OFFICIAL ENFORCEMENT DESK
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Inspector Verification Desk
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Welcome to your dedicated preliminary compliance workspace. Review citizen grievances, trigger camera/file OCR, and evaluate mandatory declarations under Rule 6.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('consumerReports')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>Review Citizen Grievances ({reportStats.pending} New)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Citizen Grievances</span>
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">{reportStats.total}</div>
                  <p className="text-xs text-slate-400">{reportStats.pending} Pending Review</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Session</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Live Scanner Ready</div>
                  <p className="text-xs text-slate-400">WebRTC camera stream enabled.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Rule Base</span>
                    <Scale className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Rules 2011 (v2.4)</div>
                  <p className="text-xs text-slate-400">Rule 6 declaration checklists active.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Diagnostic Engine</span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Explainable Mode</div>
                  <p className="text-xs text-slate-400">Flags potential issues with citations.</p>
                </div>
              </div>

              {/* Consumer Grievance Prompt Box */}
              {reportStats.pending > 0 && (
                <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {reportStats.pending} Consumer Report(s) Awaiting Inspection Triage
                      </h4>
                      <p className="text-xs text-slate-300">
                        Citizens have reported suspected price tampering, overcharging, or missing packaging declarations.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('consumerReports')}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Open Consumer Reports Module
                  </button>
                </div>
              )}

              {/* Inspection Records Stream */}
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
                    Field Inspection Audit Pipeline
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Upload or scan a packaged commodity label to trigger preliminary compliance checks under Rule 6.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('scan')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Initiate Label Inspection</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONSUMER REPORTS (New Requirement 6 Module) */}
          {activeTab === 'consumerReports' && (
            <InspectorConsumerReports currentUser={user} />
          )}

          {/* TAB 3: SCAN & UPLOAD (Inspector Camera & File Processing) */}
          {activeTab === 'scan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ConsumerScanner
                onScanComplete={handleInspectorScan}
                isProcessing={isProcessingScan}
              />
            </div>
          )}

          {/* TAB 4: COMPLIANCE VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {inspectorScanData ? (
                <>
                  <ExtractedLabelDetails
                    labelData={inspectorScanData}
                    onUpdateDetails={(updated) => setInspectorScanData(updated)}
                  />
                  <LabelComplianceSection labelData={inspectorScanData} />
                </>
              ) : (
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
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
            </div>
          )}

          {/* TAB 5: INSPECTION RECORDS */}
          {activeTab === 'records' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Inspection Records</h3>
              <p className="text-xs text-slate-400">
                Comprehensive repository of all preliminary inspection sessions and cataloged commodity labels.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <History className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Inspection records indexing active.</p>
                <p className="text-xs text-slate-500">Historical records are logged across inspector sessions.</p>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Inspection Reports & Export</h3>
              <p className="text-xs text-slate-400">
                Downloadable diagnostic summaries and formal preliminary audit records.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Reports export module.</p>
                <p className="text-xs text-slate-500">Standardized PDF/CSV export available for active inspection cases.</p>
              </div>
            </div>
          )}

          {/* TAB 7: VIOLATION HISTORY */}
          {activeTab === 'violations' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Violation History & Trends</h3>
              <p className="text-xs text-slate-400">
                Catalog of flagged potential discrepancies for recurring issue tracking across commodity categories.
              </p>
              <div className="py-12 text-center text-slate-500 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">Cross-commodity discrepancy trends.</p>
                <p className="text-xs text-slate-500">Patterns for missing MRP or Unit Sale Price will be highlighted here.</p>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
