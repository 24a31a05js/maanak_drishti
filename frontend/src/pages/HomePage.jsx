import React from 'react';
import HeroSection from '../sections/HeroSection';
import CapabilityStrip from '../sections/CapabilityStrip';
import ProblemSection from '../sections/ProblemSection';
import SolutionSection from '../sections/SolutionSection';
import FeaturesSection from '../sections/FeaturesSection';
import WorkflowSection from '../sections/WorkflowSection';
import ComplianceSection from '../sections/ComplianceSection';
import PortalsSection from '../sections/PortalsSection';
import ValuePropSection from '../sections/ValuePropSection';
import AboutSection from '../sections/AboutSection';
import RegulatorySection from '../sections/RegulatorySection';
import FAQSection from '../sections/FAQSection';
import ContactSection from '../sections/ContactSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Capability Strip */}
      <CapabilityStrip />

      {/* 3. The Challenge / Problem Statement */}
      <ProblemSection />

      {/* 4. Our Solution */}
      <SolutionSection />

      {/* 5. Platform Features */}
      <FeaturesSection />

      {/* 6. Four-Stage Workflow */}
      <WorkflowSection />

      {/* 7. Compliance Status Framework */}
      <ComplianceSection />

      {/* 8. Choose Your Portal */}
      <PortalsSection />

      {/* 9. Unique Value Proposition */}
      <ValuePropSection />

      {/* 10. About Maanak Drishti */}
      <AboutSection />

      {/* 11. Regulatory Context */}
      <RegulatorySection />

      {/* 12. Frequently Asked Questions */}
      <FAQSection />

      {/* 13. Contact & Final Call to Action */}
      <ContactSection />
    </>
  );
}
