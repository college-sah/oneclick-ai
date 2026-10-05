import React from 'react';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          404
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The page or asset you are seeking has been moved, renamed, or erased from temporary cache.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => onNavigate('remove-bg')}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Remove Background</span>
          </button>
        </div>
      </div>
    </div>
  );
};
