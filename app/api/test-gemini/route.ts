import { NextRequest, NextResponse } from 'next/server';
import { detectGeminiModel, getGeminiKey, jsonError, requestBoolean } from '@/lib/server/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const freeTierMode = requestBoolean(request, 'x-free-tier-mode', true);
    let apiKey = getGeminiKey(request);

    if (!apiKey) {
      try {
        const body = (await request.json()) as { apiKey?: string };
        apiKey = body.apiKey?.trim() || '';
      } catch {
        apiKey = '';
      }
    }

    const result = await detectGeminiModel(apiKey, freeTierMode);
    return NextResponse.json({
      ok: true,
      provider: 'Gemini',
      message: 'Gemini connection successful. Vision-capable model detection completed where supported.',
      detectedModel: result.detectedModel.replace(/^models\//, ''),
      availableModels: result.availableModels.map((model) => model.replace(/^models\//, '')),
      testedAt: new Date().toISOString()
    });
  } catch (error) {
    return jsonError(error, 'Gemini connection test failed.');
  }
}
