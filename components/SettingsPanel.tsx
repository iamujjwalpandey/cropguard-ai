'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, KeyRound, RefreshCcw, ShieldAlert, Sparkles, Trash2, Zap } from 'lucide-react';
import ProviderStatus from '@/components/ProviderStatus';
import DisclaimerBox from '@/components/DisclaimerBox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DEFAULT_SETTINGS, clearAiSettings, getAiSettings, saveAiSettings } from '@/lib/api-keys';
import type { AiSettings, PreferredProvider, ProviderTestResult } from '@/lib/types';

function statusText(result?: ProviderTestResult) {
  if (!result) return null;
  return (
    <div className={result.ok ? 'text-crop-neon' : 'text-amber-200'}>
      {result.ok ? 'Connected' : 'Failed'} • {result.message}
    </div>
  );
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_SETTINGS);
  const [showGemini, setShowGemini] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [testing, setTesting] = useState<'gemini' | 'groq' | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSettings(getAiSettings());
  }, []);

  useEffect(() => {
    const hasGemini = settings.geminiApiKey.trim();
    const hasGroq = settings.groqApiKey.trim();
    const activeProvider = hasGemini && hasGroq
      ? 'Gemini Vision + Groq summaries'
      : hasGemini
        ? 'Gemini'
        : hasGroq
          ? 'Groq text-only mode'
          : 'Not configured';
    const next = { ...settings, activeProvider };
    saveAiSettings(next);
  }, [settings]);

  const fallbackBehavior = useMemo(() => {
    if (settings.geminiApiKey && settings.groqApiKey) {
      return 'Gemini performs image analysis. Groq rewrites farmer-friendly summaries and Hindi simplification. If Groq fails, Gemini handles the summary fallback.';
    }
    if (settings.geminiApiKey) return 'Gemini performs image analysis, reasoning, structured JSON report generation, and summaries.';
    if (settings.groqApiKey) return 'Groq can generate text guidance from existing analysis only. Add Gemini for crop image diagnosis.';
    return 'No provider is configured. Add a Gemini API key to start crop image analysis.';
  }, [settings.geminiApiKey, settings.groqApiKey]);

  function update<K extends keyof AiSettings>(key: K, value: AiSettings[K]) {
    setSettings((previous) => ({ ...previous, [key]: value }));
  }

  async function testProvider(provider: 'gemini' | 'groq') {
    setTesting(provider);
    setNotice('');
    try {
      const endpoint = provider === 'gemini' ? '/api/test-gemini' : '/api/test-groq';
      const apiKey = provider === 'gemini' ? settings.geminiApiKey.trim() : settings.groqApiKey.trim();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-free-tier-mode': String(settings.freeTierMode),
          ...(provider === 'gemini' && apiKey ? { 'x-gemini-api-key': apiKey } : {}),
          ...(provider === 'groq' && apiKey ? { 'x-groq-api-key': apiKey } : {})
        },
        body: JSON.stringify({ apiKey })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not test ${provider}.`);
      const result: ProviderTestResult = { ...data, testedAt: data.testedAt || new Date().toISOString() };
      if (provider === 'gemini') {
        setSettings((previous) => ({
          ...previous,
          detectedGeminiModel: result.detectedModel || 'Not detected',
          lastGeminiStatus: result
        }));
      } else {
        setSettings((previous) => ({
          ...previous,
          detectedGroqModel: result.detectedModel || 'Not detected',
          lastGroqStatus: result
        }));
      }
      setNotice(`${result.provider} connection successful. Detected model: ${result.detectedModel}`);
    } catch (error) {
      const result: ProviderTestResult = {
        ok: false,
        provider: provider === 'gemini' ? 'Gemini' : 'Groq',
        message: error instanceof Error ? error.message : 'Connection test failed.',
        testedAt: new Date().toISOString()
      };
      if (provider === 'gemini') setSettings((previous) => ({ ...previous, lastGeminiStatus: result }));
      else setSettings((previous) => ({ ...previous, lastGroqStatus: result }));
      setNotice(result.message);
    } finally {
      setTesting(null);
    }
  }

  function clearKeys() {
    clearAiSettings();
    setSettings(DEFAULT_SETTINGS);
    setNotice('Saved browser API keys cleared. Server-side environment variables, if configured, remain secure on the server.');
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <div className="border-b border-emerald-400/15 bg-emerald-400/8 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">AI Provider Settings</h2>
                <p className="mt-1 text-sm leading-6 text-emerald-50/65">
                  Add Gemini for crop image analysis and optionally Groq for fast farmer-friendly summaries.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6">
            <div className="grid gap-3">
              <label className="text-sm font-bold text-white">Gemini API key</label>
              <div className="flex gap-2">
                <Input
                  type={showGemini ? 'text' : 'password'}
                  placeholder="AIza..."
                  value={settings.geminiApiKey}
                  onChange={(event) => update('geminiApiKey', event.target.value)}
                  autoComplete="off"
                />
                <Button variant="secondary" size="icon" onClick={() => setShowGemini((value) => !value)} aria-label="Toggle Gemini key visibility">
                  {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-emerald-50/55">Required for real crop image analysis, structured JSON reports, and expert reasoning.</p>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-bold text-white">Groq API key</label>
              <div className="flex gap-2">
                <Input
                  type={showGroq ? 'text' : 'password'}
                  placeholder="gsk_..."
                  value={settings.groqApiKey}
                  onChange={(event) => update('groqApiKey', event.target.value)}
                  autoComplete="off"
                />
                <Button variant="secondary" size="icon" onClick={() => setShowGroq((value) => !value)} aria-label="Toggle Groq key visibility">
                  {showGroq ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-emerald-50/55">Optional. Used for fast text rewriting, farmer-friendly summaries, and Hindi simplification.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-3">
                <label className="text-sm font-bold text-white">Preferred provider</label>
                <Select value={settings.preferredProvider} onChange={(event) => update('preferredProvider', event.target.value as PreferredProvider)}>
                  <option value="auto">Auto Detect Best Model</option>
                  <option value="gemini">Gemini</option>
                  <option value="groq">Groq</option>
                </Select>
              </div>

              <div className="grid gap-3">
                <label className="text-sm font-bold text-white">Current detected model</label>
                <div className="rounded-xl border border-emerald-400/20 bg-black/30 px-3 py-3 text-sm text-emerald-50/75">
                  Gemini: {settings.detectedGeminiModel || 'Not tested'}
                  <br />
                  Groq: {settings.detectedGroqModel || 'Not tested'}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">Auto Detect Best Model</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/55">Detect available provider models where supported and choose a safe fallback.</p>
                  </div>
                  <Switch checked={settings.autoDetectModel} onCheckedChange={(value) => update('autoDetectModel', value)} />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">Free Tier Mode</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/55">Prefer free-tier models and efficient prompts. Usage limits depend on providers.</p>
                  </div>
                  <Switch checked={settings.freeTierMode} onCheckedChange={(value) => update('freeTierMode', value)} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => testProvider('gemini')} disabled={testing !== null}>
                {testing === 'gemini' ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Test Gemini connection
              </Button>
              <Button variant="secondary" onClick={() => testProvider('groq')} disabled={testing !== null}>
                {testing === 'groq' ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Test Groq connection
              </Button>
              <Button variant="destructive" onClick={clearKeys}>
                <Trash2 className="h-4 w-4" />
                Clear saved keys
              </Button>
            </div>

            <div className="grid gap-2 text-xs leading-5 text-emerald-50/60">
              {statusText(settings.lastGeminiStatus)}
              {statusText(settings.lastGroqStatus)}
            </div>

            {notice && (
              <div className="flex gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50/80">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-crop-neon" />
                <span>{notice}</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
            <div>
              <h3 className="font-bold text-white">API Key Security</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-50/70">
                API keys are sensitive. In demo mode, keys are stored locally in your browser. For production, use secure server-side environment variables.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-emerald-400/15 bg-black/45 p-4 text-xs text-emerald-100">
{`GEMINI_API_KEY=
GROQ_API_KEY=`}
              </pre>
              <p className="mt-3 text-xs leading-5 text-emerald-50/55">
                CropGuard AI never hardcodes API keys and never exposes server-side environment variables in frontend code.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 self-start">
        <ProviderStatus settings={settings} />

        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
            <div>
              <h3 className="font-bold text-white">Model Fallback Behavior</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-50/70">{fallbackBehavior}</p>
              <p className="mt-3 text-xs leading-5 text-emerald-50/55">
                Free-tier availability and usage limits depend on Gemini and Groq provider policies. Please check your provider dashboard.
              </p>
            </div>
          </div>
        </Card>

        <DisclaimerBox variant="warning" />
      </div>
    </div>
  );
}
