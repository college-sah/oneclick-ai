import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  CreditCard, 
  HardDrive, 
  Layers, 
  Sliders, 
  Download, 
  Trash2, 
  UploadCloud, 
  ArrowRight, 
  Plus, 
  Clock, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ImageItem } from '../types';
import { downloadFile, formatBytes } from '../utils/imageProcessor';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectImageForEditor: (img: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigate, 
  onSelectImageForEditor 
}) => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    loadUserImages();
  }, []);

  const loadUserImages = async () => {
    try {
      setLoading(true);
      const res = await api.getImages();
      setImages(res.images);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this processed image?')) return;
    try {
      await api.deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleOpenInEditor = (img: ImageItem) => {
    onSelectImageForEditor({
      originalUrl: img.originalUrl,
      processedUrl: img.processedUrl,
      filename: img.filename,
      width: img.width,
      height: img.height,
    });
    onNavigate('editor');
  };

  const handleDownload = (img: ImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(img.processedUrl, img.filename);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Creator Dashboard
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Welcome back, <span className="text-neutral-200 font-semibold">{user?.name}</span>. Here is your processing activity and credit balance.
            </p>
          </div>

          <button
            onClick={() => onNavigate('remove-bg')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Background Removal</span>
          </button>
        </div>

        {/* 4 Overview Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Images Processed */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Total Images</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {images.length + (user?.totalCreditsUsed || 0)}
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user?.totalCreditsUsed || 0} removed this cycle</span>
            </div>
          </div>

          {/* Card 2: Remaining Credits */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Remaining Credits</span>
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {user?.credits || 0}
            </div>
            <div className="text-[11px] text-indigo-400 hover:underline cursor-pointer" onClick={() => onNavigate('billing')}>
              Top up or upgrade plan →
            </div>
          </div>

          {/* Card 3: Current Plan */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Current Plan</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white capitalize font-mono">
              {user?.plan || 'Free'}
            </div>
            <div className="text-[11px] text-neutral-400">
              {user?.plan === 'pro' ? '4K Ultra HD Export Active' : 'Standard 1080p Export'}
            </div>
          </div>

          {/* Card 4: Cloud Storage */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400">Storage Used</span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatBytes(user?.storageUsedBytes || 42 * 1024 * 1024)}
            </div>
            <div className="text-[11px] text-neutral-400">
              Auto-pruning active (24h retention)
            </div>
          </div>

        </div>

        {/* Quick Upload Action Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/40 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Need another cutout?</h3>
              <p className="text-xs text-neutral-400">
                Drag a new file or test with high-resolution sample models in the studio.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('remove-bg')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Upload Image</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Processed Images Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Recent Processed Images
            </h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-neutral-500">
              Loading recent images...
            </div>
          ) : images.length === 0 ? (
            <div className="py-16 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-center space-y-3">
              <Layers className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No images processed yet.</p>
              <button
                onClick={() => onNavigate('remove-bg')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Remove Your First Background
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => handleOpenInEditor(img)}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between"
                >
                  {/* Thumbnail with checkerboard background */}
                  <div className="aspect-[4/3] bg-checkerboard flex items-center justify-center p-3 relative overflow-hidden">
                    <img
                      src={img.processedUrl}
                      alt={img.filename}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-mono text-emerald-400 border border-neutral-700">
                      PNG
                    </div>
                  </div>

                  {/* Metadata and Quick Actions */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {img.filename}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {img.width}×{img.height}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenInEditor(img); }}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDownload(img, e)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(img.id, e)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                          title="Delete image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
