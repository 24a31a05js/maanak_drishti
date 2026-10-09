import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  BadgeCheck,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Info,
  Building2,
} from 'lucide-react';
import { authService, DEMO_INSPECTOR_CREDENTIALS } from '../services/authService';

export default function InspectorAuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Form state - Only Login fields (No signup)
  const [formData, setFormData] = useState({
    inspectorId: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleFillDemoCredentials = () => {
    setFormData({
      inspectorId: DEMO_INSPECTOR_CREDENTIALS.inspectorId,
      email: DEMO_INSPECTOR_CREDENTIALS.email,
      password: DEMO_INSPECTOR_CREDENTIALS.password,
    });
    setErrorMessage('');
  };

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!formData.inspectorId.trim()) {
      setErrorMessage('Inspector ID is required. Use INS-DEMO-001 for prototype evaluation.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Registered Email is required. Use inspector.demo@example.com for prototype evaluation.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Password is required. Use Demo@12345 for prototype evaluation.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.loginInspector({
        inspectorId: formData.inspectorId,
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      // Clear password from local component memory
      setFormData((prev) => ({ ...prev, password: '' }));

      // Navigate to Inspector Dashboard on successful validation
      navigate('/inspector/dashboard');
    } catch (err) {
      // Clear password field on failed attempt
      setFormData((prev) => ({ ...prev, password: '' }));
      setErrorMessage(err.message || 'Invalid Inspector ID, email, or password. Please verify the credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      
      {/* Background Subtle Gradient & Reticle */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Home Navigation Link */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-sky-300 font-mono bg-sky-950/80 border border-sky-800">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>OFFICIAL ENFORCEMENT DESK</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl w-full mx-auto my-8 bg-slate-800/90 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-9 backdrop-blur-md z-10">
        
        {/* Portal Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-950 text-sky-300 border border-sky-800">
            GOVERNMENT-ADMINISTERED ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2.5">
            Inspector Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
            Access your authorized inspection workspace using the credentials provided by your department.
          </p>
        </div>

        {/* DEMONSTRATION CREDENTIALS PANEL (For Jury / Prototype Evaluation) */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-sky-950/50 border border-sky-800/80 text-xs shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-sky-800/60">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Demonstration Credentials (For Jury / Review)</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="px-2.5 py-1 text-[11px] font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Auto-Fill Demo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 font-mono text-[11px]">
            {/* Field 1 */}
            <div className="bg-slate-900/80 p-2 rounded-xl border border-sky-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">INSPECTOR ID</span>
                <span className="text-sky-300 font-semibold">{DEMO_INSPECTOR_CREDENTIALS.inspectorId}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(DEMO_INSPECTOR_CREDENTIALS.inspectorId, 'id')}
                className="text-slate-400 hover:text-white p-1"
                title="Copy Inspector ID"
              >
                {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Field 2 */}
            <div className="bg-slate-900/80 p-2 rounded-xl border border-sky-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">REGISTERED EMAIL</span>
                <span className="text-sky-300 font-semibold truncate block max-w-[110px]" title={DEMO_INSPECTOR_CREDENTIALS.email}>
                  {DEMO_INSPECTOR_CREDENTIALS.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(DEMO_INSPECTOR_CREDENTIALS.email, 'email')}
                className="text-slate-400 hover:text-white p-1 shrink-0"
                title="Copy Email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Field 3 */}
            <div className="bg-slate-900/80 p-2 rounded-xl border border-sky-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">PASSWORD</span>
                <span className="text-sky-300 font-semibold">{DEMO_INSPECTOR_CREDENTIALS.password}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(DEMO_INSPECTOR_CREDENTIALS.password, 'pwd')}
                className="text-slate-400 hover:text-white p-1"
                title="Copy Password"
              >
                {copiedField === 'pwd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: These are demonstration credentials for the prototype only. They are not government-issued credentials.
          </p>
        </div>

        {/* Error Feedback Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form (Strictly No Sign Up Option) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: Inspector ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Inspector ID *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="inspectorId"
                placeholder="e.g. INS-DEMO-001"
                value={formData.inspectorId}
                onChange={handleChange}
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono transition"
              />
            </div>
          </div>

          {/* Field 2: Registered Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Registered Official Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="e.g. inspector.demo@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Field 3: Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowForgotNotice(!showForgotNotice)}
                className="text-xs text-sky-400 hover:text-sky-300 hover:underline transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Explanation Notice */}
          {showForgotNotice && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Credential Reset Policy:</strong> Inspector accounts are administered centrally. Self-service password reset is disabled for statutory security. Please contact your Departmental Administrator or Metrology Nodal Desk to request a credential reset.
              </p>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-800"
              />
              <span>Remember me on this workstation</span>
            </label>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-bold text-sm sm:text-base rounded-xl transition duration-200 shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying Department Credentials...</span>
              </span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Government-Administered Policy Explanation Notice */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Government-Administered Account Policy</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-400">
            Inspector accounts are created exclusively by the government or authorized administrators. Self-registration is restricted to prevent unauthorized regulatory access.
          </p>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="max-w-xl w-full mx-auto text-center text-xs text-slate-400 z-10">
        <span>Maanak Drishti • Smart Compliance for Every Label</span>
      </div>

    </div>
  );
}
