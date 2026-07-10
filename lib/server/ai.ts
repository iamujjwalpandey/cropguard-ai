import { NextRequest, NextResponse } from 'next/server';
import {
  ADVISORY_DISCLAIMER,
  ANALYSIS_SCHEMA_FIELDS,
  GEMINI_SYSTEM_PROMPT,
  GROQ_SYSTEM_PROMPT,
  MODEL_PRIORITIES
} from '@/lib/constants';
import type { AdvisoryLanguage, CropAnalysis } from '@/lib/types';
import { createEmptyAnalysis } from '@/lib/report';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';

export class ProviderError extends Error {
  status: number;
  code: string;
  detail?: string;

  constructor(message: string, status = 500, code = 'PROVIDER_ERROR', detail?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export function jsonError(error: unknown, fallback = 'Something went wrong while processing the request.') {
  if (error instanceof ProviderError) {
    return NextResponse.json(
      { error: error.message, code: error.code, detail: error.detail },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message, code: 'SERVER_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ error: fallback, code: 'SERVER_ERROR' }, { status: 500 });
}

export function getGeminiKey(request: NextRequest) {
  const headerKey = request.headers.get('x-gemini-api-key')?.trim();
  return headerKey || process.env.GEMINI_API_KEY?.trim() || '';
}

export function getGroqKey(request: NextRequest) {
  const headerKey = request.headers.get('x-groq-api-key')?.trim();
  return headerKey || process.env.GROQ_API_KEY?.trim() || '';
}

export function requestBoolean(request: NextRequest, header: string, fallback: boolean) {
  const value = request.headers.get(header);
  if (value === null) return fallback;
  return value === 'true';
}

export async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal, cache: 'no-store' });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ProviderError('The AI provider timed out. Please try again with a smaller, clearer image.', 504, 'API_TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeGeminiModelName(model: string) {
  if (!model) return 'models/gemini-1.5-flash';
  return model.startsWith('models/') ? model : `models/${model}`;
}

export function displayModelName(model: string) {
  return model.replace(/^models\//, '');
}

function pickPriorityModel(available: string[], provider: 'gemini' | 'groq', freeTierMode: boolean) {
  const priorities = provider === 'gemini'
    ? freeTierMode
      ? MODEL_PRIORITIES.geminiFree
      : MODEL_PRIORITIES.geminiGeneral
    : freeTierMode
      ? MODEL_PRIORITIES.groqFree
      : MODEL_PRIORITIES.groqGeneral;

  const normalizedAvailable = provider === 'gemini' ? available.map(normalizeGeminiModelName) : available;
  const priorityMatch = priorities.find((candidate) => normalizedAvailable.includes(candidate));
  if (priorityMatch) return priorityMatch;

  const flashMatch = normalizedAvailable.find((candidate) => candidate.toLowerCase().includes('flash'));
  if (flashMatch) return flashMatch;

  const llamaMatch = normalizedAvailable.find((candidate) => candidate.toLowerCase().includes('llama'));
  if (llamaMatch) return llamaMatch;

  return normalizedAvailable[0];
}

async function providerJson(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

export async function detectGeminiModel(apiKey: string, freeTierMode = true) {
  if (!apiKey) {
    throw new ProviderError('Gemini API key is required for crop image analysis. Please add it in Settings.', 401, 'MISSING_GEMINI_API_KEY');
  }

  const response = await fetchWithTimeout(`${GEMINI_API_BASE}/models?key=${encodeURIComponent(apiKey)}`, {}, 15000);
  const data = await providerJson(response);

  if (!response.ok) {
    const message = data?.error?.message || 'Could not connect to Gemini. Please verify your API key.';
    throw new ProviderError(message, response.status, response.status === 429 ? 'RATE_LIMIT' : 'INVALID_GEMINI_API_KEY');
  }

  const models: string[] = Array.isArray(data.models)
    ? data.models
        .filter((model: { name?: string; supportedGenerationMethods?: string[] }) =>
          model.name && (!model.supportedGenerationMethods || model.supportedGenerationMethods.includes('generateContent'))
        )
        .map((model: { name: string }) => normalizeGeminiModelName(model.name))
    : [];

  const detected = pickPriorityModel(models, 'gemini', freeTierMode) || 'models/gemini-1.5-flash';
  return {
    detectedModel: detected,
    availableModels: models.slice(0, 20)
  };
}

export async function detectGroqModel(apiKey: string, freeTierMode = true) {
  if (!apiKey) {
    throw new ProviderError('Groq API key is missing. Add it only if you want fast advisory rewriting.', 401, 'MISSING_GROQ_API_KEY');
  }

  const response = await fetchWithTimeout(`${GROQ_API_BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  }, 15000);
  const data = await providerJson(response);

  if (!response.ok) {
    const message = data?.error?.message || 'Could not connect to Groq. Please verify your API key.';
    throw new ProviderError(message, response.status, response.status === 429 ? 'RATE_LIMIT' : 'INVALID_GROQ_API_KEY');
  }

  const models: string[] = Array.isArray(data.data)
    ? data.data.map((model: { id?: string }) => model.id).filter(Boolean)
    : [];

  const detected = pickPriorityModel(models, 'groq', freeTierMode) || 'llama-3.1-8b-instant';
  return {
    detectedModel: detected,
    availableModels: models.slice(0, 25)
  };
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n|;/)
      .map((item) => item.replace(/^[-*•\d.\s]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function normalizeAnalysis(input: Partial<CropAnalysis>) {
  const fallback = createEmptyAnalysis();
  const analysis: CropAnalysis = {
    cropHealthStatus: stringValue(input.cropHealthStatus, fallback.cropHealthStatus),
    possibleDisease: stringValue(input.possibleDisease, fallback.possibleDisease),
    diseaseCategory: stringValue(input.diseaseCategory, fallback.diseaseCategory),
    visibleSymptoms: stringArray(input.visibleSymptoms),
    severityLevel: stringValue(input.severityLevel, fallback.severityLevel),
    riskLevel: stringValue(input.riskLevel, fallback.riskLevel),
    confidenceLabel: stringValue(input.confidenceLabel, fallback.confidenceLabel),
    possibleCauses: stringArray(input.possibleCauses),
    spreadRisk: stringValue(input.spreadRisk, fallback.spreadRisk),
    estimatedUrgency: stringValue(input.estimatedUrgency, fallback.estimatedUrgency),
    farmerFriendlyExplanation: stringValue(input.farmerFriendlyExplanation, fallback.farmerFriendlyExplanation),
    expertExplanation: stringValue(input.expertExplanation, fallback.expertExplanation),
    organicTreatment: stringArray(input.organicTreatment),
    chemicalTreatmentWarning: stringValue(input.chemicalTreatmentWarning, ADVISORY_DISCLAIMER),
    preventionPlan: stringArray(input.preventionPlan),
    monitoringPlan: stringArray(input.monitoringPlan),
    nextSteps: stringArray(input.nextSteps),
    whenToConsultExpert: stringValue(input.whenToConsultExpert, fallback.whenToConsultExpert),
    limitations: stringValue(input.limitations, fallback.limitations),
    disclaimer: stringValue(input.disclaimer, ADVISORY_DISCLAIMER)
  };

  const allowedSeverity = ['Healthy', 'Mild', 'Moderate', 'Severe', 'Critical', 'Unknown'];
  if (!allowedSeverity.includes(String(analysis.severityLevel))) analysis.severityLevel = 'Unknown';

  const allowedRisk = ['Low', 'Medium', 'High', 'Urgent', 'Needs Expert Review'];
  if (!allowedRisk.includes(String(analysis.riskLevel))) analysis.riskLevel = 'Needs Expert Review';

  const allowedConfidence = [
    'High Visual Match',
    'Medium Visual Match',
    'Low Visual Match',
    'Needs Expert Verification'
  ];
  if (!allowedConfidence.includes(String(analysis.confidenceLabel))) {
    analysis.confidenceLabel = 'Needs Expert Verification';
  }

  return analysis;
}

export function extractJsonFromText(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new ProviderError('AI response parsing error. The provider did not return valid structured JSON.', 502, 'AI_RESPONSE_PARSE_ERROR');
  }
}

function analysisResponseSchema() {
  const stringField = { type: 'STRING' };
  const arrayField = { type: 'ARRAY', items: { type: 'STRING' } };
  return {
    type: 'OBJECT',
    properties: {
      cropHealthStatus: stringField,
      possibleDisease: stringField,
      diseaseCategory: stringField,
      visibleSymptoms: arrayField,
      severityLevel: stringField,
      riskLevel: stringField,
      confidenceLabel: stringField,
      possibleCauses: arrayField,
      spreadRisk: stringField,
      estimatedUrgency: stringField,
      farmerFriendlyExplanation: stringField,
      expertExplanation: stringField,
      organicTreatment: arrayField,
      chemicalTreatmentWarning: stringField,
      preventionPlan: arrayField,
      monitoringPlan: arrayField,
      nextSteps: arrayField,
      whenToConsultExpert: stringField,
      limitations: stringField,
      disclaimer: stringField
    },
    required: [...ANALYSIS_SCHEMA_FIELDS]
  };
}

function geminiAnalysisPrompt(language: AdvisoryLanguage, freeTierMode: boolean) {
  return `Analyze this crop image for visible crop health symptoms. Return only valid JSON with exactly this schema and no markdown:

{
"cropHealthStatus": "",
"possibleDisease": "",
"diseaseCategory": "",
"visibleSymptoms": [],
"severityLevel": "",
"riskLevel": "",
"confidenceLabel": "",
"possibleCauses": [],
"spreadRisk": "",
"estimatedUrgency": "",
"farmerFriendlyExplanation": "",
"expertExplanation": "",
"organicTreatment": [],
"chemicalTreatmentWarning": "",
"preventionPlan": [],
"monitoringPlan": [],
"nextSteps": [],
"whenToConsultExpert": "",
"limitations": "",
"disclaimer": ""
}

Allowed severityLevel values: Healthy, Mild, Moderate, Severe, Critical, Unknown.
Allowed riskLevel values: Low, Medium, High, Urgent, Needs Expert Review.
Allowed confidenceLabel values: High Visual Match, Medium Visual Match, Low Visual Match, Needs Expert Verification.

Language preference: ${language}. If Hindi or Bilingual is requested, keep field keys in English but write farmer-facing text in the requested language where practical.

Free Tier Mode: ${freeTierMode ? 'enabled. Be concise and avoid unnecessary long output.' : 'disabled. Provide detailed expert reasoning while staying safe.'}

Important safety rules:
- Do not claim final diagnosis.
- If no crop or unclear symptoms are visible, set severityLevel to Unknown, confidenceLabel to Needs Expert Verification, and explain that expert verification is required.
- Avoid exact pesticide dosage instructions.
- Always include this exact disclaimer: ${ADVISORY_DISCLAIMER}`;
}

function geminiRequestBody(params: {
  mimeType: string;
  base64: string;
  language: AdvisoryLanguage;
  freeTierMode: boolean;
  withSchema: boolean;
}) {
  const body: Record<string, unknown> = {
    systemInstruction: {
      parts: [{ text: GEMINI_SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: 'user',
        parts: [
          { text: geminiAnalysisPrompt(params.language, params.freeTierMode) },
          {
            inlineData: {
              mimeType: params.mimeType,
              data: params.base64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.18,
      topP: 0.9,
      maxOutputTokens: params.freeTierMode ? 1600 : 2400,
      responseMimeType: 'application/json'
    }
  };

  if (params.withSchema) {
    (body.generationConfig as Record<string, unknown>).responseSchema = analysisResponseSchema();
  }

  return body;
}

async function callGeminiGenerateContent(params: {
  apiKey: string;
  model: string;
  body: Record<string, unknown>;
  timeoutMs?: number;
}) {
  const model = normalizeGeminiModelName(params.model);
  const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(params.apiKey)}`;

  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.body)
  }, params.timeoutMs ?? 45000);
  const data = await providerJson(response);

  if (!response.ok) {
    const message = data?.error?.message || 'Gemini could not analyze the crop image.';
    const code = response.status === 429
      ? 'RATE_LIMIT'
      : response.status === 401 || response.status === 403
        ? 'INVALID_GEMINI_API_KEY'
        : response.status === 400
          ? 'INVALID_IMAGE_OR_MODEL'
          : 'GEMINI_PROVIDER_ERROR';
    throw new ProviderError(message, response.status, code);
  }

  return data;
}

export async function analyzeCropWithGemini(params: {
  apiKey: string;
  mimeType: string;
  base64: string;
  language: AdvisoryLanguage;
  freeTierMode: boolean;
  autoDetectModel: boolean;
  requestedModel?: string;
}) {
  if (!params.apiKey) {
    throw new ProviderError('Gemini API key is required for crop image analysis. Please add it in Settings.', 401, 'MISSING_GEMINI_API_KEY');
  }

  let model = params.requestedModel ? normalizeGeminiModelName(params.requestedModel) : 'models/gemini-1.5-flash';
  if (params.autoDetectModel && !params.requestedModel) {
    try {
      const detection = await detectGeminiModel(params.apiKey, params.freeTierMode);
      model = detection.detectedModel;
    } catch {
      model = params.freeTierMode ? 'models/gemini-1.5-flash' : 'models/gemini-2.0-flash';
    }
  }

  let data: unknown;
  try {
    data = await callGeminiGenerateContent({
      apiKey: params.apiKey,
      model,
      body: geminiRequestBody({ ...params, withSchema: true })
    });
  } catch (error) {
    // Some older Gemini model revisions reject responseSchema. Retry once with JSON MIME only.
    if (error instanceof ProviderError && error.code === 'INVALID_IMAGE_OR_MODEL') {
      data = await callGeminiGenerateContent({
        apiKey: params.apiKey,
        model,
        body: geminiRequestBody({ ...params, withSchema: false })
      });
    } else {
      throw error;
    }
  }

  const text = extractGeminiText(data);
  const parsed = extractJsonFromText(text);
  const analysis = normalizeAnalysis(parsed);

  return {
    analysis,
    provider: 'Gemini' as const,
    model: displayModelName(model)
  };
}

export function extractGeminiText(data: unknown) {
  const candidate = (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>; promptFeedback?: unknown })
    .candidates?.[0];
  const text = candidate?.content?.parts?.map((part) => part.text || '').join('\n').trim();

  if (!text) {
    const finishReason = candidate?.finishReason ? ` Finish reason: ${candidate.finishReason}.` : '';
    throw new ProviderError(`Gemini returned an empty response.${finishReason}`, 502, 'EMPTY_PROVIDER_RESPONSE');
  }

  return text;
}

export async function summarizeWithGroq(params: {
  apiKey: string;
  analysis: CropAnalysis;
  language: AdvisoryLanguage;
  freeTierMode: boolean;
  requestedModel?: string;
}) {
  if (!params.apiKey) {
    throw new ProviderError('Groq API key is missing. Falling back to Gemini if available.', 401, 'MISSING_GROQ_API_KEY');
  }

  let model = params.requestedModel || 'llama-3.1-8b-instant';
  try {
    if (!params.requestedModel) {
      const detection = await detectGroqModel(params.apiKey, params.freeTierMode);
      model = detection.detectedModel;
    }
  } catch {
    model = 'llama-3.1-8b-instant';
  }

  const userPrompt = `Rewrite this CropGuard AI crop analysis into a short, practical farmer advisory. Language: ${params.language}. Include: likely issue, severity, immediate safe actions, prevention, monitoring, and expert consultation warning. Keep it ${params.freeTierMode ? 'under 180 words' : 'clear and detailed but concise'}. Do not add chemical dosage instructions.\n\nAnalysis JSON:\n${JSON.stringify(params.analysis, null, 2)}`;

  const response = await fetchWithTimeout(`${GROQ_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      max_tokens: params.freeTierMode ? 450 : 700,
      messages: [
        { role: 'system', content: GROQ_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ]
    })
  }, 30000);

  const data = await providerJson(response);
  if (!response.ok) {
    const message = data?.error?.message || 'Groq could not generate a farmer-friendly summary.';
    throw new ProviderError(message, response.status, response.status === 429 ? 'RATE_LIMIT' : 'GROQ_PROVIDER_ERROR');
  }

  const summary = data?.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new ProviderError('Groq returned an empty summary.', 502, 'EMPTY_PROVIDER_RESPONSE');
  }

  return {
    summary,
    provider: 'Groq' as const,
    model
  };
}

export async function summarizeWithGemini(params: {
  apiKey: string;
  analysis: CropAnalysis;
  language: AdvisoryLanguage;
  freeTierMode: boolean;
  requestedModel?: string;
}) {
  if (!params.apiKey) {
    throw new ProviderError('Gemini API key is required for fallback advisory generation.', 401, 'MISSING_GEMINI_API_KEY');
  }

  const model = normalizeGeminiModelName(params.requestedModel || 'models/gemini-1.5-flash');
  const body = {
    systemInstruction: {
      parts: [{ text: GROQ_SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Rewrite this CropGuard AI crop analysis into simple farmer-friendly language. Language: ${params.language}. Keep it short, practical, calm, and safe. Do not claim final diagnosis and do not include chemical dosage instructions.\n\n${JSON.stringify(params.analysis, null, 2)}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: params.freeTierMode ? 650 : 900
    }
  };

  const data = await callGeminiGenerateContent({ apiKey: params.apiKey, model, body, timeoutMs: 30000 });
  const summary = extractGeminiText(data);
  return {
    summary,
    provider: 'Gemini' as const,
    model: displayModelName(model)
  };
}

export function validateImageFile(file: File) {
  const supported = ['image/jpeg', 'image/png', 'image/webp'];
  if (!file) throw new ProviderError('Invalid image. Please upload a JPG, PNG, or WEBP crop image.', 400, 'INVALID_IMAGE');
  if (!supported.includes(file.type)) {
    throw new ProviderError('Unsupported image format. Please use JPG, PNG, or WEBP.', 400, 'UNSUPPORTED_IMAGE_FORMAT');
  }
  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new ProviderError('Image too large. Please upload an image smaller than 8 MB.', 413, 'IMAGE_TOO_LARGE');
  }
}

export async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString('base64');
}
