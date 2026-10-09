import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert, FileText, Info } from 'lucide-react';

export default function ComplianceSection() {
  const statusCards = [
    {
      status: 'COMPLIANT',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderClass: 'border-emerald-200 hover:border-emerald-400',
      icon: CheckCircle2,
      summary: 'The checks performed passed the applicable validation criteria.',
      description:
        'All mandatory declarations required under Rule 6 for the identified commodity category were successfully detected, parsed, and met statutory formatting and completeness thresholds.',
      actionNote: 'Preliminary check cleared. Standard archive created.',
    },
    {
      status: 'POTENTIAL VIOLATION',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      iconClass: 'bg-rose-50 text-rose-700 border-rose-200',
      borderClass: 'border-rose-200 hover:border-rose-400',
      icon: AlertOctagon,
      summary: 'One or more checks indicate a possible missing or incorrect declaration.',
      description:
        'A mandatory statutory element (such as MRP with tax inclusion, unit sale price, net quantity, or complete packer address) could not be identified or deviates from standard category requirements.',
      actionNote: 'Flagged for authorized inspector physical review.',
    },
    {
      status: 'NEEDS REVIEW',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      iconClass: 'bg-amber-50 text-amber-700 border-amber-200',
      borderClass: 'border-amber-200 hover:border-amber-400',
      icon: HelpCircle,
      summary: 'The information is incomplete, uncertain or insufficiently reliable to reach a confident result.',
      description:
        'Image quality issues, severe glare, partial label obscuration, non-standard typography, or ambiguous text prevent the rule engine from establishing reliable preliminary verification.',
      actionNote: 'Prompts re-capture or secondary manual inspection.',
    },
  ];

  return (
    <section id="compliance" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="DECISION FRAMEWORK"
          title="Clear Results. Understandable Reasons."
          subtitle="Maanak Drishti categorizes verification outcomes into three well-defined diagnostic categories, ensuring transparency and audit traceability."
        />

        {/* Status Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statusCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-7 border ${item.borderClass} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${item.badgeClass}`}>
                      {item.status}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.iconClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {item.summary}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>{item.actionNote}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Essential Statutory Caveat Banner */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-300/80 p-6 sm:p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Statutory Clarification & Due Process
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A <strong>Potential Violation</strong> flag generated by the platform serves as an algorithmic indicator intended to alert inspectors and users for further examination. It is <strong>not automatic legal proof of an offence</strong> under the Legal Metrology Act, 2009. Official legal proceedings require formal verification and inspection by designated statutory authorities.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
