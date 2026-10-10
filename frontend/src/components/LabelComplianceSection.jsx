import React, { useState } from 'react';
import {
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Scale,
  Info,
  Filter,
} from 'lucide-react';
import { evaluateLabelCompliance } from '../services/complianceEngine';

export default function LabelComplianceSection({ labelData = {} }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const compliance = evaluateLabelCompliance(labelData);
  const findings = compliance.findings || [];

  const filteredFindings =
    filterStatus === 'ALL'
      ? findings
      : findings.filter((f) => f.status === filterStatus);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compliant</span>
          </span>
        );
      case 'POTENTIAL VIOLATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Potential Violation</span>
          </span>
        );
      case 'NEEDS REVIEW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Needs Review</span>
          </span>
        );
    }
  };

  const getOverallBadge = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return {
          title: 'Preliminary Checklist Cleared',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-700',
          badgeText: 'PRELIMINARY COMPLIANT',
        };
      case 'POTENTIAL VIOLATION':
        return {
          title: 'Potential Packaging Discrepancy Identified',
          color: 'bg-rose-950 text-rose-300 border-rose-700',
          badgeText: 'POTENTIAL VIOLATION FLAGGED',
        };
      case 'NEEDS REVIEW':
      default:
        return {
          title: 'Manual Review Recommended',
          color: 'bg-amber-950 text-amber-300 border-amber-700',
          badgeText: 'NEEDS INSPECTION REVIEW',
        };
    }
  };

  const overall = getOverallBadge(compliance.overallStatus);

  return (
    <section className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider block">
            STATUTORY RULE EVALUATION
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Label Compliance Assessment
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Independent evaluation against the Legal Metrology (Packaged Commodities) Rules, 2011 Rule 6 declaration checklist.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider ${overall.color} self-start sm:self-center text-center shadow-md`}>
          <span className="block text-[10px] font-mono opacity-80">OVERALL EVALUATION</span>
          <span>{overall.badgeText}</span>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Compliant Fields</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            {compliance.compliantCount}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Potential Violations</span>
          <span className="text-2xl font-extrabold text-rose-400 font-mono">
            {compliance.violationCount}
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Needs Review</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">
            {compliance.reviewCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <span>Filter Findings:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: `All Declarations (${findings.length})` },
            { id: 'COMPLIANT', label: `Compliant (${compliance.compliantCount})` },
            { id: 'POTENTIAL VIOLATION', label: `Violations (${compliance.violationCount})` },
            { id: 'NEEDS REVIEW', label: `Needs Review (${compliance.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2 hover:border-slate-600 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.field}</h4>
                  <span className="text-[11px] font-mono text-slate-400">{item.rule}</span>
                </div>
              </div>
              <div>{getStatusBadge(item.status)}</div>
            </div>

            <div className="space-y-1 pt-1">
              <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
              {item.statutoryDetails && (
                <p className="text-[11px] text-slate-400 font-mono">
                  Context: {item.statutoryDetails}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Caveat Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-300 block">Notice of Diagnostic Nature:</strong>
          <p className="text-[11px] leading-relaxed">
            The results shown above are preliminary indicators generated by automated rules to assist consumer awareness and inspection officers. If information was missing or OCR confidence was low, the rule engine marks the field as <em>Needs Review</em> rather than declaring an automatic violation. Official statutory findings require formal inspection under the Legal Metrology Act, 2009.
          </p>
        </div>
      </div>

    </section>
  );
}
