import React, { useState } from 'react';
import { User as UserIcon, Mail, Shield, Bell, Trash2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name, email, avatar });
    setSavedNotice('Profile information saved successfully!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setSavedNotice('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="pb-6 border-b border-neutral-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your personal profile, authentication credentials, and notifications.
          </p>
        </div>

        {/* Saved Notice */}
        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>General Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Auth</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>

        {/* TAB 1: GENERAL PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={avatar || user?.avatar}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{user?.name}</h3>
                <p className="text-xs text-neutral-400">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user?.plan} plan
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <form onSubmit={handleUpdatePassword} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Change Password</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-6 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h4>
              <p className="text-xs text-neutral-400">
                Permanently delete your OneClickBG account and purge all stored transparent assets.
              </p>
              <button
                type="button"
                onClick={() => alert('Account deletion simulated. All session data wiped.')}
                className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold border border-rose-700/50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Notification Preferences</h3>
            
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Monthly Credit Usage Alerts</div>
                  <div className="text-neutral-400 text-[11px]">Notify when 80% and 100% of credits have been consumed.</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">AI Model Upgrades & Release Notes</div>
                  <div className="text-neutral-400 text-[11px]">Receive updates when new neural segmentation weights are published.</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-white">API Key Rate Limit Warnings</div>
                  <div className="text-neutral-400 text-[11px]">Instant email dispatch if your production API threshold is reached.</div>
                </div>
                <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4" />
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
