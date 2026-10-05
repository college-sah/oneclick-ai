import React, { useState } from 'react';
import { CreditCard, Zap, CheckCircle2, AlertCircle, Download, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface BillingPageProps {
  onNavigate: (page: string) => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const invoices = [
    { id: 'INV-2026-003', date: 'Oct 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Creator Monthly' },
    { id: 'INV-2026-002', date: 'Sep 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Creator Monthly' },
    { id: 'INV-2026-001', date: 'Aug 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Creator Monthly' },
  ];

  const handleCancel = async () => {
    if (!window.confirm('Cancel your Pro subscription at the end of the billing cycle?')) return;
    setLoading(true);
    try {
      const res = await api.cancelSubscription();
      setNotice(res.message);
      await refreshUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="pb-6 border-b border-neutral-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-400" />
            <span>Subscription & Billing</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your OneClickBG subscription tier, credit allowances, payment methods, and invoices.
          </p>
        </div>

        {notice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Current Plan Overview Card */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono">Current Plan</span>
              <h2 className="text-2xl font-extrabold text-white capitalize mt-0.5">
                {user?.plan || 'Free'} Creator Plan
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Renews on November 1, 2026 via Stripe billing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('pricing')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Change Plan
              </button>
              {user?.plan !== 'free' && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                >
                  Cancel Plan
                </button>
              )}
            </div>
          </div>

          {/* Credits Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                Monthly Processing Credits
              </span>
              <span className="font-mono text-neutral-400">
                {user?.credits} Credits Remaining
              </span>
            </div>
            <div className="w-full bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, ((user?.credits || 5) / 300) * 100))}%` }}
              />
            </div>
          </div>

          {/* Active Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Max Resolution</div>
              <div className="font-bold text-white mt-0.5">{user?.plan === 'free' ? '1080p (2K)' : '4K Ultra HD'}</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">Commercial License</div>
              <div className="font-bold text-emerald-400 mt-0.5">{user?.plan === 'free' ? 'Personal only' : 'Included'}</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-neutral-400 text-[11px]">REST API Quota</div>
              <div className="font-bold text-white mt-0.5">{user?.plan === 'free' ? '0 calls' : '500 calls/mo'}</div>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Payment Method</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                VISA
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Visa ending in 4242</div>
                <div className="text-[11px] text-neutral-400">Expires 12/28</div>
              </div>
            </div>
            <button
              onClick={() => alert('Payment method update modal simulated.')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Update
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden space-y-2">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Invoice History</h3>
            <span className="text-xs text-neutral-400">Download PDF receipts</span>
          </div>

          <div className="divide-y divide-neutral-800 text-xs">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-neutral-850 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-neutral-300 font-semibold">{inv.id}</div>
                  <span className="text-neutral-500">•</span>
                  <div className="text-neutral-400">{inv.date}</div>
                  <span className="text-neutral-500 hidden sm:inline">•</span>
                  <div className="text-neutral-300 hidden sm:inline">{inv.plan}</div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-white">{inv.amount}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    {inv.status}
                  </span>
                  <button
                    onClick={() => alert(`Downloading PDF receipt for invoice ${inv.id}`)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Download Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
