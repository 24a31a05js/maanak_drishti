import React from 'react';
import { Camera, FileSearch, CheckCircle, HelpCircle, Layers, SlidersHorizontal, BookOpen, Binary } from 'lucide-react';

export default function CapabilityStrip() {
  const capabilities = [
    {
      icon: Camera,
      title: 'Image Processing',
      subtitle: 'Preprocessing, perspective correction & contrast tuning',
    },
    {
      icon: Binary,
      title: 'OCR Text Extraction',
      subtitle: 'Optical character extraction from printed package labels',
    },
    {
      icon: SlidersHorizontal,
      title: 'Category-Aware Validation',
      subtitle: 'Rules applied based on declared commodity classification',
    },
    {
      icon: BookOpen,
      title: 'Explainable Results',
      subtitle: 'Preliminary findings with transparent rule citations',
    },
  ];

  return (
    <div className="relative z-20 bg-slate-900 border-y border-slate-800 py-6 sm:py-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/80 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
