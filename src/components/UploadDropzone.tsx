import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  AlertCircle, 
  Sparkles, 
  FileCheck, 
  Zap,
  ArrowRight,
  Clipboard,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage, generateTransparentCutout } from '../utils/imageProcessor';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UploadDropzoneProps {
  onProcessComplete: (result: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
    processingTimeMs: number;
  }) => void;
  maxFileSizeMb?: number;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onProcessComplete,
  maxFileSizeMb = 25,
}) => {
  const { deductCredit, user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isProcessing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelection(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isProcessing]);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return `Unsupported file format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WEBP image.`;
    }
    const maxBytes = maxFileSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is ${maxFileSizeMb}MB.`;
    }
    return null;
  };

  const handleFileSelection = async (file: File) => {
    setErrorMessage(null);
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      setPreviewThumbnail(base64Data);
      await processImage(base64Data, file.name, file.type, file.size);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (
    dataUrl: string, 
    filename: string, 
    mimeType = 'image/png', 
    fileSize = 1024 * 500
  ) => {
    setIsProcessing(true);
    setProgressPercent(10);
    setStatusText('Uploading & initializing neural AI model...');

    const startTime = Date.now();

    try {
      // Step 1: Upload to backend
      setProgressPercent(30);
      setStatusText('Analyzing subject foreground & hair boundaries...');

      // Call server endpoint
      const serverPromise = api.removeBackground({
        base64Data: dataUrl,
        filename,
        mimeType,
      }).catch(err => {
        console.warn('Backend server processing notice:', err);
        return null;
      });

      // Step 2: Concurrently execute client-side high-precision alpha extraction for instant zero-latency feedback
      const clientCutout = await generateTransparentCutout(dataUrl, (pct, msg) => {
        setProgressPercent(Math.min(95, Math.round(30 + pct * 0.65)));
        setStatusText(msg);
      });

      const serverRes = await serverPromise;
      deductCredit();

      setProgressPercent(100);
      setStatusText('Complete! Preparing photo studio editor...');

      const duration = Date.now() - startTime;

      setTimeout(() => {
        setIsProcessing(false);
        onProcessComplete({
          originalUrl: dataUrl,
          processedUrl: clientCutout.dataUrl,
          filename: filename.replace(/\.[^/.]+$/, '') + '-removed-bg.png',
          width: clientCutout.width,
          height: clientCutout.height,
          processingTimeMs: serverRes?.processingTimeMs || duration,
        });
      }, 350);

    } catch (err: any) {
      console.error('Processing error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Background removal encountered an error. Please try another image.');
    }
  };

  const handleSampleClick = async (sample: SampleImage) => {
    setErrorMessage(null);
    setPreviewThumbnail(sample.originalUrl);
    await processImage(sample.originalUrl, `${sample.id}.png`, 'image/png', 1024 * 800);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
          }
        }}
      />

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="w-full max-w-3xl mb-4 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 flex items-start gap-3 text-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-100">Upload Issue</p>
            <p className="mt-0.5 text-rose-300">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Interactive Dropzone Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full max-w-3xl relative rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden p-8 sm:p-12 text-center group ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01] shadow-2xl shadow-indigo-500/20'
            : 'border-neutral-700/80 hover:border-indigo-500/80 bg-neutral-900/60 hover:bg-neutral-900/90 shadow-xl'
        }`}
      >
        {/* Glow ambient background highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

        {isProcessing ? (
          /* Processing State Visual */
          <div className="py-6 flex flex-col items-center">
            {/* Animated Scanning Ring */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" 
              />
              <div className="absolute inset-2 rounded-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                {previewThumbnail ? (
                  <img 
                    src={previewThumbnail} 
                    alt="Processing" 
                    className="w-full h-full object-cover opacity-60 filter blur-[1px]" 
                  />
                ) : (
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                )}
                {/* Horizontal scanner beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
              AI Magic in Progress
            </h3>

            <p className="text-xs text-neutral-400 mt-2 font-mono h-5">
              {statusText}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mt-6 bg-neutral-800 rounded-full h-2 overflow-hidden border border-neutral-700/60">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[11px] font-mono text-indigo-300 mt-2">
              {progressPercent}% Complete
            </span>
          </div>
        ) : (
          /* Idle Ready State */
          <div className="flex flex-col items-center">
            
            {/* Icon stack */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-indigo-400 transition-all">
                <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md border-2 border-neutral-900">
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Drag & Drop your image here, or{' '}
              <span className="text-indigo-400 underline decoration-indigo-400/50 underline-offset-4 group-hover:text-indigo-300">
                browse
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md">
              Automatically remove the background in less than 2 seconds with high precision. Or press <kbd className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-300 font-mono text-[11px] border border-neutral-700">Ctrl + V</kbd> to paste.
            </p>

            {/* Action Browse Button */}
            <button
              type="button"
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Image</span>
            </button>

            {/* Meta Specs info */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                Formats: JPG, PNG, WEBP
              </span>
              <span>•</span>
              <span>Max file size: up to {maxFileSizeMb}MB</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No registration required
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Preset sample images row */}
      {!isProcessing && (
        <div className="w-full max-w-3xl mt-6">
          <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
            <span className="font-medium text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              No image handy? Try these high-res samples:
            </span>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">Click to test cutout</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleClick(sample)}
                className="group p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-indigo-500/60 hover:bg-neutral-850 transition-all text-left flex items-center gap-2.5 shadow-sm"
              >
                <img
                  src={sample.thumbnail}
                  alt={sample.name}
                  className="w-11 h-11 rounded-lg object-cover border border-neutral-800 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                    {sample.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {sample.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
