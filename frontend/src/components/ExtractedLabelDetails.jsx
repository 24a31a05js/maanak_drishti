import React, { useState } from 'react';
import {
  Tag,
  Building,
  Scale,
  Calendar,
  PhoneCall,
  Globe,
  FileText,
  AlertCircle,
  Edit3,
  Info,
  CheckCircle2,
  Layers,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

export default function ExtractedLabelDetails({ labelData = {}, onUpdateDetails }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...labelData });
  const [showRawText, setShowRawText] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onUpdateDetails) {
      onUpdateDetails(editFormData);
    }
    setIsEditing(false);
  };

  // Helper to render detected value or 'Not detected' badge
  const renderValue = (val) => {
    if (
      !val ||
      val === 'Not detected' ||
      val.toString().trim() === '' ||
      val === 'unknown' ||
      val === 'null'
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 italic">
          <AlertCircle className="w-3 h-3 text-slate-500" />
          <span>Not detected</span>
        </span>
      );
    }
    return <span className="font-semibold text-slate-100 break-words">{val}</span>;
  };

  // Section A: Product Details
  const productDetails = [
    { field: 'Product Name', value: labelData.productName, icon: Tag, rule: 'Rule 6(1)(f)' },
    { field: 'Brand', value: labelData.brand, icon: Tag, rule: 'Trade Identity' },
    { field: 'Product Category', value: labelData.category, icon: Layers, rule: 'Commodity Type' },
    { field: 'Net Quantity / Net Weight', value: labelData.netQuantity, icon: Scale, rule: 'Rule 6(1)(c)' },
    { field: 'Maximum Retail Price (MRP)', value: labelData.mrp, icon: Tag, rule: 'Rule 6(1)(e)' },
    { field: 'Batch / Lot Number', value: labelData.batchNumber, icon: FileText, rule: 'Rule 6(1)(g)' },
    { field: 'Manufacturing / Packing Date', value: labelData.mfgDate, icon: Calendar, rule: 'Rule 6(1)(d)' },
    { field: 'Expiry / Best-Before Date', value: labelData.expiryDate, icon: Calendar, rule: 'Packaged Commodities Rule' },
  ];

  // Section B: Manufacturer and Contact Details
  const manufacturerDetails = [
    { field: 'Manufacturer or Packer Name', value: labelData.manufacturer, icon: Building, rule: 'Rule 6(1)(a) & (b)', fullWidth: true },
    { field: 'Manufacturer or Packer Address', value: labelData.manufacturerAddress, icon: Building, rule: 'Premises Address', fullWidth: true },
    { field: 'Consumer-Care Contact Information', value: labelData.consumerCare, icon: PhoneCall, rule: 'Rule 6(1)(n)', fullWidth: true },
    { field: 'Customer-Care Email / Website', value: labelData.consumerCareEmailWeb, icon: Globe, rule: 'Digital Support', fullWidth: true },
  ];

  // Section C: Ingredients and Other Information
  const ingredientsDetails = [
    { field: 'Ingredients', value: labelData.ingredients, icon: FileText, rule: 'Commodity Formulation', fullWidth: true },
    { field: 'Warnings and Usage Instructions', value: labelData.warnings, icon: ShieldAlert, rule: 'Statutory Safety Notice', fullWidth: true },
    { field: 'Other Relevant Declarations', value: labelData.otherDeclarations, icon: Info, rule: 'FSSAI / BIS / Origin', fullWidth: true },
  ];

  const renderSectionCards = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {items.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between space-y-2 hover:border-slate-600 transition-colors ${
              card.fullWidth ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">{card.field}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                {card.rule}
              </span>
            </div>

            <div className="text-sm pt-1 pl-1">
              {renderValue(card.value)}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800">
              OCR EXTRACTED DECLARATIONS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
              EDITABLE PREVIEW
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Extracted Product Label Details
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Statutory declaration information parsed from your scanned label. Unreadable fields are marked <em>Not detected</em>. You may review and correct any values below.
          </p>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => {
            setEditFormData({ ...labelData });
            setIsEditing(!isEditing);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-teal-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer self-start sm:self-center whitespace-nowrap shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5 text-teal-400" />
          <span>{isEditing ? 'Cancel Editing' : 'Correct OCR Details'}</span>
        </button>
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-slate-400 leading-relaxed text-[11px]">
          The fields below show data directly read from the label image. If lighting, glare, or camera angles caused an omission, you can tap <strong>Correct OCR Details</strong> to fix any field before proceeding to the explanation and age assessment.
        </p>
      </div>

      {/* OCR Engine Status Banner — shown when OCR is unavailable or partially working */}
      {labelData.ocrStatus && labelData.ocrStatus !== 'ok' && labelData.ocrStatus !== 'preset' && (
        <div className="p-4 rounded-2xl border flex items-start gap-3 bg-amber-950/40 border-amber-800/60">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              OCR Engine Status
            </p>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              {labelData.ocrStatus}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              You can still <strong className="text-slate-300">manually enter</strong> the correct values using the <em>Correct OCR Details</em> button above.
            </p>
          </div>
        </div>
      )}

      {/* Raw OCR Text — collapsible debug panel, only shown when OCR ran */}
      {labelData.rawOcrText && (
        <div className="rounded-2xl border border-slate-700/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRawText((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              Raw OCR Text (Debug / Review)
              <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-mono">
                {labelData.extractionSource || 'OCR Engine'}
              </span>
            </span>
            {showRawText ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          {showRawText && (
            <pre className="p-4 bg-slate-950 text-[11px] font-mono text-slate-300 whitespace-pre-wrap break-words max-h-72 overflow-y-auto leading-relaxed border-t border-slate-800">
              {labelData.rawOcrText}
            </pre>
          )}
        </div>
      )}

      {/* INLINE EDIT FORM */}
      {isEditing && (
        <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-teal-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-teal-400" />
              <span>Edit Extracted Product Details</span>
            </h4>
            <span className="text-[11px] text-slate-400">Match against physical packaging</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
              <input
                type="text"
                name="productName"
                value={editFormData.productName || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={editFormData.brand || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Product Category</label>
              <input
                type="text"
                name="category"
                value={editFormData.category || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Net Quantity / Weight</label>
              <input
                type="text"
                name="netQuantity"
                value={editFormData.netQuantity || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Maximum Retail Price (MRP)</label>
              <input
                type="text"
                name="mrp"
                value={editFormData.mrp || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Batch / Lot Number</label>
              <input
                type="text"
                name="batchNumber"
                value={editFormData.batchNumber || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Manufacturing / Packing Date</label>
              <input
                type="text"
                name="mfgDate"
                value={editFormData.mfgDate || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Expiry / Best-Before Date</label>
              <input
                type="text"
                name="expiryDate"
                value={editFormData.expiryDate || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Manufacturer or Packer Name</label>
              <input
                type="text"
                name="manufacturer"
                value={editFormData.manufacturer || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Manufacturer or Packer Address</label>
              <input
                type="text"
                name="manufacturerAddress"
                value={editFormData.manufacturerAddress || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Consumer-Care Helpline / Contact Information</label>
              <input
                type="text"
                name="consumerCare"
                value={editFormData.consumerCare || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Customer-Care Email / Website</label>
              <input
                type="text"
                name="consumerCareEmailWeb"
                value={editFormData.consumerCareEmailWeb || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Ingredients (if applicable)</label>
              <textarea
                name="ingredients"
                rows={2}
                value={editFormData.ingredients || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Warnings and Usage Instructions</label>
              <textarea
                name="warnings"
                rows={2}
                value={editFormData.warnings || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Other Declarations (FSSAI, Certifications, etc.)</label>
              <input
                type="text"
                name="otherDeclarations"
                value={editFormData.otherDeclarations || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              Save Corrections
            </button>
          </div>
        </form>
      )}

      {/* SECTION A: PRODUCT DETAILS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            A. Product Details
          </h4>
        </div>
        {renderSectionCards(productDetails)}
      </div>

      {/* SECTION B: MANUFACTURER AND CONTACT DETAILS */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            B. Manufacturer and Contact Details
          </h4>
        </div>
        {renderSectionCards(manufacturerDetails)}
      </div>

      {/* SECTION C: INGREDIENTS AND OTHER INFORMATION */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            C. Ingredients and Other Information
          </h4>
        </div>
        {renderSectionCards(ingredientsDetails)}
      </div>

    </div>
  );
}
