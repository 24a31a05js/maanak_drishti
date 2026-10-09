import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PortalCard({
  title,
  subtitle,
  tag,
  icon: Icon,
  description,
  items,
  buttonText,
  onClick,
  accentColor = 'sky',
}) {
  const isSky = accentColor === 'sky';

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all duration-300 p-6 sm:p-8 lg:p-10 group ${
      isSky ? 'hover:border-sky-300' : 'hover:border-teal-300'
    }`}>
      {/* Top Accent Gradient line */}
      <div className={`absolute top-0 left-8 right-8 h-1 rounded-b-full ${
        isSky ? 'bg-gradient-to-r from-sky-500 to-indigo-600' : 'bg-gradient-to-r from-teal-500 to-emerald-600'
      }`}></div>

      <div>
        {/* Header icon and badges */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isSky ? 'bg-sky-100 text-sky-700' : 'bg-teal-100 text-teal-700'
          }`}>
            <Icon className="w-7 h-7" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isSky ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-teal-50 text-teal-800 border border-teal-200'
          }`}>
            {tag}
          </span>
        </div>

        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest block mb-1">
            {subtitle}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          {description}
        </p>

        {/* Feature List */}
        <div className="border-t border-slate-100 pt-5 mb-8">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            Core Capabilities:
          </h4>
          <ul className="space-y-2.5">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isSky ? 'text-sky-600' : 'text-teal-600'
                }`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClick}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
            isSky
              ? 'bg-slate-900 hover:bg-sky-700 text-white shadow-slate-900/10 hover:shadow-sky-600/20'
              : 'bg-slate-900 hover:bg-teal-700 text-white shadow-slate-900/10 hover:shadow-teal-600/20'
          }`}
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-[11px] text-center text-slate-600 mt-2">
          Click to view portal details & development status
        </p>
      </div>
    </div>
  );
}
