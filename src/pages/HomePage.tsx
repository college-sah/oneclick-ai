import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Camera,
  Car,
  FileCheck2,
  Check,
  Star
} from 'lucide-react';
import { UploadDropzone } from '../components/UploadDropzone';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectImageForEditor: (img: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectImageForEditor }) => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does OneClickBG remove image backgrounds so accurately?',
      a: 'OneClickBG uses a proprietary neural network trained on millions of diverse real-world images. It performs semantic subject segmentation combined with sub-pixel alpha matting to detect complex edges like fine hair strands, transparent glass, and intricate jewelry shadows with millimeter precision.',
    },
    {
      q: 'Is there a free plan available?',
      a: 'Yes! Every new account receives free credits monthly with full access to standard 1080p resolution and our built-in photo studio editor. No credit card is required to start.',
    },
    {
      q: 'What image formats and file sizes are supported?',
      a: 'We support JPG, JPEG, PNG, and WebP images up to 25MB per image. Pro and Business users can process images up to 4K and 8K resolutions.',
    },
    {
      q: 'Can I use processed images commercially?',
      a: 'Yes! All images processed under our Pro and Business plans include a full commercial license for advertising, e-commerce storefronts, print, and digital media.',
    },
    {
      q: 'Does OneClickBG provide a developer REST API?',
      a: 'Yes. We offer a high-performance REST API with sub-2 second response times, client libraries for Python, Node.js, and cURL, and webhook notifications for bulk automated processing.',
    },
    {
      q: 'Are my uploaded images safe and private?',
      a: 'Absolutely. We comply with GDPR and SOC2 standards. Your uploaded and processed images are automatically erased from temporary cache after 24 hours, and are never used to train public models without consent.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      
      {/* -------------------------------------------------------------
          1. HERO SECTION
          ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Gradient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-semibold text-neutral-300 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Next-Gen AI Matting v3.2 is Live</span>
            <span className="text-neutral-500">•</span>
            <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => onNavigate('features')}>
              Explore Model Specs →
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Remove Image Backgrounds in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              One Click
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Create clean, professional images instantly with AI-powered background removal. Perfect for e-commerce, portraits, product catalogs, and creative design.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('remove-bg')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Remove Background</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-sm border border-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Trust Ratings */}
          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
              <span className="ml-1 text-white font-bold">4.9/5</span>
            </div>
            <span>•</span>
            <span>Over 10 Million Backgrounds Removed</span>
            <span>•</span>
            <span className="hidden sm:inline">100% Free to Try</span>
          </div>

        </div>

        {/* -------------------------------------------------------------
            2. UPLOAD DROPZONE DIRECTLY ACCESSIBLE ON HERO
            ------------------------------------------------------------- */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16 relative z-10">
          <UploadDropzone
            onProcessComplete={(result) => {
              onSelectImageForEditor(result);
              onNavigate('editor');
            }}
            maxFileSizeMb={25}
          />
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. INTERACTIVE BEFORE / AFTER DEMONSTRATION
          ------------------------------------------------------------- */}
      <section className="py-20 bg-neutral-900/40 border-y border-neutral-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Quality Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flawless Precision on Challenging Edges
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Our AI engine distinguishes fine curly hair, semitransparent fabrics, glass refractions, and complex product geometry.
            </p>
          </div>

          <BeforeAfterSlider
            onSelectForEdit={(sample) => {
              onSelectImageForEditor({
                originalUrl: sample.originalUrl,
                processedUrl: sample.resultUrl,
                filename: `${sample.id}.png`,
                width: 1200,
                height: 900,
              });
              onNavigate('editor');
            }}
          />
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. HOW IT WORKS
          ------------------------------------------------------------- */}
      <section id="how-it-works-section" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Simple 3-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How OneClickBG Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              No manual lassoing, no complex masking brush paths. Let neural vision do the heavy lifting in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-extrabold font-mono text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Upload Any Image</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Drag and drop your file, paste from clipboard, or browse from your desktop. We support JPG, PNG, and WebP up to 25MB.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-indigo-400">
                Instant format detection • No setup needed
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-indigo-500/40 hover:border-indigo-400 transition-all space-y-4 relative group shadow-xl shadow-indigo-600/5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold font-mono text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white">AI Automatically Cuts Out</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Our neural alpha-matting engine separates foreground subjects, detects fine strands, and renders crystal clear transparent background in 2 seconds.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-purple-400">
                Sub-pixel edge detection • Saliency mapping
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 font-extrabold font-mono text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Edit, Refine & Download</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Switch backgrounds with solid studio palettes, modern gradient backdrops, or photographic scenes. Download in transparent PNG, JPG, or WebP.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-400">
                4K Ultra HD Export • Commercial license
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. FEATURES GRID
          ------------------------------------------------------------- */}
      <section className="py-20 bg-neutral-900/30 border-y border-neutral-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Speed, Quality, and Automation
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Everything modern teams need to scale catalog imagery, social creative, and automated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Under 2-Second Latency</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Optimized serverless GPU inference clusters deliver cutouts faster than traditional graphic design software.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Sub-Pixel Hair & Fur Detailing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Preserve delicate hair strands, furry textures, transparent veils, and reflective surfaces without harsh green-screen artifacts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Integrated Photo Studio</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Replace backgrounds with custom colors, blur depth of field (bokeh), adjust contrast, brightness, and export in custom dimensions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Developer REST API</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Integrate background removal directly into your Shopify store, mobile app, ERP, or internal media asset management pipeline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Batch & Bulk Processing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Process entire folders of photos simultaneously. Export transparent assets in seconds with synchronized layer naming.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Enterprise Privacy & Security</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Strict no-data-sharing policy. Files are processed in memory and permanently deleted after completion. SOC2 Type II verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. USE CASES
          ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Tailored For Every Industry</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Who Uses OneClickBG?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              From solo marketplace merchants to enterprise photography studios, OneClickBG powers professional workflows worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">E-Commerce & Amazon</h3>
              <p className="text-xs text-neutral-400">
                Meet Amazon, eBay, and Google Shopping pure white background standards effortlessly. Increase conversions by 38%.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Portraits & Headshots</h3>
              <p className="text-xs text-neutral-400">
                Replace cluttered office or home backgrounds with sleek executive studio backdrops for LinkedIn and team directories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Photographers & Creators</h3>
              <p className="text-xs text-neutral-400">
                Save hours of tedious pen tool masking in Photoshop. Cut out animal fur, weddings, and fashion shoots with 1 click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automotive Dealerships</h3>
              <p className="text-xs text-neutral-400">
                Transform ordinary parking lot car photos into luxury dealership showroom presentations with custom tarmac backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          7. PRICING SECTION
          ------------------------------------------------------------- */}
      <section className="py-24 bg-neutral-900/40 border-y border-neutral-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Simple, Predictable Plans
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Start with free credits, upgrade as your image volume scales. Cancel anytime.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Free Starter</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-neutral-400">/ forever</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Perfect for casual background removal and personal hobby projects.
                </p>

                <div className="h-px bg-neutral-800" />

                <ul className="space-y-3 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 free background removals / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Standard resolution export (up to 1080p)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic photo studio web editor</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personal non-commercial use</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('remove-bg')}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="p-8 rounded-3xl bg-neutral-900 border-2 border-indigo-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pro Creator</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === 'annual' ? '$15' : '$19'}
                  </span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For creators, online sellers, and photographers needing high-res volume.
                </p>

                <div className="h-px bg-neutral-800" />

                <ul className="space-y-3 text-xs text-neutral-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-white">300 HD removals / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>4K Ultra HD Export resolution</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Advanced background editor & AI scenes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Full Commercial License</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>REST API Access (500 calls/mo)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Priority GPU processing (&lt; 1.5s)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('billing')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Business & Team Tier */}
            <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Business & Team</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {billingCycle === 'annual' ? '$39' : '$49'}
                  </span>
                  <span className="text-xs text-neutral-400">/ month</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For brands, marketing agencies, and high-volume automated pipelines.
                </p>

                <div className="h-px bg-neutral-800" />

                <ul className="space-y-3 text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-semibold text-white">1,200 background removals / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>8K Resolution & RAW camera support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Unlimited bulk batch folder processing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>5,000 REST API requests / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>5 Team Seats with shared credit pool</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>99.9% Uptime SLA & Dedicated Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('billing')}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
              >
                Choose Business
              </button>
            </div>

          </div>

          <div className="text-center text-xs text-neutral-500">
            Need custom high-volume or on-premises deployment?{' '}
            <button onClick={() => onNavigate('contact')} className="text-indigo-400 underline">
              Talk to our Enterprise team
            </button>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          8. FAQ ACCORDION
          ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Questions & Answers</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Everything you need to know about the product, licensing, and technology.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-850 transition-colors"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          9. BOTTOM CALL TO ACTION
          ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-neutral-950 border border-indigo-500/40 p-10 sm:p-16 text-center space-y-6 relative shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center mx-auto text-indigo-300 shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Start Removing Backgrounds in Seconds
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of e-commerce stores, designers, and creators who rely on OneClickBG for crystal clear image assets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('remove-bg')}
              className="px-8 py-3.5 rounded-xl bg-white text-neutral-950 font-extrabold text-sm hover:bg-neutral-100 shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Upload Image Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-6 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-semibold text-sm border border-neutral-700 transition-colors"
            >
              View All Plans
            </button>
          </div>

          <p className="text-[11px] text-neutral-400">
            No credit card required • 5 Free Credits immediately available
          </p>
        </div>
      </section>

    </div>
  );
};
