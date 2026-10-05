/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { RemoveBgPage } from './pages/RemoveBgPage';
import { EditorPage } from './pages/EditorPage';
import { PricingPage } from './pages/PricingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { BillingPage } from './pages/BillingPage';
import { ApiPage } from './pages/ApiPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPages } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeEditorImage, setActiveEditorImage] = useState<{
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  } | null>(null);

  // Sync hash navigation if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, params?: any) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectImageForEditor = (img: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  }) => {
    setActiveEditorImage(img);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 transition-colors selection:bg-indigo-500/30 selection:text-indigo-200">
          
          {/* Top Sticky Navbar */}
          <Navbar 
            currentPage={currentPage} 
            onNavigate={navigateTo} 
          />

          {/* Page Routing */}
          <main className="flex-1 flex flex-col">
            {currentPage === 'home' && (
              <HomePage 
                onNavigate={navigateTo} 
                onSelectImageForEditor={handleSelectImageForEditor}
              />
            )}

            {currentPage === 'remove-bg' && (
              <RemoveBgPage 
                onNavigate={navigateTo} 
                onSelectImageForEditor={handleSelectImageForEditor}
              />
            )}

            {currentPage === 'editor' && (
              <EditorPage 
                initialImage={activeEditorImage}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'pricing' && (
              <PricingPage onNavigate={navigateTo} />
            )}

            {currentPage === 'features' && (
              <FeaturesPage onNavigate={navigateTo} />
            )}

            {currentPage === 'how-it-works' && (
              <HowItWorksPage onNavigate={navigateTo} />
            )}

            {currentPage === 'about' && (
              <AboutPage onNavigate={navigateTo} />
            )}

            {currentPage === 'contact' && (
              <ContactPage />
            )}

            {(currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password') && (
              <AuthPages 
                initialMode={currentPage as 'login' | 'register' | 'forgot-password'}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage 
                onNavigate={navigateTo}
                onSelectImageForEditor={handleSelectImageForEditor}
              />
            )}

            {currentPage === 'history' && (
              <HistoryPage 
                onNavigate={navigateTo}
                onSelectImageForEditor={handleSelectImageForEditor}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage />
            )}

            {currentPage === 'billing' && (
              <BillingPage onNavigate={navigateTo} />
            )}

            {currentPage === 'api' && (
              <ApiPage />
            )}

            {currentPage === 'admin' && (
              <AdminPage />
            )}

            {currentPage === 'privacy' && (
              <LegalPages type="privacy" onNavigate={navigateTo} />
            )}

            {currentPage === 'terms' && (
              <LegalPages type="terms" onNavigate={navigateTo} />
            )}

            {currentPage === 'cookies' && (
              <LegalPages type="cookies" onNavigate={navigateTo} />
            )}

            {![
              'home', 'remove-bg', 'editor', 'pricing', 'features', 'how-it-works',
              'about', 'contact', 'login', 'register', 'forgot-password', 'dashboard',
              'history', 'settings', 'billing', 'api', 'admin', 'privacy', 'terms', 'cookies'
            ].includes(currentPage) && (
              <NotFoundPage onNavigate={navigateTo} />
            )}
          </main>

          {/* Global Footer (hidden only when in full screen editor mode for maximum workspace) */}
          {currentPage !== 'editor' && (
            <Footer onNavigate={navigateTo} />
          )}

        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
