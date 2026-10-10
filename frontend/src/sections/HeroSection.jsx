import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Tag, Scale, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      
      {/* Background Subtle Grid & Glow Effects */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Headline & Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Regulatory Technology Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-950/90 text-sky-300 border border-sky-800/80 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Regulatory Technology Platform</span>
              <span className="text-slate-500">|</span>
              <span className="text-white font-medium">Legal Metrology Rules, 2011</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Smart Compliance <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-teal-300">
                  for Every Label
                </span>
              </h1>
              <p className="text-xs uppercase tracking-widest font-semibold text-sky-400/90">
                AI-Assisted Label Analysis & Preliminary Compliance Checking
              </p>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Maanak Drishti combines AI-assisted label analysis, OCR text extraction and rule-based validation to help identify potentially missing or incorrect declarations on packaged commodities.
            </p>

            {/* Short Secondary Line */}
            <p className="text-sm sm:text-base font-medium text-slate-400 border-l-2 border-sky-500 pl-3">
              Designed for inspectors. Informative for consumers. Built for clearer compliance.
            </p>

            {/* Prominent Dual Portal Access Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/consumer/dashboard"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 shadow-lg shadow-teal-600/30 transition-all duration-200 hover:-translate-y-0.5 text-center text-sm sm:text-base cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-teal-200" />
                <span>Consumer Portal</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                to="/inspector/auth"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 shadow-lg shadow-sky-600/30 transition-all duration-200 hover:-translate-y-0.5 text-center text-sm sm:text-base cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-sky-200" />
                <span>Inspector Portal</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <a
                href="#workflow"
                onClick={(e) => handleScrollTo(e, '#workflow')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all duration-200 text-center text-xs sm:text-sm"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Three Value Points */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'AI-Assisted Label Analysis', desc: 'Preprocessed computer vision' },
                  { title: 'Explainable Rule Validation', desc: 'Legal Metrology Rules, 2011' },
                  { title: 'Inspector & Consumer Access', desc: 'Dual dedicated workflows' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1 rounded-md bg-sky-950 text-sky-400 mt-0.5 border border-sky-800/60 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Product & Document Analysis Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Label Inspection Mockup Card */}
              <div className="relative rounded-2xl bg-slate-800/90 border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-sm p-5 sm:p-6">
                
                {/* Header of analysis card */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">Label_Inspector_Scanner.v1</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                    SCAN ACTIVE
                  </span>
                </div>

                {/* Simulated Packaged Commodity Label Container with Scan Visuals */}
                <div className="relative bg-slate-900 rounded-xl p-4 border border-slate-700/60 overflow-hidden">
                  
                  {/* Subtle Scanning Frame Reticles */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-400"></div>
                  
                  {/* Animated Scanning Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] opacity-75 animate-scan pointer-events-none"></div>

                  {/* Packaged Commodity Label Layout */}
                  <div className="space-y-3 relative z-0 opacity-95">
                    
                    {/* Brand header on package */}
                    <div className="flex items-center justify-between bg-slate-800/70 p-2.5 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-sky-400" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">PREMIUM WHOLE GRAIN ATTA</p>
                          <p className="text-[10px] text-slate-400">Category: Packaged Food Commodity</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                        Rule 6(1) Parsed
                      </span>
                    </div>

                    {/* Extracted Fields Mock List */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      
                      <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block font-mono">DECLARATION FIELD</span>
                        <span className="font-semibold text-slate-200">MRP (Incl. taxes)</span>
                        <div className="text-sky-300 font-mono text-[11px] mt-0.5">₹145.00 (₹0.29/g)</div>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block font-mono">DECLARATION FIELD</span>
                        <span className="font-semibold text-slate-200">Net Quantity</span>
                        <div className="text-sky-300 font-mono text-[11px] mt-0.5">500 g (Standard)</div>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block font-mono">DECLARATION FIELD</span>
                        <span className="font-semibold text-slate-200">Manufacturer & Packer</span>
                        <div className="text-slate-300 text-[11px] truncate mt-0.5">M/s PureFoods Pvt. Ltd.</div>
                      </div>

                      <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/80">
                        <span className="text-[10px] text-slate-400 block font-mono">DECLARATION FIELD</span>
                        <span className="font-semibold text-slate-200">Date of Packing</span>
                        <div className="text-sky-300 font-mono text-[11px] mt-0.5">01 / 2026</div>
                      </div>

                    </div>

                    {/* Rule Engine Check Result preview */}
                    <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-200 text-[11px]">Consumer Care Details</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Present (Helpline & Email)</span>
                    </div>

                  </div>
                </div>

                {/* Statutory Basis Bar */}
                <div className="mt-4 pt-3 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    Legal Metrology Act, 2009
                  </span>
                  <span className="text-slate-500">Preliminary Check Suite</span>
                </div>

              </div>

              {/* Design Illustration Note */}
              <p className="mt-2.5 text-[11px] text-slate-400 text-center italic">
                * Conceptual interface illustration under Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
