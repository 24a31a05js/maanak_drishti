import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { ArrowRight, CheckCircle2, Scan, Database, Cpu, FileCheck2, Info, Eye } from 'lucide-react';

export default function SolutionSection() {
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const capabilities = [
    'Automated label image capture and orientation preprocessing',
    'OCR extraction of printed statutory declarations on multi-surface packaging',
    'Rule-based parsing against Legal Metrology (Packaged Commodities) Rules, 2011',
    'Transparent preliminary flags designed to assist human inspectors and educate consumers',
  ];

  return (
    <section id="solution" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="OUR SOLUTION"
          title="Introducing Maanak Drishti"
          subtitle="Maanak Drishti is designed to assist packaged commodity label verification through image processing, OCR, structured field extraction and rule-based compliance checks."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Explanatory Text & Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              <Eye className="w-3.5 h-3.5" />
              <span>AI-Assisted Verification Framework</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Bridging Physical Packaging with Digital Statutory Rules
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              Maanak Drishti acts as an algorithmic co-pilot for label assessment. Rather than replacing human scrutiny, it transforms complex packaging text into structured data, flags potential discrepancies against regulatory criteria, and produces understandable summaries.
            </p>

            {/* Crucial GovTech human review notice */}
            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                <strong>Preliminary Check Standard:</strong> The platform is designed to provide preliminary insights and structured flags. Final compliance determinations remain the responsibility of authorized statutory inspectors and administrative review.
              </div>
            </div>

            {/* Capability Checklist */}
            <ul className="space-y-3 pt-2">
              {capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="#features"
                onClick={(e) => handleScrollTo(e, '#features')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Custom Pipeline Visual Graphic */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Analysis Pipeline Architecture
                </span>
                <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                  Rule Engine Flow
                </span>
              </div>

              {/* Step 1: Image Capture */}
              <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Scan className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">1. Label Image Input</h4>
                    <span className="text-[11px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Raw Input</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Mobile snapshot or scanned label upload from packaging.</p>
                </div>
              </div>

              {/* Step 2: OCR Extraction */}
              <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">2. Text Extraction (OCR)</h4>
                    <span className="text-[11px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Text Layer</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Extracts alphanumeric tokens, weights, prices and legal clauses.</p>
                </div>
              </div>

              {/* Step 3: Field Identification */}
              <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">3. Structured Field Extraction</h4>
                    <span className="text-[11px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Entity Tagging</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Maps tokens into MRP, Net Qty, Manufacturer, Pkd Date & Category.</p>
                </div>
              </div>

              {/* Step 4: Rule Validation */}
              <div className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">4. Rule-Based Compliance Engine</h4>
                    <span className="text-[11px] font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Rules 2011</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Compares identified fields against mandatory Category-specific rules.</p>
                </div>
              </div>

              {/* Bottom Explanation Banner */}
              <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-300">Outputs Explainable Audit Summaries</span>
                <span className="font-mono text-sky-400 font-semibold">Structured Inspection Record</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
