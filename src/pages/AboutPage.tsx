import React from 'react';
import { Sparkles, Users, Award, ShieldCheck, Heart, Globe, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Our Mission & Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Empowering Visual Creativity with Fast, Intelligent AI
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            OneClickBG (SnapCut AI) was founded on a simple conviction: photographers, shop owners, and designers shouldn't waste millions of collective hours tracing lasso outlines in desktop software.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">10M+</div>
            <div className="text-xs text-neutral-400">Images Processed</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">1.4s</div>
            <div className="text-xs text-neutral-400">Average AI Cutout Speed</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">99.98%</div>
            <div className="text-xs text-neutral-400">Global Uptime SLA</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 font-mono">140+</div>
            <div className="text-xs text-neutral-400">Countries Served</div>
          </div>
        </div>

        {/* Story Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-6">
          <h2 className="text-2xl font-bold text-white">Built by Computer Vision Engineers & Designers</h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            In 2024, our team of computer vision specialists set out to re-architect background extraction from first principles. By marrying semantic deep scene understanding with high-frequency spatial matting kernels, we achieved sub-pixel accuracy that preserves the most stubborn details—like frizzy curls, animal fur, transparent glassware, and motion blur.
          </p>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Today, OneClickBG processes millions of images every month for independent Shopify entrepreneurs, Fortune 500 automotive marketplaces, and leading marketing agencies.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <Award className="w-8 h-8 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Uncompromising Quality</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We never cut corners with low-resolution downscaling or aggressive erosion masks that clip your subjects.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Ironclad Privacy</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your customer and catalog images belong strictly to you. All files are automatically cleansed after 24 hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <Globe className="w-8 h-8 text-purple-400" />
            <h3 className="text-base font-bold text-white">Developer Friendly</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Comprehensive REST endpoints, reliable SDKs, and transparent pricing with no hidden surcharges.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('remove-bg')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2"
          >
            <span>Experience OneClickBG Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
