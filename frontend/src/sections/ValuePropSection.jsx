import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Target, Lightbulb, ClipboardCheck, Users2, Check } from 'lucide-react';

export default function ValuePropSection() {
  const valueProps = [
    {
      icon: Target,
      tag: 'PRECISION',
      title: 'Category-Aware',
      description:
        'Regulatory criteria change based on commodity types (food items, beverages, textiles, cosmetics). The platform considers the specific requirements relevant to the identified commodity category.',
      highlight: 'Tailored rule schedule mapping',
    },
    {
      icon: Lightbulb,
      tag: 'TRANSPARENCY',
      title: 'Explainable',
      description:
        'Eliminates opaque "black box" decisions. Every potential issue is accompanied by clear, human-readable explanations referencing the exact statutory clause or missing declaration field.',
      highlight: 'Explicit statutory rationale',
    },
    {
      icon: ClipboardCheck,
      tag: 'EFFICIENCY',
      title: 'Inspection-Ready',
      description:
        'Engineered to support organized field workflows, standardized data logging, structured audit records, and reproducible preliminary compliance documentation.',
      highlight: 'Standardized digital records',
    },
    {
      icon: Users2,
      tag: 'INCLUSIVITY',
      title: 'Dual-User Design',
      description:
        'Delivers distinct, role-tailored interfaces: a rigorous enforcement and cataloging dashboard for inspectors, and a simplified educational interface for everyday consumers.',
      highlight: 'Specialized user experiences',
    },
  ];

  return (
    <section id="value-prop" className="py-20 lg:py-28 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="VALUE PROPOSITION"
          title="Designed for Explainable Compliance"
          subtitle="Four architectural principles ensuring our solution provides defensible, category-aware, and actionable assistance to stakeholders."
          dark={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 rounded-2xl p-7 border border-slate-700 hover:border-sky-500/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                      {item.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-700/60 text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/70 flex items-center gap-2 text-xs font-semibold text-sky-400">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
