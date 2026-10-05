import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  Palette, 
  Image as ImageIcon, 
  Sparkles, 
  Sliders, 
  Eye, 
  ArrowLeftRight, 
  Check, 
  Upload, 
  SunMedium, 
  Contrast, 
  Droplet,
  Move,
  FileImage,
  ChevronRight
} from 'lucide-react';
import { BACKGROUND_PRESETS, downloadFile, loadImage } from '../utils/imageProcessor';
import { EditorSettings } from '../types';

interface EditorPageProps {
  initialImage?: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  } | null;
  onNavigate: (page: string) => void;
}

const DEFAULT_SETTINGS: EditorSettings = {
  backgroundType: 'transparent',
  backgroundColor: '#ffffff',
  backgroundGradient: BACKGROUND_PRESETS.gradients[0],
  backgroundImageUrl: '',
  blurAmount: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  zoom: 1,
  panX: 0,
  panY: 0,
  featherEdges: 0,
};

export const EditorPage: React.FC<EditorPageProps> = ({ initialImage, onNavigate }) => {
  // If no image passed, use sneaker default sample
  const originalSrc = initialImage?.originalUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85';
  const processedSrc = initialImage?.processedUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85';
  const filename = initialImage?.filename || 'cutout-image.png';

  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<EditorSettings[]>([DEFAULT_SETTINGS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<'background' | 'adjust' | 'export'>('background');
  const [viewMode, setViewMode] = useState<'cutout' | 'split' | 'original'>('cutout');
  const [splitPosition, setSplitPosition] = useState(50);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [exportResolution, setExportResolution] = useState<'standard' | 'hd' | '4k'>('hd');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Push history on change
  const applySettings = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updated);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return updated;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setSettings(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setSettings(history[nextIdx]);
    }
  };

  const handleReset = () => {
    applySettings(DEFAULT_SETTINGS);
  };

  // Render Canvas composite
  const renderComposite = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const fgImg = await loadImage(processedSrc);
      const bgImg = settings.backgroundImageUrl ? await loadImage(settings.backgroundImageUrl).catch(() => null) : null;

      const w = fgImg.naturalWidth || 800;
      const h = fgImg.naturalHeight || 600;

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // Render background if not transparent
      if (settings.backgroundType === 'color') {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      } else if (settings.backgroundType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#667eea');
        grad.addColorStop(1, '#764ba2');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (settings.backgroundType === 'image' && bgImg) {
        ctx.save();
        if (settings.blurAmount > 0) {
          ctx.filter = `blur(${settings.blurAmount}px)`;
        }
        // Aspect ratio cover
        const bgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        const targetRatio = w / h;
        let dw = w;
        let dh = h;
        let dx = 0;
        let dy = 0;
        if (bgRatio > targetRatio) {
          dw = h * bgRatio;
          dx = (w - dw) / 2;
        } else {
          dh = w / bgRatio;
          dy = (h - dh) / 2;
        }
        ctx.drawImage(bgImg, dx, dy, dw, dh);
        ctx.restore();
      }

      // Render foreground cutout with filter adjustments
      ctx.save();
      const filterParts = [];
      if (settings.brightness !== 100) filterParts.push(`brightness(${settings.brightness}%)`);
      if (settings.contrast !== 100) filterParts.push(`contrast(${settings.contrast}%)`);
      if (settings.saturation !== 100) filterParts.push(`saturate(${settings.saturation}%)`);
      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(' ');
      }

      ctx.drawImage(fgImg, 0, 0, w, h);
      ctx.restore();

    } catch (err) {
      console.warn('Canvas render notice:', err);
    }
  }, [processedSrc, settings]);

  useEffect(() => {
    renderComposite();
  }, [renderComposite]);

  // Export & Download
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let mime = 'image/png';
      let ext = 'png';
      if (exportFormat === 'jpg') {
        mime = 'image/jpeg';
        ext = 'jpg';
      } else if (exportFormat === 'webp') {
        mime = 'image/webp';
        ext = 'webp';
      }

      const dataUrl = canvas.toDataURL(mime, 0.95);
      const downloadName = filename.replace(/\.[^/.]+$/, '') + `-oneclickbg.${ext}`;
      downloadFile(dataUrl, downloadName);

      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 3500);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCustomBgUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      applySettings({
        backgroundType: 'image',
        backgroundImageUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-white min-h-[calc(100vh-4rem)]">
      
      {/* Top Workspace Toolbar */}
      <div className="h-14 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
        
        {/* Left: Title & File metadata */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('remove-bg')}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
          >
            ← Back
          </button>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-neutral-200 truncate max-w-[180px] sm:max-w-xs">
              {filename}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
              Background Removed
            </span>
          </div>
        </div>

        {/* Center: View Modes & Zoom Controls */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setViewMode('cutout')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'cutout' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Result
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              viewMode === 'split' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Before / After
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              viewMode === 'original' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Original
          </button>
        </div>

        {/* Right: History & Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Reset to default cutout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>

      </div>

      {/* Main Studio Body: Canvas Center + Sidebar Controls */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Main Canvas Viewport Area */}
        <div 
          className="flex-1 bg-neutral-950 relative flex items-center justify-center p-6 overflow-hidden select-none"
          onMouseDown={(e) => {
            setIsPanning(true);
            setPanStart({ x: e.clientX - settings.panX, y: e.clientY - settings.panY });
          }}
          onMouseMove={(e) => {
            if (!isPanning) return;
            setSettings(prev => ({
              ...prev,
              panX: e.clientX - panStart.x,
              panY: e.clientY - panStart.y,
            }));
          }}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => setIsPanning(false)}
        >
          
          {/* Zoom floating controls bottom left */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl border border-neutral-800 shadow-xl">
            <button
              onClick={() => setSettings(prev => ({ ...prev, zoom: Math.max(0.25, prev.zoom - 0.25) }))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium px-2 text-neutral-300">
              {Math.round(settings.zoom * 100)}%
            </span>
            <button
              onClick={() => setSettings(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.25) }))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-neutral-800 mx-1" />
            <button
              onClick={() => setSettings(prev => ({ ...prev, zoom: 1, panX: 0, panY: 0 }))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              title="Fit to Screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Success Download Toast */}
          {downloadSuccessToast && (
            <div className="absolute top-6 z-30 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Image downloaded successfully!</span>
            </div>
          )}

          {/* Canvas Wrapper with Zoom & Pan */}
          <div
            className="relative transition-transform duration-75 cursor-grab active:cursor-grabbing max-h-[85vh] max-w-[85vw]"
            style={{
              transform: `scale(${settings.zoom}) translate(${settings.panX / settings.zoom}px, ${settings.panY / settings.zoom}px)`,
            }}
          >
            {/* Checkerboard Backdrop Frame */}
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 bg-checkerboard">
              
              {viewMode === 'cutout' && (
                <canvas
                  ref={canvasRef}
                  className="max-h-[70vh] max-w-[70vw] object-contain block"
                />
              )}

              {viewMode === 'original' && (
                <img
                  src={originalSrc}
                  alt="Original"
                  className="max-h-[70vh] max-w-[70vw] object-contain block"
                />
              )}

              {viewMode === 'split' && (
                <div className="relative max-h-[70vh] max-w-[70vw] overflow-hidden select-none">
                  {/* Canvas Output */}
                  <canvas
                    ref={canvasRef}
                    className="max-h-[70vh] max-w-[70vw] object-contain block"
                  />
                  {/* Original clipped overlay */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${splitPosition}%` }}
                  >
                    <img
                      src={originalSrc}
                      alt="Original"
                      className="max-h-[70vh] max-w-[70vw] object-contain block"
                    />
                  </div>
                  {/* Split slider drag handle */}
                  <div
                    className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${splitPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg border border-neutral-300">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Studio Inspector Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-neutral-800 bg-neutral-900/90 backdrop-blur-md flex flex-col z-10">
          
          {/* Sidebar Tabs */}
          <div className="flex items-center border-b border-neutral-800 bg-neutral-950/60 p-1">
            <button
              onClick={() => setActiveTab('background')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'background' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Background
            </button>
            <button
              onClick={() => setActiveTab('adjust')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'adjust' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Adjustments
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'export' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>

          {/* Inspector Content Panes */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* TAB 1: BACKGROUND REPLACEMENT */}
            {activeTab === 'background' && (
              <div className="space-y-6">
                
                {/* Background Type Selector Pills */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
                    Background Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => applySettings({ backgroundType: 'transparent' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        settings.backgroundType === 'transparent'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-checkerboard border border-neutral-700" />
                      <span>Transparent</span>
                    </button>

                    <button
                      onClick={() => applySettings({ backgroundType: 'color' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        settings.backgroundType === 'color'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-white border border-neutral-700" />
                      <span>Solid</span>
                    </button>

                    <button
                      onClick={() => applySettings({ backgroundType: 'gradient' })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        settings.backgroundType === 'gradient'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 border border-neutral-700" />
                      <span>Gradient</span>
                    </button>

                    <button
                      onClick={() => applySettings({ 
                        backgroundType: 'image',
                        backgroundImageUrl: settings.backgroundImageUrl || BACKGROUND_PRESETS.images[0].url
                      })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        settings.backgroundType === 'image'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-500/10'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-6 h-6 text-indigo-400" />
                      <span>Photo</span>
                    </button>
                  </div>
                </div>

                {/* Sub-option: Solid Colors */}
                {settings.backgroundType === 'color' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-300 font-medium">Color Palette</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-neutral-400">{settings.backgroundColor}</span>
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => applySettings({ backgroundColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {BACKGROUND_PRESETS.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => applySettings({ backgroundColor: c })}
                          style={{ backgroundColor: c }}
                          className={`h-8 rounded-lg border transition-transform hover:scale-110 ${
                            settings.backgroundColor === c ? 'ring-2 ring-indigo-400 border-white' : 'border-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-option: Gradients */}
                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-3">
                    <span className="text-xs text-neutral-300 font-medium block">Studio Gradients</span>
                    <div className="grid grid-cols-4 gap-2">
                      {BACKGROUND_PRESETS.gradients.map((g, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySettings({ backgroundGradient: g })}
                          style={{ background: g }}
                          className="h-10 rounded-lg border border-neutral-700 hover:scale-105 transition-transform"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-option: AI / Photo Scenes & Custom Upload */}
                {settings.backgroundType === 'image' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-300 font-medium">Studio Scenes</span>
                      <button
                        onClick={() => customBgInputRef.current?.click()}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom</span>
                      </button>
                      <input
                        ref={customBgInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCustomBgUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {BACKGROUND_PRESETS.images.map((img, idx) => {
                        const isSelected = settings.backgroundImageUrl === img.url;
                        return (
                          <button
                            key={idx}
                            onClick={() => applySettings({ backgroundImageUrl: img.url })}
                            className={`group relative rounded-xl overflow-hidden border text-left aspect-video transition-all ${
                              isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-semibold text-white truncate">
                                {img.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Background Blur Slider */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-neutral-300 flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-indigo-400" />
                          Background Blur (Bokeh)
                        </span>
                        <span className="font-mono text-neutral-400">{settings.blurAmount}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={settings.blurAmount}
                        onChange={(e) => applySettings({ blurAmount: Number(e.target.value) })}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: ADJUSTMENTS */}
            {activeTab === 'adjust' && (
              <div className="space-y-5">
                
                {/* Brightness */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                      Brightness
                    </span>
                    <span className="font-mono text-neutral-400">{settings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.brightness}
                    onChange={(e) => applySettings({ brightness: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <Contrast className="w-3.5 h-3.5 text-indigo-400" />
                      Contrast
                    </span>
                    <span className="font-mono text-neutral-400">{settings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.contrast}
                    onChange={(e) => applySettings({ contrast: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-300 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-pink-400" />
                      Saturation
                    </span>
                    <span className="font-mono text-neutral-400">{settings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.saturation}
                    onChange={(e) => applySettings({ saturation: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => applySettings({ brightness: 100, contrast: 100, saturation: 100 })}
                    className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                  >
                    Reset Color Adjustments
                  </button>
                </div>

              </div>
            )}

            {/* TAB 3: EXPORT CONFIGURATION */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                
                {/* Format selection */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
                    File Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setExportFormat('png')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        exportFormat === 'png'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div className="text-xs font-bold">PNG</div>
                      <div className="text-[10px] text-neutral-500">Transparent</div>
                    </button>

                    <button
                      onClick={() => setExportFormat('jpg')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        exportFormat === 'jpg'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div className="text-xs font-bold">JPG</div>
                      <div className="text-[10px] text-neutral-500">Solid / Photo</div>
                    </button>

                    <button
                      onClick={() => setExportFormat('webp')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        exportFormat === 'webp'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div className="text-xs font-bold">WebP</div>
                      <div className="text-[10px] text-neutral-500">Compressed</div>
                    </button>
                  </div>
                </div>

                {/* Resolution selection */}
                <div>
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
                    Resolution Quality
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setExportResolution('standard')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        exportResolution === 'standard'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Standard Resolution (1080p)</div>
                        <div className="text-[10px] text-neutral-500">Ideal for web and mobile browsing</div>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">1x</span>
                    </button>

                    <button
                      onClick={() => setExportResolution('hd')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        exportResolution === 'hd'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-indigo-300">HD High Resolution (2K)</div>
                        <div className="text-[10px] text-neutral-400">Crisp for catalog and print media</div>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/80 px-2 py-0.5 rounded">
                        PRO
                      </span>
                    </button>

                    <button
                      onClick={() => setExportResolution('4k')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        exportResolution === '4k'
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Ultra HD 4K (4096px)</div>
                        <div className="text-[10px] text-neutral-500">Maximum uncompressed master file</div>
                      </div>
                      <span className="text-[10px] text-purple-400 font-bold bg-purple-950/80 px-2 py-0.5 rounded">
                        PRO+
                      </span>
                    </button>
                  </div>
                </div>

                {/* Final Download Button */}
                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Final {exportFormat.toUpperCase()}</span>
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center mt-2">
                    Commercial license included with Pro and Business subscriptions.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
