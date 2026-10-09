import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, stepNumber }) {
  return (
    <div className="relative group bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header with Icon and index */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          {stepNumber && (
            <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-sky-500 transition-colors">
              {stepNumber}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-950 transition-colors mb-2.5">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-sky-800 transition-colors">
        <span>Planned Architecture</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-sky-500 transition-colors"></span>
      </div>
    </div>
  );
}
