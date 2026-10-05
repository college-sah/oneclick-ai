import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Sliders, 
  Zap, 
  CreditCard, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  Code2, 
  FolderClock,
  LayoutDashboard,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'remove-bg', label: 'Remove BG', highlight: true },
    { id: 'editor', label: 'Editor' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'api', label: 'API' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/85 dark:bg-neutral-950/85 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                  OneClick<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">BG</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI v3.2
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 -mt-1 hidden sm:block">
                SnapCut AI Matting
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-neutral-800/90 shadow-sm'
                      : link.highlight
                      ? 'text-indigo-300 hover:text-white hover:bg-indigo-950/40'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Demo Role Switcher Quick Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
                title="Switch demo role to test different tiers"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="capitalize">{user?.role === 'admin' ? 'Admin Mode' : `${user?.plan || 'free'} plan`}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => { switchDemoRole('user'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center justify-between"
                  >
                    <span>Free User (3 credits)</span>
                    {user?.plan === 'free' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('pro'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center justify-between"
                  >
                    <span>Pro User (245 credits)</span>
                    {user?.plan === 'pro' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setRoleDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center justify-between"
                  >
                    <span>Admin Mode (All tools)</span>
                    {user?.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Credit Counter Pill */}
            {user && (
              <button
                onClick={() => onNavigate('billing')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/40 text-indigo-300 hover:border-indigo-600 transition-colors"
                title="View your credit allowance"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{user.credits} Credits</span>
              </button>
            )}

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-xs font-medium text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user.plan} Plan
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { onNavigate('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { onNavigate('history'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <FolderClock className="w-4 h-4 text-neutral-400" />
                        My Images & History
                      </button>
                      <button
                        onClick={() => { onNavigate('billing'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4 text-neutral-400" />
                        Subscription & Billing
                      </button>
                      <button
                        onClick={() => { onNavigate('settings'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4 text-neutral-400" />
                        Account Settings
                      </button>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => { onNavigate('admin'); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-xs text-purple-300 hover:bg-purple-950/40 flex items-center gap-2 border-t border-neutral-800/80"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          Admin Panel
                        </button>
                      )}
                    </div>

                    <div className="border-t border-neutral-800 pt-1">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Quick Primary Call to Action */}
            <button
              onClick={() => onNavigate('remove-bg')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remove BG</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:bg-neutral-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === link.id
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-neutral-800 space-y-2">
            {user ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <div className="text-[11px] text-indigo-400">{user.credits} Credits • {user.plan}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                    className="text-xs px-2.5 py-1 rounded bg-indigo-600 text-white font-medium"
                  >
                    Dashboard
                  </button>
                </div>
                <button
                  onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 rounded"
                >
                  My Images & History
                </button>
                <button
                  onClick={() => { onNavigate('billing'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 rounded"
                >
                  Subscription & Billing
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-purple-400 hover:bg-purple-950/40 rounded"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-xs font-semibold text-neutral-200 bg-neutral-900 rounded-lg"
                >
                  Log in
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-xs font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
