import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      onNavigate('remove-bg');
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await api.createSubscription(planId);
      setNotification(res.message);
      await refreshUser();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification('Failed to update subscription: ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const featureMatrix = [
    { name: 'Monthly Removal Credits', free: '5', pro: '300', business: '1,200' },
    { name: 'Export Resolution', free: 'Standard (1080p)', pro: '4K Ultra HD', business: '8K Ultra HD' },
    { name: 'Photo Studio Web Editor', free: true, pro: true, business: true },
    { name: 'Background Replacement & Blur', free: 'Basic colors', pro: 'Full studio scenes', business: 'Custom branded backdrops' },
    { name: 'Batch Processing', free: false, pro: 'Up to 50 at once', business: 'Unlimited queue' },
    { name: 'Developer REST API', free: false, pro: '500 calls/mo', business: '5,000 calls/mo' },
    { name: 'Commercial License', free: false, pro: true, business: true },
    { name: 'Processing Priority', free: 'Standard queue', pro: 'High priority (<1.5s)', business: 'Dedicated GPU worker' },
    { name: 'Team Seats', free: '1 user', pro: '1 user', business: 'Up to 5 seats' },
    { name: 'Uptime SLA', free: 'Best effort', pro: '99.9%', business: '99.99% Guaranteed' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair & Predictable Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Plans for Creators, Studios & Teams
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Scale your photography and catalog workflows with high-precision AI. Upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">
                  20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold text-center animate-in fade-in">
            {notification}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* FREE */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Free Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-neutral-400">/ forever</span>
              </div>
              <p className="text-xs text-neutral-400">
                Ideal for testing out background removal for personal hobby use.
              </p>
              <div className="h-px bg-neutral-800" />
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Free credits / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard 1080p resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Photo studio editor</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('free')}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
            >
              {user?.plan === 'free' ? 'Current Plan' : 'Choose Free'}
            </button>
          </div>

          {/* PRO (Popular) */}
          <div className="p-8 rounded-3xl bg-neutral-900 border-2 border-indigo-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-indigo-600/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pro Creator</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '$15' : '$19'}
                </span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <p className="text-xs text-neutral-400">
                For online shop owners, photographers, and independent designers.
              </p>
              <div className="h-px bg-neutral-800" />
              <ul className="space-y-3 text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">300 HD removals / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>4K Ultra HD Export resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Advanced studio backdrops & AI scenes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Commercial License</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>500 REST API requests / month</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('pro')}
              disabled={loadingPlan === 'pro'}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loadingPlan === 'pro' ? 'Updating Plan...' : user?.plan === 'pro' ? 'Current Plan (Active)' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* BUSINESS */}
          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Business & Team</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '$39' : '$49'}
                </span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <p className="text-xs text-neutral-400">
                For brands, creative agencies, and high-throughput automated APIs.
              </p>
              <div className="h-px bg-neutral-800" />
              <ul className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="font-semibold text-white">1,200 background removals / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>8K Full Resolution & RAW support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>5,000 REST API requests / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>5 Team Seats with shared credit pool</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan('business')}
              disabled={loadingPlan === 'business'}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
            >
              {loadingPlan === 'business' ? 'Updating Plan...' : user?.plan === 'business' ? 'Current Plan (Active)' : 'Choose Business'}
            </button>
          </div>

        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="space-y-6 pt-10">
          <h2 className="text-2xl font-bold text-white text-center">
            Comprehensive Feature Matrix
          </h2>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-950/80 text-neutral-300 font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-center">Free Starter</th>
                  <th className="p-4 text-center text-indigo-400">Pro Creator</th>
                  <th className="p-4 text-center text-purple-400">Business Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {featureMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-850/50">
                    <td className="p-4 font-medium text-white">{item.name}</td>
                    <td className="p-4 text-center text-neutral-400">
                      {typeof item.free === 'boolean' ? (
                        item.free ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : '—'
                      ) : (
                        item.free
                      )}
                    </td>
                    <td className="p-4 text-center font-medium text-neutral-200">
                      {typeof item.pro === 'boolean' ? (
                        item.pro ? <Check className="w-4 h-4 text-indigo-400 mx-auto" /> : '—'
                      ) : (
                        item.pro
                      )}
                    </td>
                    <td className="p-4 text-center font-medium text-neutral-200">
                      {typeof item.business === 'boolean' ? (
                        item.business ? <Check className="w-4 h-4 text-purple-400 mx-auto" /> : '—'
                      ) : (
                        item.business
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
