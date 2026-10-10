import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Send,
  ArrowLeft,
  RotateCcw,
  Copy,
  Check,
  Tag,
  Scale,
  Building,
  ShieldCheck,
  AlertCircle,
  Clock,
  Camera,
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { explainLabelInSimpleTerms } from '../services/complianceEngine';

export default function ReportSubmissionSection({
  labelData = {},
  scannedImage = null,
  onBack,
  onStartAgain,
}) {
  const explanation = explainLabelInSimpleTerms(labelData);
  const [suspectedIssue, setSuspectedIssue] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [consumerContact, setConsumerContact] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError('');

    if (!suspectedIssue.trim() || suspectedIssue.trim().length < 4) {
      setSubmissionError('Please describe the suspected packaging or declaration issue (minimum 4 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullDescription = additionalNotes.trim()
        ? `${suspectedIssue.trim()}\n\nAdditional Notes / Store Context:\n${additionalNotes.trim()}`
        : suspectedIssue.trim();

      const payload = {
        productName: labelData.productName || 'Packaged Commodity (Scanned)',
        manufacturer: labelData.manufacturer || 'Not declared',
        mrp: labelData.mrp || 'Not declared',
        netQuantity: labelData.netQuantity || 'Not declared',
        mfgDate: labelData.mfgDate || 'Not declared',
        consumerCare: labelData.consumerCare || 'Not declared',
        reason: suspectedIssue.trim().slice(0, 100),
        reasonCategory: 'consumer_packaging_complaint',
        description: fullDescription,
        imageUrl: scannedImage || null,
        extractedDetails: labelData,
        complianceFindings: explanation,
        consumerName: consumerName.trim() || 'Anonymous Citizen',
        consumerPhone: consumerContact.trim() || '',
      };

      const created = await reportService.createReport(payload);
      setSubmittedReport(created);
    } catch (err) {
      setSubmissionError(
        err.message || 'Unable to submit report to backend database. Please verify backend connection and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedReport?.id) {
      navigator.clipboard.writeText(submittedReport.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedReport) {
    return (
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl animate-in fade-in duration-300 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            OFFICIAL GRIEVANCE LODGED
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Grievance Report Submitted Successfully
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Your packaging declaration concern has been recorded in the central Legal Metrology database and dispatched to the Inspector enforcement queue.
          </p>
        </div>

        {/* Unique Tracking ID Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Official Report Reference ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-teal-300 tracking-wider">
                {submittedReport.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-bold font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Pending Review</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div>
              <strong className="text-slate-400 block text-[11px]">Commodity:</strong>
              <span className="text-white font-medium">{submittedReport.productName}</span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Reported Issue:</strong>
              <span className="text-white font-medium line-clamp-1">{submittedReport.reason}</span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Submission Time:</strong>
              <span className="text-slate-300 font-mono text-[11px]">
                {new Date(submittedReport.submittedAt || Date.now()).toLocaleString()}
              </span>
            </div>
            <div>
              <strong className="text-slate-400 block text-[11px]">Complainant:</strong>
              <span className="text-slate-300">{submittedReport.consumerName || 'Citizen Consumer'}</span>
            </div>
          </div>
        </div>

        {/* Action Button: Scan Another Product */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onStartAgain}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Another Product</span>
          </button>
        </div>
      </div>
    );
  }

  // SUBMISSION FORM VIEW
  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider block">
            STEP 5 OF 5 • ENFORCEMENT DESK
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Report This Label
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Lodge a formal citizen report regarding packaging omissions, obscured declarations, or overcharging directly into the Legal Metrology database.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-mono self-start sm:self-center">
          Direct Inspector Pipeline
        </span>
      </div>

      {/* 1. SUMMARY OF EXTRACTED LABEL & COMPLIANCE FINDINGS */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3">
        <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block">
          Label & Compliance Summary
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">
            <span className="text-[10px] text-slate-400 uppercase block">Product Name</span>
            <span className="font-bold text-white block truncate">{labelData.productName || 'Not detected'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">
            <span className="text-[10px] text-slate-400 uppercase block">Declared MRP</span>
            <span className="font-bold text-white block">{labelData.mrp || 'Not detected'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">
            <span className="text-[10px] text-slate-400 uppercase block">Net Quantity</span>
            <span className="font-bold text-white block">{labelData.netQuantity || 'Not detected'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/70">
            <span className="text-[10px] text-slate-400 uppercase block">Compliance Status</span>
            <span
              className={`font-bold block uppercase font-mono ${
                explanation.status === 'Compliant'
                  ? 'text-emerald-400'
                  : explanation.status === 'Potential Violation'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {explanation.status}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
          <strong className="text-slate-300">Assessment explanation:</strong> {explanation.reasonExplanation}
        </p>
      </div>

      {/* 2. SUBMISSION FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Suspected Issue Field (Required) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            Describe Suspected Packaging Issue <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={suspectedIssue}
            onChange={(e) => setSuspectedIssue(e.target.value)}
            placeholder="e.g. The retail price charged was higher than the declared MRP; or the manufacturer contact address was missing from the packet."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Additional Notes (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            Additional Notes / Retail Context <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="e.g. Purchased at Supermarket X, MG Road, New Delhi on Oct 9, 2026."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Optional Complainant Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Your Name <span className="text-slate-500 font-normal">(Optional — defaults to Anonymous)</span>
            </label>
            <input
              type="text"
              value={consumerName}
              onChange={(e) => setConsumerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Contact Phone / Mobile <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={consumerContact}
              onChange={(e) => setConsumerContact(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Error Alert */}
        {submissionError && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong>Submission Error:</strong>
              <p>{submissionError}</p>
            </div>
          </div>
        )}

        {/* Navigation & Submit Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700/80">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Age Assessment</span>
            </button>

            <button
              type="button"
              onClick={onStartAgain}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              title="Start Over with New Label"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Again</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Submitting to Database...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Report to Department</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
