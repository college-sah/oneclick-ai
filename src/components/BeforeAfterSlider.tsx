import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SAMPLE_IMAGES, SampleImage } from '../utils/imageProcessor';
import { Sparkles, ArrowLeftRight, Check, ShieldCheck } from 'lucide-react';

interface BeforeAfterSliderProps {
  initialSampleId?: string;
  onSelectForEdit?: (sample: SampleImage) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  initialSampleId = 'sample_sneaker',
  onSelectForEdit 
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleImage>(
    SAMPLE_IMAGES.find(s => s.id === initialSampleId) || SAMPLE_IMAGES[0]
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [bgStyle, setBgStyle] = useState<'checkerboard' | 'white' | 'color' | 'dark'>('checkerboard');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {SAMPLE_IMAGES.map((sample) => {
          const isSelected = selectedSample.id === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => setSelectedSample(sample)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-neutral-800 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-neutral-800'
              }`}
            >
              <span>{sample.category}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Split Slider Card */}
      <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/80 shadow-2xl backdrop-blur-sm">
        
        {/* Top Control Bar inside slider card */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80 bg-neutral-950/60 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-neutral-300 font-medium">
              {selectedSample.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-500 hidden sm:inline">Preview background:</span>
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setBgStyle('checkerboard')}
                title="Transparent checkerboard"
                className={`w-5 h-5 rounded bg-checkerboard border ${bgStyle === 'checkerboard' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-neutral-700'}`}
              />
              <button
                onClick={() => setBgStyle('white')}
                title="Clean white background"
                className={`w-5 h-5 rounded bg-white border ${bgStyle === 'white' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-neutral-700'}`}
              />
              <button
                onClick={() => setBgStyle('color')}
                title="Brand gradient background"
                className={`w-5 h-5 rounded bg-gradient-to-r from-indigo-500 to-purple-600 border ${bgStyle === 'color' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-neutral-700'}`}
              />
              <button
                onClick={() => setBgStyle('dark')}
                title="Deep dark background"
                className={`w-5 h-5 rounded bg-neutral-950 border ${bgStyle === 'dark' ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-neutral-700'}`}
              />
            </div>
          </div>
        </div>

        {/* Viewport Container */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] select-none cursor-ew-resize overflow-hidden"
        >
          {/* Background Layer according to chosen bgStyle */}
          <div 
            className={`absolute inset-0 ${
              bgStyle === 'checkerboard' ? 'bg-checkerboard' :
              bgStyle === 'white' ? 'bg-white' :
              bgStyle === 'color' ? 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900' :
              'bg-neutral-950'
            }`}
          />

          {/* After Image (Background Removed Cutout) */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <img
              src={selectedSample.resultUrl}
              alt="Removed Background"
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl pointer-events-none"
            />
            {/* Tag */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Background Removed</span>
            </div>
          </div>

          {/* Before Image (Original with Background) - clipped by sliderPosition */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full bg-neutral-950">
              <div 
                className="absolute inset-0 flex items-center justify-center p-6"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              >
                <img
                  src={selectedSample.originalUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              </div>

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-300 text-xs font-semibold shadow-lg">
                Original Image
              </div>
            </div>
          </div>

          {/* Split Slider Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            
            {/* Center Handle Knob */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-2xl border-2 border-indigo-600 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-4 h-4 text-indigo-700" />
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-neutral-950/90 border-t border-neutral-800 gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>AI Neural Segmentation v3.2 • Precise sub-millimeter edges & strands</span>
          </div>

          {onSelectForEdit && (
            <button
              onClick={() => onSelectForEdit(selectedSample)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 flex items-center gap-1.5 transition-all"
            >
              <span>Open in Full Studio Editor</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          )}
        </div>

      </div>

      <p className="mt-3 text-xs text-neutral-500 text-center">
        Drag slider left and right to inspect precision hair cutout, semi-transparent glass, and clean edge feathering.
      </p>
    </div>
  );
};
