import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot-password';
  onNavigate: (page: string) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({ 
  initialMode = 'login', 
  onNavigate 
}) => {
  const { login, register, switchDemoRole } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onNavigate('dashboard');
      } else if (mode === 'register') {
        await register(name, email, password);
        onNavigate('dashboard');
      } else if (mode === 'forgot-password') {
        const res = await api.forgotPassword(email);
        setSuccessMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'user' | 'pro' | 'admin') => {
    switchDemoRole(role);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            onClick={() => onNavigate('home')} 
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/20">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white font-mono">
              OneClick<span className="text-indigo-400">BG</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-neutral-400">
            {mode === 'login' && 'Log in to access your processed cutouts and studio credits.'}
            {mode === 'register' && 'Get started with 5 free credits and access to the web editor.'}
            {mode === 'forgot-password' && 'Enter your email address and we will send recovery instructions.'}
          </p>
        </div>

        {/* Demo Persona Shortcuts for Reviewers */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Quick Demo Personas
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">Click to test instant</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors text-center truncate"
            >
              Free User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('pro')}
              className="py-1.5 px-2 rounded-lg bg-indigo-950/70 border border-indigo-700/50 hover:bg-indigo-900/60 text-indigo-200 text-xs font-medium transition-colors text-center truncate"
            >
              Pro User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 rounded-lg bg-purple-950/70 border border-purple-700/50 hover:bg-purple-900/60 text-purple-200 text-xs font-medium transition-colors text-center truncate"
            >
              Admin Mode
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-xl shadow-2xl space-y-6">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In to Account'
                  : mode === 'register'
                  ? 'Create Free Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch mode links */}
          <div className="pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
            {mode === 'login' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-indigo-400 font-semibold hover:text-indigo-300"
                >
                  Sign up free
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-indigo-400 font-semibold hover:text-indigo-300"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-indigo-400 font-semibold hover:text-indigo-300"
                >
                  Back to login
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
