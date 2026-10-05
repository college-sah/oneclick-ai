import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Play, 
  Sparkles, 
  Terminal, 
  Plus, 
  FileCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { ApiKeyItem } from '../types';

export const ApiPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'js' | 'python'>('curl');
  
  // Interactive API tester state
  const [testImageUrl, setTestImageUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoadingKeys(true);
      const res = await api.getApiKeys();
      setKeys(res.keys);
    } catch (err) {
      console.error('Failed to load API keys:', err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    try {
      const res = await api.createApiKey(newKeyName);
      setKeys(prev => [...prev, res.key]);
      setNewKeyName('');
    } catch (err) {
      console.error('Failed to create key:', err);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!window.confirm('Revoke and delete this API key? Any live integrations using this key will immediately fail.')) return;
    try {
      await api.deleteApiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      console.error('Failed to delete key:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const runApiTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.removeBackground({
        base64Data: testImageUrl,
        filename: 'api-test-sample.png',
      });
      setTestResult({
        status: 200,
        success: true,
        data: {
          id: res.image.id,
          filename: res.image.filename,
          width: res.image.width,
          height: res.image.height,
          provider: res.provider,
          processingTimeMs: res.processingTimeMs,
          remainingCredits: res.remainingCredits,
        },
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        error: err.message || 'API request test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.oneclickbg.com/api/images/remove-background \\
  -H "Authorization: Bearer ocbg_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "base64Data": "data:image/jpeg;base64,...",
    "filename": "product-photo.jpg",
    "format": "png",
    "resolution": "hd"
  }'`,

    js: `const response = await fetch("https://api.oneclickbg.com/api/images/remove-background", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ocbg_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    base64Data: "data:image/jpeg;base64,...",
    filename: "product-photo.jpg",
    format: "png"
  })
});

const result = await response.json();
console.log("Processed image:", result.image.processedUrl);`,

    python: `import requests

url = "https://api.oneclickbg.com/api/images/remove-background"
headers = {
    "Authorization": "Bearer ocbg_live_YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "base64Data": "data:image/jpeg;base64,...",
    "filename": "product-photo.jpg",
    "format": "png"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print("Cutout URL:", data["image"]["processedUrl"])`,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer REST API v3.2</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Background Removal API
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Integrate sub-2 second background removal directly into your mobile app, e-commerce storefront, or image processing pipeline.
          </p>
        </div>

        {/* API Key Management Section */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                <span>API Keys</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Authenticate your backend requests with Bearer tokens. Keep your keys secret.
              </p>
            </div>

            {/* Create Key Form */}
            <form onSubmit={handleCreateKey} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                required
                placeholder="Key label (e.g. Production Shop)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white placeholder-neutral-500 outline-none w-full sm:w-56"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Key</span>
              </button>
            </form>
          </div>

          {/* Keys Table */}
          <div className="space-y-3">
            {loadingKeys ? (
              <div className="text-xs text-neutral-500 py-6 text-center">Loading API keys...</div>
            ) : keys.length === 0 ? (
              <div className="text-xs text-neutral-400 py-6 text-center">
                No active API keys found. Create a key above to get started.
              </div>
            ) : (
              keys.map((k) => (
                <div key={k.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{k.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                      <span>{k.key.substring(0, 14)}••••••••••••••••••••</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Requests made: {k.requestsCount} • Created: {new Date(k.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(k.key, k.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === k.id ? 'Copied' : 'Copy Key'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-850 transition-colors"
                      title="Revoke key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive Code Snippets & Language Switcher */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Quickstart Code Snippets</span>
            </h2>

            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveSnippetLang('curl')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeSnippetLang === 'curl' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveSnippetLang('js')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeSnippetLang === 'js' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                JavaScript / Node
              </button>
              <button
                onClick={() => setActiveSnippetLang('python')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeSnippetLang === 'python' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Python
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-neutral-950 border border-neutral-800 p-6 overflow-hidden">
            <button
              onClick={() => copyToClipboard(codeSnippets[activeSnippetLang], 'snippet')}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'snippet' ? 'Copied' : 'Copy Snippet'}</span>
            </button>
            <pre className="font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto pt-2">
              {codeSnippets[activeSnippetLang]}
            </pre>
          </div>
        </div>

        {/* Live Interactive API Tester */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Interactive Request Sandbox</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Test your endpoint live directly from the browser without opening Postman.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Sample Image URL to Remove Background
                </label>
                <input
                  type="text"
                  value={testImageUrl}
                  onChange={(e) => setTestImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-indigo-500 text-xs text-white outline-none font-mono"
                />
              </div>

              <button
                onClick={runApiTest}
                disabled={isTesting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isTesting ? 'Sending Request & Processing...' : 'Execute Live Test'}</span>
              </button>
            </div>

            {/* Test Result JSON Inspector */}
            <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-neutral-800">
                <span className="text-neutral-400 font-mono">Response Payload</span>
                {testResult && (
                  <span className={`font-mono font-bold ${testResult.status === 200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    HTTP {testResult.status}
                  </span>
                )}
              </div>
              <pre className="font-mono text-[11px] text-neutral-300 leading-relaxed overflow-x-auto max-h-56">
                {testResult ? JSON.stringify(testResult, null, 2) : '// Click "Execute Live Test" to inspect API JSON output.'}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
