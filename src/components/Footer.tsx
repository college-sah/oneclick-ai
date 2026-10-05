import React from 'react';
import { Sparkles, Shield, Cpu, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer group inline-flex"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-600/20">
                <div className="w-full h-full bg-neutral-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                OneClick<span className="text-indigo-400">BG</span>
              </span>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              The professional AI background removal platform for e-commerce, photographers, designers, and developers. Built with neural edge matting and sub-pixel precision.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All AI Engines Operational • 99.98% SLA</span>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              ISO/IEC 27001 Certified • GDPR & SOC-2 Type II Compliant • Auto-cleanup in 24h
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('remove-bg')} className="hover:text-white transition-colors">
                  Remove Background
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('editor')} className="hover:text-white transition-colors">
                  Photo Studio Editor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Features & Precision
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Developers</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('api')} className="hover:text-white transition-colors">
                  REST API Docs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('api')} className="hover:text-white transition-colors">
                  API Key Management
                </button>
              </li>
              <li>
                <span className="text-neutral-500 cursor-not-allowed">
                  Python SDK <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1 py-0.5 rounded ml-1">v2.1</span>
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-not-allowed">
                  Node.js Client
                </span>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-purple-400 hover:text-purple-300 transition-colors">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About OneClickBG
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cookies')} className="hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} OneClickBG (SnapCut AI Inc). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-neutral-300">Privacy</button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-neutral-300">Terms</button>
            <span>•</span>
            <button onClick={() => onNavigate('cookies')} className="hover:text-neutral-300">Cookies</button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-neutral-300">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
