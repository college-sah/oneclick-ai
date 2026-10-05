import React from 'react';
import { ShieldCheck, FileText, Cookie, Sparkles } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookies';
  onNavigate: (page: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-neutral-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-400">
            {type === 'privacy' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            {type === 'terms' && <FileText className="w-3.5 h-3.5 text-indigo-400" />}
            {type === 'cookies' && <Cookie className="w-3.5 h-3.5 text-amber-400" />}
            <span>Compliance & Legal Standards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {type === 'privacy' && 'Privacy Policy'}
            {type === 'terms' && 'Terms of Service'}
            {type === 'cookies' && 'Cookie Policy'}
          </h1>
          <p className="text-xs text-neutral-400">
            Last modified: October 4, 2026 • OneClickBG (SnapCut AI Inc)
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {type === 'privacy' && (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">1. Commitment to Image Data Privacy</h2>
                <p>
                  At OneClickBG, your digital imagery, catalog assets, and customer photos are treated with strict confidentiality. Images uploaded for background removal are retained in volatile RAM during AI segmentation and temporarily cached on encrypted storage solely to allow client downloading.
                </p>
                <p>
                  All processed temporary assets are automatically purged from our servers within 24 hours. We never sell, index, or use your uploaded imagery to train public foundational models without your explicit corporate opt-in.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
                <p>
                  When you register for an account, we collect your name, email address, password hash, and billing transaction tokens generated via Stripe. We do not store raw credit card numbers on our servers.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">3. GDPR & CCPA Rights</h2>
                <p>
                  You possess the legal right to request complete erasure of your account, download an archive of your processing metadata, or revoke API access at any moment via your Account Settings panel.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
                <p>
                  By accessing OneClickBG, connecting via our REST API, or uploading imagery, you agree to abide by these Terms of Service and all applicable international copyright statutes.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">2. Commercial Use & Intellectual Property</h2>
                <p>
                  You retain full, unencumbered ownership of all images you upload. Subscribers on Pro Creator and Business Team tiers receive a worldwide, perpetual commercial license to use, monetize, and distribute all cutouts and background-replaced outputs.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">3. Acceptable Use Policy</h2>
                <p>
                  You may not utilize OneClickBG to process illegal, abusive, non-consensual defamatory imagery, or attempt reverse engineering of our proprietary neural alpha matting models.
                </p>
              </section>
            </>
          )}

          {type === 'cookies' && (
            <>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">1. Use of Cookies & Local Storage</h2>
                <p>
                  OneClickBG uses strictly essential cookies and browser localStorage to securely maintain your authentication session, preserve your visual theme preference (dark/light mode), and remember your canvas zoom scale.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white">2. No Third-Party Ad Trackers</h2>
                <p>
                  We do not embed third-party surveillance advertising cookies or behavioral brokers. All analytics are anonymized and aggregated strictly for server performance monitoring.
                </p>
              </section>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
