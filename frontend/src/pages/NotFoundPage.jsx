import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 text-sky-400 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold mt-2 text-slate-200">Page Not Found</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        The requested URL does not exist on the Maanak Drishti platform. Please check the address or return to the home page.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold text-sm transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
