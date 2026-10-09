import React from 'react';
import SectionHeading from '../components/SectionHeading';
import FeatureCard from '../components/FeatureCard';
import { Camera, FileCode2, LayoutList, FolderKanban, Scale, History, ArrowRight } from 'lucide-react';

export default function FeaturesSection() {
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const features = [
    {
      icon: Camera,
      stepNumber: '01',
      title: 'Product Image Scanning',
      description:
        'Designed to accept product label images captured directly via camera or uploaded as digital files, accommodating various package formats and lighting conditions.',
    },
    {
      icon: FileCode2,
      stepNumber: '02',
      title: 'OCR Text Extraction',
      description:
        'Extract readable printed text from submitted images using optical character recognition, converting physical typography into machine-readable digital strings.',
    },
    {
      icon: LayoutList,
      stepNumber: '03',
      title: 'Important Field Extraction',
      description:
        'Organize extracted text into structured statutory entities such as Product Name, Manufacturer/Packer, MRP, Net Quantity, and applicable Date of Packing or Expiry.',
    },
    {
      icon: FolderKanban,
      stepNumber: '04',
      title: 'Product Category Identification',
      description:
        'Identify or select the relevant commodity classification (e.g. food, cosmetics, industrial commodities) so that the correct category-specific requirements are applied.',
    },
    {
      icon: Scale,
      stepNumber: '05',
      title: 'Rule-Based Compliance Validation',
      description:
        'Compare extracted declarations against mandatory provisions under the Legal Metrology (Packaged Commodities) Rules, 2011 to flag potential discrepancies.',
    },
    {
      icon: History,
      stepNumber: '06',
      title: 'Explainable Reports & Inspection History',
      description:
        'Generate clear diagnostic summaries, structured audit records, and exportable inspection reports with full traceability of past preliminary verification results.',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="PLATFORM CAPABILITIES"
          title="Everything Needed for Smarter Label Checks"
          subtitle="A comprehensive toolkit engineered to assist preliminary label compliance checks through modern computer vision and regulatory rule intelligence."
        />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              icon={feat.icon}
              stepNumber={feat.stepNumber}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>

        {/* Action Button & Disclaimer */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center">
          <a
            href="#workflow"
            onClick={(e) => handleScrollTo(e, '#workflow')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <span>Discover How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-500 max-w-xl">
            * Features represent core capabilities designed to support preliminary compliance verification under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

      </div>
    </section>
  );
}
