import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import FAQItem from '../components/FAQItem';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is Maanak Drishti?',
      answer:
        'Maanak Drishti is an AI-assisted packaged commodity label analysis and preliminary compliance checking platform. It assists inspectors, consumers, and stakeholders by scanning product packaging labels, extracting printed declarations using OCR, and evaluating them against the Legal Metrology (Packaged Commodities) Rules, 2011.',
    },
    {
      question: 'What problem does it address?',
      answer:
        'It addresses the challenge of manual label verification across millions of retail products. Manual checks are time-consuming, prone to human fatigue, and make it difficult to detect missing, obscure, or incorrectly formatted statutory declarations across varied packaging categories and regions.',
    },
    {
      question: 'How does label scanning work?',
      answer:
        'The user captures or uploads a digital photograph of a product package or label. The system applies computer vision preprocessing (such as perspective correction, glare reduction, and contrast enhancement) to prepare the text regions for optical character recognition.',
    },
    {
      question: 'What is OCR?',
      answer:
        'OCR (Optical Character Recognition) is a technology that converts typed, printed, or photographed text from packaging materials into structured, machine-readable digital text data that can then be parsed and analyzed by software rules.',
    },
    {
      question: 'How are potential compliance issues identified?',
      answer:
        'Extracted text entities (such as MRP, Net Quantity, Manufacturer details, and Packing Date) are processed by a category-aware rule engine. The engine cross-references these against mandatory declaration checklists codified in the Legal Metrology (Packaged Commodities) Rules, 2011 to flag potential omissions or formatting discrepancies.',
    },
    {
      question: 'Does a potential violation automatically prove an offence?',
      answer:
        'No. A potential violation is strictly an algorithmic preliminary indicator intended to prompt closer assessment and physical verification. It does not constitute automatic legal proof of an offence. Official enforcement and penal action require physical verification by authorized legal metrology officers in accordance with statutory procedures.',
    },
    {
      question: 'What is the difference between the Inspector Portal and Consumer Portal?',
      answer:
        'The Inspector Portal is an enforcement and audit workspace equipped with detailed regulatory clause citations, inspection logging, violation categorization, and exportable audit reports. The Consumer Portal is a simplified educational tool designed to help everyday shoppers understand mandatory disclosures and check packaging details clearly.',
    },
    {
      question: 'Can the system process unclear or incomplete label images?',
      answer:
        'When label images are heavily distorted, blurry, severely shadowed, or torn, OCR confidence decreases. In these instances, the system assigns a "NEEDS REVIEW" status and prompts the user to retake the photo or conduct a manual physical inspection rather than producing an uncertain verdict.',
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="FREQUENTLY ASKED QUESTIONS"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about the Maanak Drishti platform, its capabilities, and its regulatory framework."
        />

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              index={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
          Have additional questions about Maanak Drishti or regulatory rule verification? Reach out through our contact and inquiry section below.
        </div>

      </div>
    </section>
  );
}
