import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Filter,
} from 'lucide-react';
import { assessAgeSuitability, AGE_INTERVALS } from '../services/ageSafetyEngine';

export default function AgeSuitabilitySection({ labelData = {} }) {
  const [selectedAgeId, setSelectedAgeId] = useState('all');

  const assessment = assessAgeSuitability(labelData);
  const evaluations = assessment.evaluations || [];

  const filteredEvaluations =
    selectedAgeId === 'all'
      ? evaluations
      : evaluations.filter((item) => item.interval.id === selectedAgeId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Suitable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Suitable</span>
          </span>
        );
      case 'Not Suitable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Not Suitable</span>
          </span>
        );
      case 'Insufficient Information':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Insufficient Information</span>
          </span>
        );
    }
  };

  return (
    <section className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
            AGE-BASED SAFETY PROFILE
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Age-Wise Suitability Assessment
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Evaluates the product in five-year intervals from 0–5 years through 90–95 years based on declared product category, intended usage, ingredients, and packaged warnings.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/70 border border-purple-800 text-purple-300 text-xs font-mono self-start sm:self-center">
          <span>0–5 to 90–95 Years (19 Brackets)</span>
        </div>
      </div>

      {/* MANDATORY INDEPENDENCE NOTICE: Separate from Legal Metrology compliance */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/70 text-xs text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-100 block">
            Independent Safety Assessment Notice:
          </span>
          <p className="text-amber-200/90 leading-relaxed text-[11px]">
            This assessment is maintained <strong>strictly separate from Legal Metrology label compliance</strong>. A product label may fully comply with statutory packaging declaration requirements without proving that the item is safe or appropriate for every age demographic. Do not automatically assume a product is safe merely because its label was scanned. This does not substitute for professional medical advice.
          </p>
        </div>
      </div>

      {/* Interactive 5-Year Age Group Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Filter by 5-Year Age Bracket:</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredEvaluations.length} of {evaluations.length} Brackets
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedAgeId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedAgeId === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            All Brackets (0–95 years)
          </button>

          {AGE_INTERVALS.map((intv) => (
            <button
              key={intv.id}
              type="button"
              onClick={() => setSelectedAgeId(intv.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedAgeId === intv.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {intv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age Evaluation Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {filteredEvaluations.map((item, idx) => {
          const isWarningPresent = item.warnings && item.warnings.length > 0;
          return (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{item.interval.label}</span>
                    </h4>
                    <span className="text-[11px] text-purple-300/80 font-mono">
                      {item.interval.stage}
                    </span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Reason Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Assessment Rationale
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>

              {/* Specific Warnings */}
              {isWarningPresent && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Precautions & Safety Warnings</span>
                  </span>
                  {item.warnings.map((w, wIdx) => (
                    <p key={wIdx} className="text-[11px] text-amber-200/90 leading-tight">
                      • {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Products Not Intended For Children Explanation */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-300 block">General Category Guidance:</strong>
          <p className="text-[11px] leading-relaxed">
            For products that are not manufactured or marketed specifically for children, age suitability is evaluated against standard safety boundaries and ingredient disclosures. Where reliable pediatric safety information or explicit manufacturer testing is absent, the system conservatively reports <em>Insufficient Information</em> or <em>Not Suitable</em> instead of inventing unverified safety claims.
          </p>
        </div>
      </div>

    </section>
  );
}
