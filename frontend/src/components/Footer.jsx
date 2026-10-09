import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUp, ExternalLink, ChevronRight, Scale } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/' + targetId);
      return;
    }

    if (targetId === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(targetId);
    if (target) {
      const navOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Project Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <ShieldCheck className="w-6 h-6 text-sky-100" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider text-white block">
                  MAANAK DRISHTI
                </span>
                <span className="text-xs text-sky-400 font-medium tracking-wide">
                  Smart Compliance for Every Label
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An AI-assisted packaged commodity label analysis and preliminary compliance checking platform designed to support inspectors, consumers, and regulatory stakeholders under the Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-300 font-medium">
                  Regulatory Technology Platform
                </span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', href: '#hero' },
                { name: 'The Challenge', href: '#problem' },
                { name: 'Our Solution', href: '#solution' },
                { name: 'Capabilities', href: '#features' },
                { name: 'Workflow', href: '#workflow' },
                { name: 'Choose Portal', href: '#portals' },
                { name: 'About', href: '#about' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Portals Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Dedicated Portals
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/inspector/auth"
                  className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  <span>Inspector Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/consumer/auth"
                  className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
                  <span>Consumer Portal</span>
                </Link>
              </li>
              <li>
                <a
                  href="#regulatory"
                  onClick={(e) => handleScrollTo(e, '#regulatory')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Legal Metrology Norms</span>
                </a>
              </li>
              <li>
                <a
                  href="#compliance"
                  onClick={(e) => handleScrollTo(e, '#compliance')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Status Definitions</span>
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleScrollTo(e, '#faq')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>FAQ & Queries</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Statutory Basis Reference */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Statutory Basis
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="leading-relaxed">
                Rules codified under:
                <strong className="text-slate-200 block mt-1">Legal Metrology Act, 2009</strong>
                <span className="text-slate-400 block">Packaged Commodities Rules, 2011</span>
              </p>
              <div className="pt-2">
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  <span>Dept. of Consumer Affairs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear} MAANAK DRISHTI. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>Legal Metrology Compliance Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">Preliminary Rule Validation Engine</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
