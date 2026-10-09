import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import InspectorAuthPage from './pages/InspectorAuthPage';
import ConsumerAuthPage from './pages/ConsumerAuthPage';
import InspectorDashboard from './pages/InspectorDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import NotFoundPage from './pages/NotFoundPage';

// Layout wrapper for Home page
function HomeLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Home Page */}
        <Route path="/" element={<HomeLayout />} />

        {/* 2. Inspector Authentication (Login & Signup) */}
        <Route path="/inspector/auth" element={<InspectorAuthPage />} />

        {/* 3. Consumer Authentication (Login & Signup) */}
        <Route path="/consumer/auth" element={<ConsumerAuthPage />} />

        {/* 4. Inspector Dedicated Dashboard */}
        <Route path="/inspector/dashboard" element={<InspectorDashboard />} />

        {/* 5. Consumer Dedicated Dashboard */}
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />

        {/* 6. Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
