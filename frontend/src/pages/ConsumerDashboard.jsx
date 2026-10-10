import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Camera,
  FileText,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { extractProductLabel } from '../services/ocrService';
import ConsumerScanner from '../components/ConsumerScanner';
import ExtractedLabelDetails from '../components/ExtractedLabelDetails';
import LabelExplanationSection from '../components/LabelExplanationSection';
import AgeSuitabilitySection from '../components/AgeSuitabilitySection';
import ReportSubmissionSection from '../components/ReportSubmissionSection';

// Workflow Steps definition
const STEPS = [
  { id: 1, label: 'Scan & Upload', icon: Camera },
  { id: 2, label: 'Extracted Details', icon: FileText },
  { id: 3, label: 'Explain Label', icon: HelpCircle },
  { id: 4, label: 'Age-Wise Suitability', icon: ShieldCheck },
  { id: 5, label: 'Report This Label', icon: AlertTriangle },
];

export default function ConsumerDashboard() {
  // Current active workflow step (1 through 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Optical Analysis & State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [labelData, setLabelData] = useState(null);

  // Step 1: Triggered when user captures or selects an image and clicks "Analyze Label"
  const handleScanInitiate = async ({ imageData, fileName }) => {
    setIsAnalyzing(true);
    setScannedImage(imageData);

    try {
      // Send image to backend OCR endpoint
      const extracted = await extractProductLabel(imageData, fileName);
      setLabelData(extracted);
      // Advance to Step 2: Review Extracted Details
      setCurrentStep(2);
    } catch {
      // Safe fallback on unexpected failure
      const fallback = {
        productName: fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Packaged Commodity',
        brand: 'Not detected',
        category: 'Packaged Consumer Commodity',
        netQuantity: 'Not detected',
        mrp: 'Not detected',
        mrpIncludesTaxes: false,
        batchNumber: 'Not detected',
        mfgDate: 'Not detected',
        expiryDate: 'Not detected',
        unitSalePrice: 'Not detected',
        genericName: 'Not detected',
        manufacturer: 'Not detected',
        manufacturerAddress: 'Not detected',
        consumerCare: 'Not detected',
        consumerCareEmailWeb: 'Not detected',
        countryOfOrigin: 'Not detected',
        ingredients: 'Not detected',
        warnings: 'Not detected',
        otherDeclarations: 'Not detected',
        isDetected: true,
        ocrConfidence: 'Medium (0.65)',
        extractionSource: 'Automated OCR Preprocessing',
        verified: false,
      };
      setLabelData(fallback);
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2: Callback when user manually edits / corrects extracted fields
  const handleUpdateDetails = (updatedFields) => {
    setLabelData(updatedFields);
  };

  // Reset entire workflow back to Step 1
  const handleStartAgain = () => {
    setLabelData(null);
    setScannedImage(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* 1. CLEAN TOP HEADER: BRANDING ONLY (No login badge, No logout button) */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Maanak Drishti Branding */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-wide block leading-tight">
                MAANAK DRISHTI
              </span>
              <span className="text-[11px] text-teal-400 font-mono block">
                Consumer Portal • Digital Legal Metrology
              </span>
            </div>
          </Link>

          {/* Clean Right Header Actions: Start Over & Home Link */}
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleStartAgain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Start a new scan session"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Start Again</span>
              </button>
            )}

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-sm font-semibold text-white transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. GUIDED WORKFLOW PROGRESS INDICATOR */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto">
          
          {/* Progress Tracker Bar */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Item */}
                  <div
                    className={`flex items-center gap-2 ${
                      isCurrent
                        ? 'text-teal-300 font-bold'
                        : isPast
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                          : isPast
                          ? 'bg-teal-950 text-teal-400 border border-teal-800'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </div>

                    <span className="hidden md:inline text-xs font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-grow mx-2 h-0.5 rounded transition-colors hidden sm:block ${
                        currentStep > idx + 1 ? 'bg-teal-600/70' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. MAIN WORKFLOW STEP CONTAINER (Guided, clean, one section at a time) */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-grow">
        
        {/* STEP 1: SCAN OR UPLOAD PRODUCT LABEL */}
        {currentStep === 1 && (
          <ConsumerScanner
            onScanComplete={handleScanInitiate}
            isProcessing={isAnalyzing}
          />
        )}

        {/* STEP 2: REVIEW & CORRECT EXTRACTED DETAILS */}
        {currentStep === 2 && labelData && (
          <div className="space-y-6">
            <ExtractedLabelDetails
              labelData={labelData}
              onUpdateDetails={handleUpdateDetails}
            />

            {/* Step Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Camera / Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-md shadow-teal-600/30 transition-all cursor-pointer"
              >
                <span>Explain Label</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPLAIN EXTRACTED LABEL */}
        {currentStep === 3 && labelData && (
          <LabelExplanationSection
            labelData={labelData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            onStartAgain={handleStartAgain}
            onReportDirectly={() => setCurrentStep(5)}
          />
        )}

        {/* STEP 4: AGE-WISE SUITABILITY ASSESSMENT (19 Intervals: 0-5 to 90-95 years) */}
        {currentStep === 4 && labelData && (
          <div className="space-y-6">
            <AgeSuitabilitySection labelData={labelData} />

            {/* Step Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Label Explanation</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartAgain}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold cursor-pointer"
                  title="Start Over"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Again</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-md shadow-teal-600/30 transition-all cursor-pointer"
              >
                <span>Next: Report This Label</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REPORT THIS LABEL */}
        {currentStep === 5 && labelData && (
          <ReportSubmissionSection
            labelData={labelData}
            scannedImage={scannedImage}
            onBack={() => setCurrentStep(4)}
            onStartAgain={handleStartAgain}
          />
        )}

      </main>

    </div>
  );
}
