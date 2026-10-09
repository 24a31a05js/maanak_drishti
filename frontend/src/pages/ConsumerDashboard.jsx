import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  LayoutDashboard,
  Camera,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  LogOut,
  User,
  Info,
  CheckCircle2,
  AlertCircle,
  Tag,
  Calendar,
  Scale,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService';

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/consumer/auth');
    } else if (currentUser.role === 'inspector') {
      navigate('/inspector/dashboard');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Consumer Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Product Label', icon: Camera },
    { id: 'info', label: 'Product Label Info', icon: Tag },
    { id: 'results', label: 'Compliance Explanations', icon: ShieldCheck },
    { id: 'guidance', label: 'Label-Reading Guide', icon: BookOpen },
    { id: 'awareness', label: 'Compliance Awareness', icon: HelpCircle },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      
      {/* Top Consumer Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand & Workspace Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-wide block">
                  MAANAK DRISHTI
                </span>
                <span className="text-[10px] text-teal-400 font-mono block -mt-1">
                  Consumer Portal
                </span>
              </div>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">
              Consumer Rights & Awareness
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-200 font-medium">{user?.name || 'Informed Consumer'}</span>
              <span className="text-slate-500">|</span>
              <span className="text-teal-400 font-mono text-[10px]">CITIZEN</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 hover:border-rose-800 border border-slate-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Consumer Workspace: Sidebar + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-grow flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1 sticky top-20 shadow-lg">
            <div className="px-3 py-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Consumer Tools
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-700/70 px-3 pb-2 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold block mb-0.5">Know Your Rights</span>
              <p className="leading-snug text-slate-500">
                Statutory mandatory declarations protect buyers under Indian law.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
                      CITIZEN EMPOWERMENT
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Understand What You Buy
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Maanak Drishti helps you verify packaged product labels, understand mandatory details, and identify potential packaging omissions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('scan')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Scan a Product Label</span>
                  </button>
                </div>
              </div>

              {/* Educational Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Statutory Rule</span>
                    <Tag className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl font-bold text-white">MRP Declarations</div>
                  <p className="text-xs text-slate-400">Must state &quot;Incl. of all taxes&quot; with Unit Sale Price per unit.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Transparency</span>
                    <Scale className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Net Quantity</div>
                  <p className="text-xs text-slate-400">Standard units (g, kg, ml, L) without misleading packaging sizes.</p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Consumer Care</span>
                    <PhoneCall className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl font-bold text-white">Helpline & Address</div>
                  <p className="text-xs text-slate-400">Mandatory contact telephone & email of manufacturer or packer.</p>
                </div>
              </div>

              {/* Empty state prompt */}
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 flex items-center justify-center mx-auto border border-teal-800">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Product Scanned Yet</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Take a photo of any grocery package, beverage carton, or household product label to view simplified explanations.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('scan')}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Start Label Scan
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: SCAN PRODUCT LABEL */}
          {activeTab === 'scan' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-white">Scan or Upload Product Label</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Upload an image of the front or back label of your packaged item.
                </p>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-600 hover:border-teal-500 rounded-2xl p-8 text-center bg-slate-900/60 transition-colors">
                <input
                  type="file"
                  id="consumer-label-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="consumer-label-upload" className="cursor-pointer block space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white hover:text-teal-400 block">
                      Choose an image or take a photo with your camera
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">
                      PNG, JPG, or WEBP • Clear, well-lit photos work best
                    </span>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-teal-400" />
                    <div>
                      <span className="text-sm font-semibold text-white block">{selectedFile.name}</span>
                      <span className="text-xs text-slate-400 block">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready for label analysis
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    View Label Details
                  </button>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong>OCR Engine Note:</strong> The user interface is active. Live camera analysis and OCR extraction will connect to the backend analysis service in the next phase.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT LABEL INFO */}
          {activeTab === 'info' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Product Label Information</h3>
              <p className="text-xs text-slate-400">
                Detailed breakdown of parsed declarations from your scanned commodity package.
              </p>

              <div className="py-12 text-center text-slate-500 space-y-2">
                <Tag className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-400">No product currently selected.</p>
                <p className="text-xs text-slate-500">Scan a product label to view extracted values for MRP, Net Weight, Dates, and Manufacturer.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('scan')}
                  className="mt-3 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Scan a Product Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: COMPLIANCE EXPLANATIONS */}
          {activeTab === 'results' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Compliance Result Explanations</h3>
              <p className="text-xs text-slate-400">
                Understand what each label status means in simple, consumer-friendly terms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-900 text-emerald-300">COMPLIANT</span>
                  <h4 className="text-sm font-bold text-white">All Key Declarations Present</h4>
                  <p className="text-xs text-slate-300">All mandatory details like MRP, Net Quantity, Packing Date, and Manufacturer address were clearly identified.</p>
                </div>
                <div className="p-5 rounded-xl bg-rose-950/40 border border-rose-800 space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-900 text-rose-300">POTENTIAL ISSUE</span>
                  <h4 className="text-sm font-bold text-white">Possible Missing Detail</h4>
                  <p className="text-xs text-slate-300">One or more required declarations could not be found or appear incomplete. Useful flag to double check the package.</p>
                </div>
                <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-800 space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-900 text-amber-300">NEEDS REVIEW</span>
                  <h4 className="text-sm font-bold text-white">Unclear Image</h4>
                  <p className="text-xs text-slate-300">Photo was blurry or glare prevented reading the text clearly. Retaking with better lighting is advised.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LABEL-READING GUIDE */}
          {activeTab === 'guidance' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Everyday Label-Reading Guidance</h3>
              <p className="text-xs text-slate-400">
                Learn what statutory declarations to look for when purchasing packaged goods.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-teal-400">1. Maximum Retail Price (MRP) & Unit Sale Price</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under the Packaged Commodities Rules, the MRP must include all taxes. Packages containing more than a single unit must also declare the Unit Sale Price (e.g. ₹ per gram or ₹ per millilitre) to help you compare prices between pack sizes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-teal-400">2. Net Quantity Declarations</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Net quantity must be declared in standard SI metric units (g, kg, ml, L). It must not include qualifying words like &quot;approximate&quot; or &quot;when packed&quot;.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-teal-400">3. Date of Packing or Manufacture</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Must declare the month and year of manufacture, packing, or pre-packing, along with Best Before or Expiry dates where applicable.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
                  <h4 className="text-sm font-bold text-teal-400">4. Manufacturer or Packer Contact Details</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The package must state the complete name and address of the manufacturer, packer, or importer, accompanied by a consumer care telephone number and email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMPLIANCE AWARENESS */}
          {activeTab === 'awareness' && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-white">Consumer Rights & Compliance Awareness</h3>
              <p className="text-xs text-slate-400">
                Statutory protections enacted to prevent misleading packaging and unfair trade practices.
              </p>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>The Legal Metrology Act, 2009</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Indian law strictly prohibits selling any pre-packaged commodity at a price higher than the declared Maximum Retail Price. Overcharging, smudging printed prices, or pasting unauthorized price stickers over the original MRP is a punishable statutory violation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/80 text-xs text-slate-300 space-y-1">
                <strong className="text-teal-300 block">National Consumer Helpline (NCH):</strong>
                <p>Citizens can report packaging discrepancies or unfair trade practices through official channels at <span className="text-white font-mono">consumerhelpline.gov.in</span> or toll-free at <span className="text-white font-mono">1915</span>.</p>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
