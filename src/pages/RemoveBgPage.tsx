import React, { useState } from 'react';
import { UploadDropzone } from '../components/UploadDropzone';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { 
  Sparkles, 
  Download, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers,
  RotateCcw
} from 'lucide-react';
import { downloadFile } from '../utils/imageProcessor';

interface RemoveBgPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectImageForEditor: (img: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  }) => void;
}

export const RemoveBgPage: React.FC<RemoveBgPageProps> = ({ 
  onNavigate, 
  onSelectImageForEditor 
}) => {
  const [processedResult, setProcessedResult] = useState<{
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
    processingTimeMs: number;
  } | null>(null);

  const handleProcessComplete = (result: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
    processingTimeMs: number;
  }) => {
    setProcessedResult(result);
  };

  const handleOpenEditor = () => {
    if (processedResult) {
      onSelectImageForEditor(processedResult);
      onNavigate('editor');
    }
  };

  const handleQuickDownload = () => {
    if (processedResult) {
      downloadFile(processedResult.processedUrl, processedResult.filename);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Neural Matting Engine v3.2</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Remove Backgrounds <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Instantly</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Upload your portrait, product photo, animal, or graphic. Our AI isolates complex hair, jewelry, and edges in 2 seconds with clean transparency.
          </p>
        </div>

        {/* Upload or Result Section */}
        {!processedResult ? (
          <div className="flex flex-col items-center">
            <UploadDropzone
              onProcessComplete={handleProcessComplete}
              maxFileSizeMb={25}
            />

            {/* Quick feature badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
                <Zap className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">Sub-2s Processing</div>
                <div className="text-[11px] text-neutral-400">Instant AI GPU inference</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
                <Sparkles className="w-5 h-5 text-indigo-400 mx-auto" />
                <div className="text-xs font-bold text-white">Sub-Pixel Hair Detail</div>
                <div className="text-[11px] text-neutral-400">Micro-strand edge feathering</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">GDPR & SOC2 Privacy</div>
                <div className="text-[11px] text-neutral-400">Files automatically erased</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
                <Layers className="w-5 h-5 text-purple-400 mx-auto" />
                <div className="text-xs font-bold text-white">Full HD & 4K Output</div>
                <div className="text-[11px] text-neutral-400">Zero compression loss</div>
              </div>
            </div>
          </div>
        ) : (
          /* Processed Result View Card */
          <div className="max-w-4xl mx-auto rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8 animate-in fade-in">
            
            {/* Success Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Background Removed Successfully!</h3>
                  <p className="text-xs text-neutral-400">
                    Processed in {(processedResult.processingTimeMs / 1000).toFixed(2)}s • {processedResult.width} × {processedResult.height}px
                  </p>
                </div>
              </div>

              <button
                onClick={() => setProcessedResult(null)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Another Image</span>
              </button>
            </div>

            {/* Split Comparison or Result Display */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 h-[380px] sm:h-[460px] bg-checkerboard flex items-center justify-center p-6 shadow-inner">
              <img
                src={processedResult.processedUrl}
                alt="Removed Background Result"
                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              />
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-xs font-semibold text-emerald-400">
                Transparent PNG
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-neutral-400">
                Want to change background color, add studio scenes, or adjust lighting?
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleQuickDownload}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={handleOpenEditor}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Open in Photo Studio Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Live Demonstration Showcase below */}
        <div className="pt-12 border-t border-neutral-900 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Try Before / After Comparison Samples
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Drag the interactive slider to see how OneClickBG handles complex hair, reflections, and products.
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

      </div>
    </div>
  );
};
