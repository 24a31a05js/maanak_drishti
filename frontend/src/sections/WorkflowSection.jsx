import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Camera, Cpu, ShieldCheck, FileSpreadsheet, ArrowRight, Check } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      num: '01',
      tag: 'SCAN',
      icon: Camera,
      title: 'Image Capture',
      desc: 'The user captures or uploads a packaged product label image via camera or file selector.',
      detail: 'Supports common formats with boundary and glare preprocessing.',
    },
    {
      num: '02',
      tag: 'EXTRACT',
      icon: Cpu,
      title: 'Text & Entity OCR',
      desc: 'Image preprocessing and OCR help extract text and important declarations from the label.',
      detail: 'Parses alphanumeric packaging text into structured key-value pairs.',
    },
    {
      num: '03',
      tag: 'VALIDATE',
      icon: ShieldCheck,
      title: 'Rule Engine Check',
      desc: 'The system identifies the product category and checks extracted info against applicable rules.',
      detail: 'Evaluates against statutory criteria under Packaged Commodities Rules 2011.',
    },
    {
      num: '04',
      tag: 'REPORT',
      icon: FileSpreadsheet,
      title: 'Audit & Records',
      desc: 'The system presents the check results, potential issues, explanations and relevant records.',
      detail: 'Provides transparent diagnostic reasons and exportable inspection summaries.',
    },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-28 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="WORKFLOW"
          title="From Label Image to Compliance Insight"
          subtitle="A systematic four-stage verification sequence engineered for high accuracy, explainability, and speed."
          dark={true}
        />

        {/* Sequence Banner Pill */}
        <div className="max-w-xl mx-auto mb-14 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 border border-slate-700 text-xs sm:text-sm font-mono tracking-wider text-sky-400">
            <span className="font-bold text-white">SCAN</span>
            <span className="text-slate-500">→</span>
            <span className="font-bold text-white">EXTRACT</span>
            <span className="text-slate-500">→</span>
            <span className="font-bold text-white">VALIDATE</span>
            <span className="text-slate-500">→</span>
            <span className="font-bold text-white">REPORT</span>
          </div>
        </div>

        {/* Workflow Steps - Horizontal Grid on Desktop, Vertical on Mobile */}
        <div className="relative">
          
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500 -translate-y-8 z-0 opacity-40"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-700/80 shadow-lg hover:border-sky-500/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Top step badge & icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-700/80 text-sky-400 border border-slate-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                        STEP {step.num}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase block mb-1">
                        {step.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400">
                    <span className="text-sky-400/90 font-medium">{step.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
