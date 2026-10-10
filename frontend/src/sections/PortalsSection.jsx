import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { ShieldCheck, ShoppingBag, ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export default function PortalsSection() {
  const navigate = useNavigate();

  const inspectorFeatures = [
    'Product label scanning and upload.',
    'Extracted declaration review.',
    'Compliance rule validation.',
    'Detected issue explanations.',
    'Inspection reports.',
    'Inspection history and analytics.',
  ];

  const consumerFeatures = [
    'Camera scan and product label upload.',
    'Optical extraction of statutory Rule 6 declarations.',
    'Plain-language label explanation & legal compliance.',
    'Age-wise suitability assessment (0–5 to 90–95 years).',
    'Report suspected violations directly to department.',
  ];

  return (
    <section id="portals" className="py-20 lg:py-28 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="ACCESS THE PLATFORM"
          title="Choose Your Portal"
          subtitle="Access the experience designed for your needs."
        />

        {/* The Two Dedicated Portals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          
          {/* Card 1: Inspector Portal */}
          <div className="relative flex flex-col justify-between rounded-2xl bg-white border-2 border-sky-100 hover:border-sky-500 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 p-7 sm:p-9 lg:p-10 group">
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600"></div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner">
                  <ShieldCheck className="w-8 h-8 text-sky-700" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                  Enforcement & Verification
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-widest block mb-1">
                  OFFICIAL ACCESS
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Inspector Portal
                </h3>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                A dedicated workspace for product label inspection, preliminary compliance verification and inspection record management.
              </p>

              <div className="border-t border-slate-100 pt-5 mb-8">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Key Capabilities:
                </h4>
                <ul className="space-y-2.5">
                  {inspectorFeatures.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/inspector/auth')}
                className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 bg-slate-900 hover:bg-sky-600 text-white shadow-md hover:shadow-lg shadow-slate-900/10 cursor-pointer"
              >
                <span>Inspector Login</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Dedicated Inspector Authentication</span>
              </div>
            </div>
          </div>

          {/* Card 2: Consumer Portal */}
          <div className="relative flex flex-col justify-between rounded-2xl bg-white border-2 border-teal-100 hover:border-teal-500 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 p-7 sm:p-9 lg:p-10 group">
            <div className="absolute top-0 left-8 right-8 h-1.5 rounded-b-full bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500"></div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner">
                  <ShoppingBag className="w-8 h-8 text-teal-700" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  Consumer Experience
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest block mb-1">
                  CITIZEN ACCESS
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Consumer Portal
                </h3>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                An easy-to-use experience for understanding packaged product labels and learning about mandatory declarations.
              </p>

              <div className="border-t border-slate-100 pt-5 mb-8">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Key Capabilities:
                </h4>
                <ul className="space-y-2.5">
                  {consumerFeatures.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/consumer/dashboard')}
                className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-md hover:shadow-lg shadow-teal-600/20 cursor-pointer"
              >
                <span>Consumer Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-teal-700 font-medium mt-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Direct Citizen Access • No Login Required</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
