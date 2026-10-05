import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Layers, 
  Sliders, 
  Code2, 
  ShieldCheck, 
  Image as ImageIcon, 
  Cpu, 
  Palette, 
  FolderSync, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State of the Art Neural Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Pixel-Perfect Accuracy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Learn why top e-commerce platforms, graphic designers, and tech companies choose OneClickBG over legacy masking software.
          </p>
        </div>

        {/* Feature 1: Sub-pixel Hair Matting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Sub-Pixel Hair & Fiber Edge Matting
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Traditional thresholding algorithms chop fine wispy hairs or leave ugly colored fringing around subjects. OneClickBG computes an individual alpha transparency channel for each boundary pixel, smoothly blending fine strands with any new background without halos.
            </p>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Zero green/blue screen chroma halos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Animal fur & delicate feather preservation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Translucent fabrics and lace transparency</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-2xl space-y-4">
            <div className="aspect-video rounded-2xl overflow-hidden bg-checkerboard flex items-center justify-center relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Hair Cutout Sample"
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-neutral-950/80 text-[11px] font-mono text-indigo-300 border border-neutral-700">
                Strand Resolution: 0.18px tolerance
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: High Throughput & Developer API */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-2xl font-mono text-xs text-neutral-300 space-y-3">
            <div className="flex items-center justify-between text-neutral-500 pb-2 border-b border-neutral-800">
              <span>curl -X POST /api/images/remove-background</span>
              <span className="text-emerald-400">200 OK (1.2s)</span>
            </div>
            <pre className="text-indigo-300 overflow-x-auto">
{`{
  "status": "completed",
  "processingTimeMs": 1180,
  "dimensions": { "width": 3840, "height": 2160 },
  "confidenceScore": 0.9984,
  "alphaChannels": 4,
  "outputUrl": "https://cdn.oneclickbg.com/render/7a9b...png"
}`}
            </pre>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Built for High-Throughput Automation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Integrate background removal straight into your content ingestion pipeline. Whether processing 50 product photos or 500,000 marketplace listings, our auto-scaling serverless GPU architecture handles sudden traffic spikes with 99.9% uptime.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('api')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <span>Explore Developer Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: Integrated Photo Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Instant Studio Backdrops & Lighting Control
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Don't just remove the background—transform the entire setting. Place subjects into modern architectural interiors, outdoor locations, or solid brand pantone colors. Adjust bokeh blur to simulate DSLR f/1.8 lens depth of field instantly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('editor')}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>Launch Studio Editor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-2xl space-y-4">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-900 to-slate-900 flex items-center justify-center relative p-4">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
                alt="Product Sample"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-neutral-950/80 text-[11px] text-pink-400 font-semibold border border-neutral-700">
                Custom Gradient Preset
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
