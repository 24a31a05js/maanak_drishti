import React, { useState } from 'react';
import { ArrowRight, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Inspector',
    message: '',
  });

  const handleScrollToPortals = (e) => {
    e.preventDefault();
    const target = document.querySelector('#portals');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl mb-16">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-900/60 text-sky-300 border border-sky-700/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart Compliance Platform</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Make Label Information Easier to Understand
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Explore how Maanak Drishti aims to support transparent label information and structured preliminary compliance checks.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#portals"
                onClick={handleScrollToPortals}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 shadow-lg shadow-sky-600/30 transition-all duration-200 hover:-translate-y-0.5 text-base"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#regulatory"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#regulatory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-base"
              >
                <span>View Regulatory Norms</span>
              </a>
            </div>

            <div className="pt-4 text-xs text-slate-400">
              Maanak Drishti • Smart Compliance for Every Label
            </div>
          </div>
        </div>

        {/* Stakeholder Query & Feedback Form */}
        <div className="max-w-2xl mx-auto bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Stakeholder Feedback & Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Have questions regarding label validation rules or platform workflows? Leave your note below.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-950">Thank you for your feedback!</h4>
              <p className="text-xs sm:text-sm text-emerald-800">
                Your message has been received by the Maanak Drishti platform team.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: '', role: 'Inspector', message: '' });
                }}
                className="mt-3 px-4 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="stakeholder-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Name / Department
                </label>
                <input
                  type="text"
                  id="stakeholder-name"
                  required
                  placeholder="e.g. Retail Officer or Consumer Advocate"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="stakeholder-role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stakeholder Category
                </label>
                <select
                  id="stakeholder-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                >
                  <option value="Inspector">Field Inspector / Enforcement Officer</option>
                  <option value="Consumer">Citizen / Consumer Advocate</option>
                  <option value="Manufacturer">Manufacturer / Packaged Goods Producer</option>
                  <option value="Legal">Legal Metrology Professional / Advocate</option>
                </select>
              </div>

              <div>
                <label htmlFor="stakeholder-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inquiry or Suggestion
                </label>
                <textarea
                  id="stakeholder-message"
                  required
                  rows={3}
                  placeholder="Share remarks on rule engine coverage or user workflow..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Submit Feedback</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
