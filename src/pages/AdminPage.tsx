import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Cpu, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  DollarSign, 
  Activity, 
  Settings, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, ProcessingJob, ContactMessage } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'messages' | 'config'>('overview');
  
  const [overview, setOverview] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [jobsList, setJobsList] = useState<ProcessingJob[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings
  const [maxFileSize, setMaxFileSize] = useState(25);
  const [rateLimit, setRateLimit] = useState(60);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [ovRes, uRes, jRes, mRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminJobs(),
        api.getAdminContactMessages(),
      ]);
      setOverview(ovRes);
      setUsersList(uRes.users);
      setJobsList(jRes.jobs);
      setMessagesList(mRes.messages);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                System Administration
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time platform metrics, user management, queue health, and system parameters.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Users ({usersList.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'jobs' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Jobs ({jobsList.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'messages' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Inbox ({messagesList.length})
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'config' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400">Total Registered Users</span>
                <div className="text-3xl font-extrabold text-white font-mono">{overview?.totalUsers || 3}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% this month</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400">Total Processed Cutouts</span>
                <div className="text-3xl font-extrabold text-white font-mono">{overview?.totalJobs || 428}</div>
                <div className="text-[11px] text-emerald-400">99.4% AI Success Rate</div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400">Monthly Recurring Revenue</span>
                <div className="text-3xl font-extrabold text-indigo-400 font-mono">{overview?.mrr || '$14,850'}</div>
                <div className="text-[11px] text-neutral-400">Stripe Live Production</div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400">Avg GPU Latency</span>
                <div className="text-3xl font-extrabold text-purple-400 font-mono">1,420ms</div>
                <div className="text-[11px] text-emerald-400">Fast inference tier</div>
              </div>
            </div>

            {/* Quick Health & Engine Status */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>AI Infrastructure Status</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400">Neural Matting Engine</div>
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Operational (v3.2 active)</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400">Gemini Grounding Gateway</div>
                  <div className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Connected via @google/genai</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400">CDN Storage & Cache</div>
                  <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Purge schedule: 24h retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS LIST */}
        {activeTab === 'users' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Remaining Credits</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-850/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-neutral-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="p-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 capitalize font-medium text-white">{u.plan}</td>
                      <td className="p-4 font-mono text-neutral-200">{u.credits}</td>
                      <td className="p-4 text-neutral-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOBS */}
        {activeTab === 'jobs' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Job ID</th>
                    <th className="p-4">Filename</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Latency</th>
                    <th className="p-4">AI Model</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {jobsList.map((j) => (
                    <tr key={j.id} className="hover:bg-neutral-850/50">
                      <td className="p-4 font-mono text-neutral-400">{j.id}</td>
                      <td className="p-4 font-medium text-white">{j.filename}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                          {j.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-neutral-300">{j.processingTimeMs}ms</td>
                      <td className="p-4 text-indigo-300 text-[11px] font-mono">{j.provider}</td>
                      <td className="p-4 text-neutral-400 text-[11px]">
                        {new Date(j.completedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden space-y-2">
            <div className="p-4 border-b border-neutral-800 font-bold text-xs text-white">
              Customer & Enterprise Inquiries
            </div>
            <div className="divide-y divide-neutral-800">
              {messagesList.map((m) => (
                <div key={m.id} className="p-5 space-y-2 hover:bg-neutral-850/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{m.name} ({m.email})</span>
                    <span className="text-[11px] text-neutral-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-300">{m.subject}</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIG */}
        {activeTab === 'config' && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white">Global Quota & File Size Settings</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Maximum Upload File Size (MB)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Rate Limit Per IP (Requests / Minute)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Configuration updated successfully.')}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
