import { NextRequest, NextResponse } from 'next/server';
import type { AdvisoryLanguage } from '@/lib/types';
import {
  analyzeCropWithGemini,
  fileToBase64,
  getGeminiKey,
  getGroqKey,
  jsonError,
  ProviderError,
  requestBoolean,
  validateImageFile
} from '@/lib/server/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeLanguage(value: FormDataEntryValue | null): AdvisoryLanguage {
  if (value === 'Hindi' || value === 'Bilingual') return value;
  return 'English';
}

export async function POST(request: NextRequest) {
  try {
    const geminiKey = getGeminiKey(request);
    const groqKey = getGroqKey(request);

    if (!geminiKey) {
      if (groqKey) {
        throw new ProviderError(
          'Crop image analysis requires Gemini Vision. Groq can summarize text, but it cannot analyze crop images in CropGuard AI.',
          428,
          'GEMINI_REQUIRED_FOR_IMAGE_ANALYSIS'
        );
      }
      throw new ProviderError(
        'Gemini API key is required for crop image analysis. Please add it in Settings.',
        401,
        'MISSING_GEMINI_API_KEY'
      );
    }

    const formData = await request.formData();
    const image = formData.get('image');
    if (!(image instanceof File)) {
      throw new ProviderError('Invalid image input. Please upload or capture a crop image.', 400, 'INVALID_IMAGE');
    }

    validateImageFile(image);

    const language = normalizeLanguage(formData.get('language'));
    const freeTierMode = requestBoolean(request, 'x-free-tier-mode', true);
    const autoDetectModel = requestBoolean(request, 'x-auto-detect-model', true);
    const requestedModel = request.headers.get('x-gemini-model')?.trim() || undefined;
    const base64 = await fileToBase64(image);

    const result = await analyzeCropWithGemini({
      apiKey: geminiKey,
      mimeType: image.type,
      base64,
      language,
      freeTierMode,
      autoDetectModel,
      requestedModel
    });

    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error, 'Could not analyze the crop image.');
  }
}
