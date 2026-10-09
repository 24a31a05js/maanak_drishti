import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Clock, AlertTriangle, FileQuestion, Layers, SearchX, CheckCircle } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      number: '01',
      title: 'Time-Consuming Manual Inspection',
      description:
        'Inspecting numerous product labels manually across retail stores, wholesale hubs, and distribution warehouses requires substantial human effort, visual strain, and repetitive physical verification.',
      impactPoint: 'High workload during mass field inspection drives',
    },
    {
      icon: AlertTriangle,
      number: '02',
      title: 'Missing or Incorrect Declarations',
      description:
        'Mandatory statutory disclosures—including MRP inclusions, unit sale prices, net quantity declarations, dates of packing, and consumer care helplines—may be omitted, obscurely sized, or formatted inconsistently.',
      impactPoint: 'Challenging to detect nuanced omissions by eye alone',
    },
    {
      icon: FileQuestion,
      number: '03',
      title: 'Difficult Record Tracking',
      description:
        'Reviewing past inspection logs, cross-referencing repeat occurrences across brands, and cataloging potential discrepancies becomes fragmented when relying solely on decentralized physical paperwork.',
      impactPoint: 'Lack of unified structured audit trails for verification',
    },
  ];

  return (
    <section id="problem" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="THE CHALLENGE"
          title="Manual Label Verification Can Be Difficult"
          subtitle="Checking packaged commodity labels requires attention to multiple declarations and the requirements applicable to each product category."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 rounded-2xl p-7 sm:p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top indicator & icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ISSUE #{item.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                  <span>{item.impactPoint}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative takeaway box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-sky-400">
              Regulatory Context: Legal Metrology (Packaged Commodities) Rules, 2011
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Rule 6 mandates specific declarations on every package. Automating initial scanning and rule mapping provides structured assistance before administrative review.
            </p>
          </div>
          <div className="shrink-0">
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Preliminary Verification Needed
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
