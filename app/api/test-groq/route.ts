import { NextRequest, NextResponse } from 'next/server';
import { detectGroqModel, getGroqKey, jsonError, requestBoolean } from '@/lib/server/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const freeTierMode = requestBoolean(request, 'x-free-tier-mode', true);
    let apiKey = getGroqKey(request);

    if (!apiKey) {
      try {
        const body = (await request.json()) as { apiKey?: string };
        apiKey = body.apiKey?.trim() || '';
      } catch {
        apiKey = '';
      }
    }

    const result = await detectGroqModel(apiKey, freeTierMode);
    return NextResponse.json({
      ok: true,
      provider: 'Groq',
      message: 'Groq connection successful. Fast text model detection completed where supported.',
      detectedModel: result.detectedModel,
      availableModels: result.availableModels,
      testedAt: new Date().toISOString()
    });
  } catch (error) {
    return jsonError(error, 'Groq connection test failed.');
  }
}
