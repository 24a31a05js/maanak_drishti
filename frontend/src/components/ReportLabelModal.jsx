import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { reportService } from '../services/reportService';

const REPORT_REASONS = [
  { id: 'overcharging_mrp', label: 'Overcharging above printed MRP' },
  { id: 'altered_mrp_sticker', label: 'Altered, pasted, or overwritten price sticker' },
  { id: 'missing_mandatory_declarations', label: 'Missing statutory declarations (Rule 6)' },
  { id: 'missing_manufacturer', label: 'Missing manufacturer / packer name or complete address' },
  { id: 'missing_net_quantity', label: 'Misleading net quantity or non-standard metric units' },
  { id: 'missing_consumer_care', label: 'Missing consumer care helpline telephone or email' },
  { id: 'missing_mfg_date', label: 'Missing month and year of manufacture or packing' },
  { id: 'misleading_packaging', label: 'Misleading packaging size or deceptive container design' },
  { id: 'other_violation', label: 'Other suspected packaging or declaration violation' },
];

export default function ReportLabelModal({
  isOpen,
  onClose,
  labelData = {},
  scannedImage = null,
  complianceFindings = null,
  onReportSubmitted,
}) {
  const [formData, setFormData] = useState({
    productName: labelData.productName && labelData.productName !== 'Not detected' ? labelData.productName : '',
    manufacturer: labelData.manufacturer && labelData.manufacturer !== 'Not detected' ? labelData.manufacturer : '',
    mrp: labelData.mrp && labelData.mrp !== 'Not detected' ? labelData.mrp : '',
    netQuantity: labelData.netQuantity && labelData.netQuantity !== 'Not detected' ? labelData.netQuantity : '',
    reason: 'overcharging_mrp',
    description: '',
    consumerName: '',
    consumerEmail: '',
    consumerPhone: '',
  });

  const [imagePreview, setImagePreview] = useState(scannedImage || null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyReportId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validations
    if (!formData.productName.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (!formData.reason) {
      setErrorMsg('Please select a reason for reporting.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 8) {
      setErrorMsg('Please provide a descriptive explanation of the suspected issue (minimum 8 characters).');
      return;
    }

    if (formData.consumerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.consumerEmail.trim())) {
        setErrorMsg('Please provide a valid email address, or leave it blank.');
        return;
      }
    }

    if (formData.consumerPhone.trim()) {
      const phoneRegex = /^[0-9+\s-]{8,15}$/;
      if (!phoneRegex.test(formData.consumerPhone.trim())) {
        setErrorMsg('Please provide a valid contact phone number, or leave it blank.');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const matchingReason = REPORT_REASONS.find((r) => r.id === formData.reason);

      const payload = {
        productName: formData.productName.trim(),
        manufacturer: formData.manufacturer.trim(),
        mrp: formData.mrp.trim(),
        netQuantity: formData.netQuantity.trim(),
        reason: matchingReason ? matchingReason.label : formData.reason,
        reasonCategory: formData.reason,
        description: formData.description.trim(),
        imageUrl: imagePreview,
        extractedDetails: labelData,
        complianceFindings: complianceFindings,
        consumerName: formData.consumerName.trim(),
        consumerEmail: formData.consumerEmail.trim(),
        consumerPhone: formData.consumerPhone.trim(),
      };

      // Persist report via reportService
      const created = await reportService.createReport(payload);

      // Verify the report was actually saved
      const verified = await reportService.getReportById(created.id);
      if (!verified) {
        throw new Error('Report could not be verified in local persistence.');
      }

      setSubmittedReport(created);
      if (onReportSubmitted) {
        onReportSubmitted(created);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800">
                CITIZEN GRIEVANCE CHANNEL
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                RULE 6 ENFORCEMENT
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Report Product Packaging Issue</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              File a preliminary citizen grievance regarding missing statutory declarations, price tampering, or misleading packaging.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS CONFIRMATION VIEW (Displayed ONLY after report is actually saved) */}
        {submittedReport ? (
          <div className="space-y-6 py-4 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-800/80 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  REPORT REGISTERED SUCCESSFULLY
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  Citizen Report Lodged
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your report has been saved into the Legal Metrology Inspection Desk pipeline. Authorized enforcement officers will review the packaging findings.
                </p>
              </div>

              {/* Unique Report ID Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 max-w-md mx-auto flex items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Statutory Report Tracking ID
                  </span>
                  <span className="text-base sm:text-lg font-mono font-extrabold text-teal-300 select-all">
                    {submittedReport.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyReportId(submittedReport.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Current Status: Pending Review</span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white block">What happens next?</span>
              <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                <li>Your submission has been cataloged under <strong>Pending Review</strong> in the inspector workspace.</li>
                <li>An authorized Legal Metrology inspector will examine the declared manufacturer and packaging OCR indicators.</li>
                <li>If verified, departmental notices or physical market sample audits may be initiated under the Legal Metrology Act, 2009.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* REPORT SUBMISSION FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Information Fields (Prefilled where available) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. Whole Wheat Atta 5kg"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Manufacturer / Brand (if available)
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. PureFoods Pvt. Ltd."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Maximum Retail Price (MRP)
                </label>
                <input
                  type="text"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="e.g. ₹145.00"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Net Quantity (if available)
                </label>
                <input
                  type="text"
                  name="netQuantity"
                  value={formData.netQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 500 g"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Reason for Reporting (Dropdown) */}
            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">
                Reason for Reporting *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Description */}
            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">
                Description of Suspected Issue *
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe where the item was purchased, what details were missing, if a price was crossed out or overcharged, etc."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              ></textarea>
            </div>

            {/* Optional Label Photograph Preview & Attachment */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">
                  Product Label Photograph (Optional)
                </span>
                <label className="text-[11px] font-bold text-teal-400 hover:underline cursor-pointer">
                  <span>{imagePreview ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src={imagePreview}
                    alt="Packaging Label Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Optional Consumer Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  Consumer Contact Details (Optional)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Confidential & Protected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <input
                    type="text"
                    name="consumerName"
                    placeholder="Your Name (Optional)"
                    value={formData.consumerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="consumerEmail"
                    placeholder="Your Email (Optional)"
                    value={formData.consumerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="consumerPhone"
                    placeholder="Phone No. (Optional)"
                    value={formData.consumerPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Privacy protection notice */}
              <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
                <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Privacy Guarantee: Consumer contact details are stored securely and masked for unauthorized viewers. Only authorized departmental inspectors can review contact coordinates for formal inquiry.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Submit Grievance Report</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
