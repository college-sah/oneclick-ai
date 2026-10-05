import React, { useState, useEffect } from 'react';
import { 
  FolderClock, 
  Search, 
  Trash2, 
  Download, 
  Sliders, 
  Sparkles, 
  Filter, 
  ArrowLeftRight, 
  Check, 
  Eye, 
  X,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { ImageItem } from '../types';
import { downloadFile, formatBytes } from '../utils/imageProcessor';

interface HistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectImageForEditor: (img: {
    originalUrl: string;
    processedUrl: string;
    filename: string;
    width: number;
    height: number;
  }) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ 
  onNavigate, 
  onSelectImageForEditor 
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getImages();
      setImages(res.images);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record from processing history?')) return;
    try {
      await api.deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const filteredImages = images.filter(img =>
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FolderClock className="w-7 h-7 text-indigo-400" />
              <span>Processing History</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Review and re-download all your previous transparent background cutouts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content Table or Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-500">
            Loading processing history...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-20 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-center space-y-4">
            <Layers className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400">No matching images found in history.</p>
            <button
              onClick={() => onNavigate('remove-bg')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Upload an Image
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Preview</th>
                    <th className="p-4">Filename</th>
                    <th className="p-4">Dimensions</th>
                    <th className="p-4">File Size</th>
                    <th className="p-4">AI Engine</th>
                    <th className="p-4">Processed Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {filteredImages.map((img) => (
                    <tr 
                      key={img.id}
                      className="hover:bg-neutral-850/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    >
                      {/* Thumbnail */}
                      <td className="p-4 w-20">
                        <div className="w-14 h-12 rounded-lg bg-checkerboard flex items-center justify-center p-1 border border-neutral-800 overflow-hidden">
                          <img
                            src={img.processedUrl}
                            alt={img.filename}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>

                      {/* Filename */}
                      <td className="p-4 font-semibold text-white truncate max-w-xs">
                        {img.filename}
                      </td>

                      {/* Dimensions */}
                      <td className="p-4 text-neutral-300 font-mono">
                        {img.width} × {img.height}
                      </td>

                      {/* Size */}
                      <td className="p-4 text-neutral-400">
                        {formatBytes(img.size)}
                      </td>

                      {/* Engine */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                          {img.provider || 'Neural Matting v3.2'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-neutral-400 text-[11px]">
                        {new Date(img.createdAt).toLocaleDateString()} at{' '}
                        {new Date(img.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            onSelectImageForEditor({
                              originalUrl: img.originalUrl,
                              processedUrl: img.processedUrl,
                              filename: img.filename,
                              width: img.width,
                              height: img.height,
                            });
                            onNavigate('editor');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => downloadFile(img.processedUrl, img.filename)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Details Inspection */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {selectedImage.filename}
                </h3>
              </div>

              {/* Side-by-side or large preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-neutral-400">Original</span>
                  <div className="h-56 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-neutral-800">
                    <img
                      src={selectedImage.originalUrl}
                      alt="Original"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-emerald-400">Background Removed</span>
                  <div className="h-56 bg-checkerboard rounded-xl overflow-hidden flex items-center justify-center p-2 border border-neutral-800">
                    <img
                      src={selectedImage.processedUrl}
                      alt="Processed"
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px]">
                <div>
                  <span className="text-neutral-500 block">Resolution</span>
                  <span className="font-mono text-neutral-200">{selectedImage.width} × {selectedImage.height}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Latency</span>
                  <span className="font-mono text-neutral-200">{selectedImage.processingTimeMs || 1420}ms</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">MIME Type</span>
                  <span className="font-mono text-neutral-200">{selectedImage.mimeType}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => downloadFile(selectedImage.processedUrl, selectedImage.filename)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
                <button
                  onClick={() => {
                    onSelectImageForEditor({
                      originalUrl: selectedImage.originalUrl,
                      processedUrl: selectedImage.processedUrl,
                      filename: selectedImage.filename,
                      width: selectedImage.width,
                      height: selectedImage.height,
                    });
                    setSelectedImage(null);
                    onNavigate('editor');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Open in Editor</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
