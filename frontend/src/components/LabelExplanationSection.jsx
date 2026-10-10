import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Tag,
  Scale,
  Calendar,
  Building,
  PhoneCall,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Info,
} from 'lucide-react';
import { explainLabelInSimpleTerms } from '../services/complianceEngine';

export default function LabelExplanationSection({
  labelData = {},
  onNext,
  onBack,
  onStartAgain,
  onReportDirectly,
}) {
  const explanation = explainLabelInSimpleTerms(labelData);
  const { status, productSummary, missingDetails, detectedDetails, reasonExplanation, isOcrLimitation } =
    explanation;

  const getStatusBadge = () => {
    switch (status) {
      case 'Compliant':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Compliant</span>
          </div>
        );
      case 'Potential Violation':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Potential Violation</span>
          </div>
        );
      case 'Needs Review':
      default:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Needs Review</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider block">
            STEP 3 OF 5 • SIMPLIFIED EXPLANATION
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Label Explanation & Legal Compliance
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            A clear explanation of what this product is, what the packaging declares, what is missing, and whether it aligns with Legal Metrology rules.
          </p>
        </div>

        <div className="self-start sm:self-center">
          {getStatusBadge()}
        </div>
      </div>

      {/* Compliance Status Rationale Card */}
      <div
        className={`p-5 rounded-2xl border ${
          status === 'Compliant'
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            : status === 'Potential Violation'
            ? 'bg-rose-950/40 border-rose-800 text-rose-200'
            : 'bg-amber-950/40 border-amber-800 text-amber-200'
        } space-y-2`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Compliance Determination: {status}
          </span>
          <span className="text-[11px] font-mono opacity-80">
            Legal Metrology (Packaged Commodities) Rules, 2011
          </span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-100">
          {reasonExplanation}
        </p>

        {isOcrLimitation && (
          <div className="pt-2 border-t border-amber-800/60 text-[11px] text-amber-300 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Important Distinction:</strong> This &quot;Needs Review&quot; status is caused by optical scanning limits (such as camera glare, curved packaging, or low contrast), not an established legal violation. Physical packaging verification is required before confirming a violation.
            </span>
          </div>
        )}
      </div>

      {/* Structured Simple-Language Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. What the Product Is */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Tag className="w-4 h-4" />
            <span>1. What the Product Is</span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong className="text-white">Product:</strong> {productSummary.name}
            </p>
            <p>
              <strong className="text-white">Brand:</strong> {productSummary.brand}
            </p>
            <p>
              <strong className="text-white">Category:</strong> {productSummary.category}
            </p>
          </div>
        </div>

        {/* 2. Quantity & Price */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <span>2. Net Quantity & MRP</span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong className="text-white">Declared Quantity:</strong> {productSummary.netQuantity}
            </p>
            <p>
              <strong className="text-white">Maximum Retail Price:</strong> {productSummary.mrp}
            </p>
            <p className="text-[11px] text-slate-400">
              Tax status: {productSummary.mrpIncludesTaxes ? 'Declared inclusive of all taxes' : 'Tax phrase unconfirmed on image'}
            </p>
          </div>
        </div>

        {/* 3. Manufacturing & Expiry */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Calendar className="w-4 h-4" />
            <span>3. Packing & Expiry Dates</span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong className="text-white">Date of Packing:</strong> {productSummary.mfgDate}
            </p>
            <p>
              <strong className="text-white">Expiry / Best-Before:</strong> {productSummary.expiryDate}
            </p>
            <p>
              <strong className="text-white">Batch / Lot:</strong> {productSummary.batchNumber}
            </p>
          </div>
        </div>

        {/* 4. Manufacturer & Consumer Care */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Building className="w-4 h-4" />
            <span>4. Manufacturer & Consumer Care</span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <p>
              <strong className="text-white">Manufacturer / Packer:</strong> {productSummary.manufacturer}
            </p>
            <p className="text-[11px] text-slate-400">
              {productSummary.manufacturerAddress !== 'Not detected' && productSummary.manufacturerAddress}
            </p>
            <p>
              <strong className="text-white">Consumer Helpline:</strong> {productSummary.consumerCare}
            </p>
            <p className="text-[11px] text-slate-400">
              {productSummary.consumerCareEmailWeb !== 'Not detected' && productSummary.consumerCareEmailWeb}
            </p>
          </div>
        </div>

      </div>

      {/* 5. Ingredients, Warnings & Extra Declarations */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-2.5">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
          <FileText className="w-4 h-4" />
          <span>5. Ingredients, Warnings & Statutory Notices</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div>
            <span className="font-bold text-white block mb-0.5">Ingredients Declared:</span>
            <p className="text-slate-300 leading-relaxed">
              {productSummary.ingredients}
            </p>
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">Warnings & Directions:</span>
            <p className="text-slate-300 leading-relaxed">
              {productSummary.warnings}
            </p>
          </div>
          {productSummary.otherDeclarations !== 'Not detected' && (
            <div className="sm:col-span-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800">
              <strong className="text-slate-300">Other Declarations:</strong> {productSummary.otherDeclarations}
            </div>
          )}
        </div>
      </div>

      {/* 6. Missing or Unreadable Declarations Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Missing or Unreadable Important Details</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {missingDetails.length} {missingDetails.length === 1 ? 'item' : 'items'} unread
          </span>
        </div>

        {missingDetails.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All mandatory statutory declarations were successfully read from the label!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingDetails.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-rose-300 block">{m.name}</span>
                  <span className="text-[10px] text-slate-400">{m.rule}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-700 shrink-0">
                  Not detected
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guided Workflow Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700/80">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Extracted Details</span>
          </button>

          <button
            type="button"
            onClick={onStartAgain}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            title="Start Over with New Label"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Again</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onReportDirectly && (
            <button
              type="button"
              onClick={onReportDirectly}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/30 transition-all cursor-pointer"
          >
            <span>Next: Age-Wise Suitability</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
