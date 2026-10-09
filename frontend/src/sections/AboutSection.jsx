import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { ShieldCheck, Target, Cpu, Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="ABOUT THE PLATFORM"
          title="Building a Clearer Approach to Label Verification"
          subtitle="Maanak Drishti is an AI-assisted packaged commodity label analysis and preliminary compliance checking platform."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Modern Technology for Statutory Packaging Compliance
            </h3>

            <p className="text-slate-600 text-base leading-relaxed">
              <strong>Maanak Drishti</strong> is an AI-assisted packaged commodity label analysis and preliminary compliance checking platform designed to support inspectors, consumers, and other relevant stakeholders.
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              Every day, diverse packaged commodities are manufactured, distributed, and retailed across markets. Under the <em>Legal Metrology (Packaged Commodities) Rules, 2011</em>, pre-packaged goods require mandatory statutory declarations—including Maximum Retail Price (inclusive of all taxes), net quantity or measures, month and year of manufacture or packing, and complete packer contact details.
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              Maanak Drishti bridges physical product packaging with automated regulatory verification by combining image processing, optical character recognition (OCR), and a rule-based compliance engine. The platform provides preliminary insights, assists structured inspection workflows, and fosters transparency for consumers.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <Scale className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Rule-Based Evaluation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Codified against mandatory provisions of Packaged Commodities Rules, 2011.</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <Cpu className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Explainable Verification</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Transparent clause mapping designed to assist human review, not replace it.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Information Architecture Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-2xl p-7 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <span className="text-sm font-bold tracking-wide">Platform Architectural Focus</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  Maanak Drishti
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400">CORE PURPOSE</span>
                  <p className="text-slate-200 font-medium">
                    AI-assisted packaged commodity label analysis and preliminary compliance checking platform.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400">REGULATORY FOUNDATION</span>
                  <p className="text-slate-200 font-medium">
                    The Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400">DUAL ROLE ECOSYSTEM</span>
                  <p className="text-slate-200 font-medium">
                    Enforcement inspection tools for officers & educational label-reading assistance for consumers.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center text-slate-400 text-[11px]">
                Built for transparent compliance and consumer awareness.
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
