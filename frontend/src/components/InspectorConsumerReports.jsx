import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Phone,
  Mail,
  AlertOctagon,
  X,
  Lock,
} from 'lucide-react';
import { reportService } from '../services/reportService';

export default function InspectorConsumerReports({ currentUser }) {
  const [reports, setReports] = useState(() => reportService.getReports(currentUser));
  const [stats, setStats] = useState(() => reportService.getReportStatsSync());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [activeReport, setActiveReport] = useState(null);

  // Inspector action states in detail modal
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('notes'); // 'notes' | 'investigate' | 'resolve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const isAuthorized = currentUser?.role === 'inspector';

  const loadData = useCallback(async () => {
    if (!isAuthorized) return;
    try {
      const all = await reportService.getReportsAsync(currentUser);
      setReports(all);
      const st = await reportService.getReportStats();
      setStats(st);
    } catch {
      const local = reportService.getReports(currentUser);
      setReports(local);
      setStats(reportService.getReportStatsSync());
    }
  }, [currentUser, isAuthorized]);

  useEffect(() => {
    loadData();
    // Listen for real-time cross-tab updates
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('maanak_reports_updated', handleUpdate);
    return () => window.removeEventListener('maanak_reports_updated', handleUpdate);
  }, [loadData]);

  if (!isAuthorized) {
    return (
      <div className="p-8 rounded-3xl bg-rose-950/40 border border-rose-800 text-center space-y-3">
        <Lock className="w-10 h-10 text-rose-400 mx-auto" />
        <h4 className="text-lg font-bold text-white">Authorized Access Restricted</h4>
        <p className="text-xs text-rose-300 max-w-md mx-auto">
          The Consumer Reports Enforcement Module is restricted to verified Legal Metrology department inspector sessions. Please sign in with an inspector profile.
        </p>
      </div>
    );
  }

  // Filtered reports
  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.manufacturer && rep.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || rep.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || rep.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800">
            Medium Priority
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-sky-950 text-sky-300 border border-sky-800">
            Low Priority
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending Review</span>
          </span>
        );
      case 'Under Investigation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-950/80 text-sky-300 border border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>Under Investigation</span>
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Resolved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <XCircle className="w-3 h-3 text-slate-400" />
            <span>Rejected</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  // Handle status update by inspector
  const handleUpdateStatus = async (newStatus) => {
    if (!activeReport) return;
    setActionLoading(true);
    setActionSuccess('');

    try {
      const updateData = {
        status: newStatus,
        inspectorNotes: actionNotes
          ? `${activeReport.investigationNotes ? activeReport.investigationNotes + '\n' : ''}[${new Date().toLocaleDateString()}] ${actionNotes}`
          : activeReport.investigationNotes,
        rejectionReason: newStatus === 'Rejected' ? rejectionReason : activeReport.rejectionReason,
        inspectorId: currentUser?.inspectorId || 'INS-OFFICIAL',
        note: `Inspector updated status to ${newStatus}`,
      };

      const updated = await reportService.updateReportStatus(activeReport.id, updateData);
      setActiveReport(updated);
      setActionSuccess(`Report status updated to "${newStatus}" successfully.`);
      setActionNotes('');
      setRejectionReason('');
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to update report status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider block">
            CITIZEN GRIEVANCE DESK
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-0.5">
            Consumer Reports & Grievance Pipeline
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live stream of packaged commodity grievances filed by consumers. Authorized inspectors can review OCR findings, initiate statutory inquiries, and record investigative determinations.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl text-xs font-mono bg-sky-950 text-sky-300 border border-sky-800 self-start sm:self-center">
          Officer: {currentUser?.name || 'Inspector'}
        </span>
      </div>

      {/* METRIC CARDS (Total, Pending, Under Investigation, Resolved) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Reports</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-400">All filed citizen reports</p>
        </div>

        <div className="bg-slate-800/80 border border-amber-800/60 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {stats.pending}
          </div>
          <p className="text-[11px] text-slate-400">Awaiting inspection officer triage</p>
        </div>

        <div className="bg-slate-800/80 border border-sky-800/60 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-300">
            <span>Under Investigation</span>
            <AlertOctagon className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-mono">
            {stats.underInvestigation}
          </div>
          <p className="text-[11px] text-slate-400">Active inquiries in progress</p>
        </div>

        <div className="bg-slate-800/80 border border-emerald-800/60 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
            {stats.resolved}
          </div>
          <p className="text-[11px] text-slate-400">Completed determinations</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-800/70 border border-slate-700/80 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Product Name, Report ID, or Brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* REPORTS TABLE */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        {filteredReports.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">No Consumer Reports Found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {stats.total === 0
                ? 'When consumers file packaging grievances through the citizen portal or after scanning a product, real submitted reports will populate here.'
                : 'No reports match your current search or filter criteria. Try resetting the filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-700 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Report ID</th>
                  <th className="py-3.5 px-4 font-semibold">Product Name</th>
                  <th className="py-3.5 px-4 font-semibold">Date Submitted</th>
                  <th className="py-3.5 px-4 font-semibold">Category / Issue</th>
                  <th className="py-3.5 px-4 font-semibold">Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-700/40 transition-colors"
                  >
                    {/* Report ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {report.id}
                    </td>

                    {/* Product Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white max-w-[200px] truncate" title={report.productName}>
                        {report.productName}
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-[200px] truncate">
                        {report.manufacturer || 'Manufacturer Not declared'}
                      </div>
                    </td>

                    {/* Date Submitted */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                      {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Report Category */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <span className="text-slate-200 truncate block" title={report.reason}>
                        {report.reason}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(report.priority)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReport(report);
                          setActionSuccess('');
                          setActionNotes('');
                          setRejectionReason('');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] shadow-sm transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REPORT DETAILS & INVESTIGATION MODAL */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-950 text-sky-300 border border-sky-800">
                    REPORT DOSSIER
                  </span>
                  <span className="text-base font-mono font-extrabold text-sky-400">
                    {activeReport.id}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeReport.productName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Submitted: {new Date(activeReport.submittedAt).toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>Priority: {getPriorityBadge(activeReport.priority)}</span>
                  <span>•</span>
                  <span>Status: {getStatusBadge(activeReport.status)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success message banner */}
            {actionSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Report Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left Column: Descriptions & Details */}
              <div className="md:col-span-7 space-y-4 text-xs">
                {/* Issue Description */}
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Suspected Packaging Violation / Reason
                  </span>
                  <h4 className="font-bold text-rose-300 text-sm">{activeReport.reason}</h4>
                  <p className="text-slate-300 leading-relaxed pt-1">
                    {activeReport.description}
                  </p>
                </div>

                {/* Declared Commodity Details */}
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Extracted Packaging Details
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">MANUFACTURER</span>
                      <span className="font-semibold text-white">{activeReport.manufacturer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">MAXIMUM RETAIL PRICE</span>
                      <span className="font-semibold text-white">{activeReport.mrp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">NET QUANTITY</span>
                      <span className="font-semibold text-white">{activeReport.netQuantity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">CONSUMER CARE</span>
                      <span className="font-semibold text-white">{activeReport.consumerCare}</span>
                    </div>
                  </div>
                </div>

                {/* Consumer Contact Details (Visible to Authorized Inspector) */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                      Consumer Contact Information
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      CONFIDENTIAL INSPECTOR ACCESS
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeReport.consumerName || 'Anonymous Consumer'}</span>
                    </div>
                    {activeReport.consumerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{activeReport.consumerEmail}</span>
                      </div>
                    )}
                    {activeReport.consumerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{activeReport.consumerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Submitted Photo & Compliance Findings */}
              <div className="md:col-span-5 space-y-4 text-xs">
                {/* Submitted Packaging Image */}
                <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Product Label Photo
                  </span>
                  {activeReport.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800 flex items-center justify-center">
                      <img
                        src={activeReport.imageUrl}
                        alt="Submitted Label Photograph"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                      <span>No photograph attached with submission</span>
                    </div>
                  )}
                </div>

                {/* Past Investigation Notes */}
                {activeReport.investigationNotes && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                      Case Investigation Notes
                    </span>
                    <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {activeReport.investigationNotes}
                    </pre>
                  </div>
                )}

                {/* Rejection Reason if Rejected */}
                {activeReport.rejectionReason && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-wider block">
                      Formal Rejection Reason
                    </span>
                    <p className="text-[11px] text-rose-200">
                      {activeReport.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* INSPECTOR CASE ACTIONS SECTION */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-sky-800/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Inspector Official Determination & Status Updates</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Officer ID: {currentUser?.inspectorId || 'INS-DEMO-001'}
                </span>
              </div>

              {/* Action Notes Input */}
              <div className="space-y-1 text-xs">
                <label className="block text-slate-300 font-semibold">
                  Add Investigation Notes / Audit Remarks:
                </label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Record verification notes, distributor visits, statutory sample seizure details..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Rejection Reason Input (Shown if user wants to reject) */}
              {actionType === 'reject' && (
                <div className="space-y-1 text-xs animate-in fade-in">
                  <label className="block text-rose-300 font-semibold">
                    State Departmental Grounds for Rejection *:
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Duplicate report, verified exempted commodity category under Rule 26..."
                    className="w-full px-3 py-2 bg-slate-800 border border-rose-800 rounded-xl text-white text-xs placeholder-slate-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Mark Under Investigation */}
                  {activeReport.status !== 'Under Investigation' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus('Under Investigation')}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Mark Under Investigation
                    </button>
                  )}

                  {/* Mark Resolved */}
                  {activeReport.status !== 'Resolved' && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}

                  {/* Reject Report Trigger */}
                  {activeReport.status !== 'Rejected' && (
                    <>
                      {actionType === 'reject' ? (
                        <button
                          type="button"
                          disabled={actionLoading || !rejectionReason.trim()}
                          onClick={() => handleUpdateStatus('Rejected')}
                          className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 disabled:bg-rose-950 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                        >
                          Confirm Rejection
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActionType('reject')}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                        >
                          Reject Report
                        </button>
                      )}
                    </>
                  )}

                  {/* Save Notes Only */}
                  {actionNotes.trim() && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(activeReport.status)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      Save Notes Only
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
