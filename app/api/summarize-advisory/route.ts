import { NextRequest, NextResponse } from 'next/server';
import type { AdvisoryLanguage, CropAnalysis } from '@/lib/types';
import {
  getGeminiKey,
  getGroqKey,
  jsonError,
  ProviderError,
  requestBoolean,
  summarizeWithGemini,
  summarizeWithGroq
} from '@/lib/server/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeLanguage(value: unknown): AdvisoryLanguage {
  if (value === 'Hindi' || value === 'Bilingual') return value;
  return 'English';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { analysis?: CropAnalysis; language?: AdvisoryLanguage };
    if (!body.analysis) {
      throw new ProviderError('Analysis JSON is required to generate advisory summary.', 400, 'MISSING_ANALYSIS_JSON');
    }

    const language = normalizeLanguage(body.language);
    const freeTierMode = requestBoolean(request, 'x-free-tier-mode', true);
    const groqKey = getGroqKey(request);
    const geminiKey = getGeminiKey(request);
    const requestedGroqModel = request.headers.get('x-groq-model')?.trim() || undefined;
    const requestedGeminiModel = request.headers.get('x-gemini-model')?.trim() || undefined;
    const preferredProvider = request.headers.get('x-preferred-provider') || 'auto';
    const shouldUseGroq = preferredProvider !== 'gemini';

    if (groqKey && shouldUseGroq) {
      try {
        const groqResult = await summarizeWithGroq({
          apiKey: groqKey,
          analysis: body.analysis,
          language,
          freeTierMode,
          requestedModel: requestedGroqModel
        });
        return NextResponse.json(groqResult);
      } catch (error) {
        if (!geminiKey) throw error;
      }
    }

    if (geminiKey) {
      const geminiResult = await summarizeWithGemini({
        apiKey: geminiKey,
        analysis: body.analysis,
        language,
        freeTierMode,
        requestedModel: requestedGeminiModel
      });
      return NextResponse.json(geminiResult);
    }

    return NextResponse.json({
      summary: body.analysis.farmerFriendlyExplanation,
      provider: 'None',
      model: undefined
    });
  } catch (error) {
    return jsonError(error, 'Could not generate farmer-friendly advisory.');
  }
}
