import React from 'react';
import { UploadCloud, Cpu, Palette, Download, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Behind The Scenes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How OneClickBG Works
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            A step-by-step technical breakdown of neural foreground segmentation and sub-pixel alpha matting.
          </p>
        </div>

        {/* Timeline steps */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-translate-x-px before:w-0.5 before:bg-neutral-800 before:z-0">
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 md:text-right order-2 md:order-1">
              <span className="text-xs font-bold text-indigo-400 font-mono">STAGE 01</span>
              <h3 className="text-xl font-bold text-white mt-1">Image Ingestion & Dynamic Range Normalization</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                When you drag and drop a file or paste via clipboard, our engine validates color space, removes EXIF metadata for privacy, and prepares high-precision tensor matrices across RGB channels.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-indigo-600/30 shrink-0 order-1 md:order-2">
              <UploadCloud className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="flex-1 order-3 hidden md:block" />
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 order-3 md:order-1 hidden md:block" />
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-purple-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-purple-600/30 shrink-0 order-1 md:order-2">
              <Cpu className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex-1 order-2 md:order-3">
              <span className="text-xs font-bold text-purple-400 font-mono">STAGE 02</span>
              <h3 className="text-xl font-bold text-white mt-1">Semantic Foreground Separation & Contour Analysis</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                A dual-stream deep neural network analyzes high-level object context (identifying portraits, apparel, footwear, or vehicles) alongside low-level boundary transitions to isolate foreground subjects from complex backgrounds.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 md:text-right order-2 md:order-1">
              <span className="text-xs font-bold text-pink-400 font-mono">STAGE 03</span>
              <h3 className="text-xl font-bold text-white mt-1">Sub-Pixel Trimap Alpha Matting</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Rather than binary hard cutouts, an exact continuous 8-bit alpha matte is computed. This preserves translucent elements (glassware, bridal veils, flying hairs) so they naturally blend against any background you choose.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-pink-600/30 shrink-0 order-1 md:order-2">
              <Sparkles className="w-7 h-7 text-pink-400" />
            </div>
            <div className="flex-1 order-3 hidden md:block" />
          </div>

          {/* Step 4 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 order-3 md:order-1 hidden md:block" />
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border-2 border-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xl shadow-emerald-600/30 shrink-0 order-1 md:order-2">
              <Download className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="flex-1 order-2 md:order-3">
              <span className="text-xs font-bold text-emerald-400 font-mono">STAGE 04</span>
              <h3 className="text-xl font-bold text-white mt-1">Interactive Studio & Multi-Format Export</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Download your transparent PNG asset directly, or load it into our integrated Photo Studio to apply new gradients, custom backdrop photography, depth-of-field blur, or commercial e-commerce pure-white padding.
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('remove-bg')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2"
          >
            <span>Try It With Your Image</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
