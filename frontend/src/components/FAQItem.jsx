import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQItem({ question, answer, isOpen, onToggle, index }) {
  const headingId = `faq-heading-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200 hover:border-slate-300">
      <button
        type="button"
        id={headingId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-semibold text-slate-900 hover:text-sky-800 focus:outline-none focus:bg-slate-50 transition-colors"
      >
        <span className="text-sm sm:text-base leading-snug">
          {question}
        </span>
        <div className={`p-1 rounded-md text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-sky-800' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-in fade-in duration-200"
        >
          {answer}
        </div>
      )}
    </div>
  );
}
