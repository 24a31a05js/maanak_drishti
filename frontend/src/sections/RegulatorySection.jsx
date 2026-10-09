import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Scale, BookCheck, ExternalLink, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function RegulatorySection() {
  const provisions = [
    {
      act: 'Legal Metrology Act, 2009',
      reference: 'Act No. 1 of 2010',
      description: 'Establishes and enforces standards of weights and measures, regulates trade and commerce in weights, measures and other goods sold or distributed by weight, measure or number.',
    },
    {
      act: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      reference: 'G.S.R. 202(E) dated 7th March, 2011',
      description: 'Codifies mandatory declarations on every pre-packaged commodity, including name & address of manufacturer/packer, common or generic name of commodity, net quantity, month & year of manufacture/packing, and retail sale price.',
    },
    {
      act: 'Statutory Amendments & Gazette Notifications',
      reference: 'E-commerce & Unit Sale Price Guidelines',
      description: 'Incorporates amendments requiring mandatory Unit Sale Price (USP) per gram/millilitre/number, standard font dimensions by package area, and declaration of country of origin for imported goods.',
    },
  ];

  return (
    <section id="regulatory" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="STATUTORY BASIS"
          title="Grounded in Applicable Legal Requirements"
          subtitle="Maanak Drishti's compliance validation logic is engineered around verified statutory mandates enacted by the Government of India."
        />

        {/* Regulatory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {provisions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl p-7 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                    {item.reference}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {item.act}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-semibold text-sky-800">
                <BookCheck className="w-4 h-4 text-sky-700" />
                <span>Auditable Statutory Clause</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Maintenance Callout */}
        <div className="bg-sky-50 rounded-2xl p-6 sm:p-8 border border-sky-200 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <span>Maintained & Reviewed Regulatory Rule Base</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Because packaging regulations evolve through periodic gazette amendments and category clarifications, Maanak Drishti's rule engine is designed with a decoupled regulatory rules repository that allows updates to be verified and maintained systematically.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="https://consumeraffairs.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <span>Department of Consumer Affairs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
