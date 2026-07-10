import { CheckCircle2, CircleDashed, ServerCog, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import type { AiSettings } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { truncateMiddle } from '@/lib/utils';

interface ProviderStatusProps {
  settings: AiSettings;
}

export default function ProviderStatus({ settings }: ProviderStatusProps) {
  const hasGemini = Boolean(settings.geminiApiKey.trim());
  const hasGroq = Boolean(settings.groqApiKey.trim());
  const activeProvider = hasGemini && hasGroq
    ? 'Gemini Vision + Groq summaries'
    : hasGemini
      ? 'Gemini for image analysis and advisory'
      : hasGroq
        ? 'Groq text-only guidance (Gemini needed for images)'
        : 'Not configured';

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
          <ServerCog className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Active Provider Status</h3>
          <p className="text-xs text-emerald-50/60">{activeProvider}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-sky-200" />
              <div>
                <p className="text-sm font-bold text-white">Gemini API</p>
                <p className="text-xs text-emerald-50/55">{hasGemini ? truncateMiddle(settings.geminiApiKey) : 'No browser key saved'}</p>
              </div>
            </div>
            {hasGemini ? <CheckCircle2 className="h-5 w-5 text-crop-neon" /> : <CircleDashed className="h-5 w-5 text-emerald-50/30" />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-50/65">
            <span className="rounded-full bg-black/30 px-2.5 py-1">Model: {settings.detectedGeminiModel || 'Not tested'}</span>
            <span className="rounded-full bg-black/30 px-2.5 py-1">Vision analysis required</span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-orange-200" />
              <div>
                <p className="text-sm font-bold text-white">Groq API</p>
                <p className="text-xs text-emerald-50/55">{hasGroq ? truncateMiddle(settings.groqApiKey) : 'Optional browser key not saved'}</p>
              </div>
            </div>
            {hasGroq ? <CheckCircle2 className="h-5 w-5 text-crop-neon" /> : <CircleDashed className="h-5 w-5 text-emerald-50/30" />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-50/65">
            <span className="rounded-full bg-black/30 px-2.5 py-1">Model: {settings.detectedGroqModel || 'Not tested'}</span>
            <span className="rounded-full bg-black/30 px-2.5 py-1">Fast summaries only</span>
          </div>
        </div>
      </div>

      {hasGroq && !hasGemini && (
        <div className="mt-4 flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-xs leading-5 text-amber-50/85">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Crop image analysis requires Gemini Vision. Groq is used only for text rewriting, Hindi simplification, and quick advisory generation.
        </div>
      )}
    </Card>
  );
}
