'use client';

import { getProviderHeaders } from '@/lib/api-keys';
import type { AdvisoryLanguage, AdvisoryMode, AnalysisApiResponse, StoredReport, SummaryApiResponse } from '@/lib/types';
import { fileToDataUrl } from '@/lib/utils';

export class ClientApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

async function parseError(response: Response) {
  try {
    const data = await response.json();
    return new ClientApiError(data.error || 'Request failed.', data.code);
  } catch {
    return new ClientApiError('Network failure. Please check your connection and try again.');
  }
}

export async function analyzeImageFile(params: {
  file: File;
  imageDataUrl?: string;
  language: AdvisoryLanguage;
  advisoryMode: AdvisoryMode;
  generateSummary?: boolean;
}) {
  const formData = new FormData();
  formData.append('image', params.file);
  formData.append('language', params.language);
  formData.append('advisoryMode', params.advisoryMode);

  const headers = getProviderHeaders();
  const response = await fetch('/api/analyze-crop', {
    method: 'POST',
    headers,
    body: formData
  });

  if (!response.ok) throw await parseError(response);
  const data = (await response.json()) as AnalysisApiResponse;

  let simplifiedSummary: string | undefined;
  let summaryProvider: StoredReport['summaryProvider'] = 'None';
  let summaryModel: string | undefined;

  const shouldSummarize = params.generateSummary ?? true;
  if (shouldSummarize) {
    try {
      const summaryResponse = await fetch('/api/summarize-advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ analysis: data.analysis, language: params.language })
      });
      if (summaryResponse.ok) {
        const summaryData = (await summaryResponse.json()) as SummaryApiResponse;
        simplifiedSummary = summaryData.summary;
        summaryProvider = summaryData.provider;
        summaryModel = summaryData.model;
      }
    } catch {
      // Optional summary failure should not block the main crop analysis report.
    }
  }

  const report: StoredReport = {
    analysis: data.analysis,
    imageDataUrl: params.imageDataUrl || (await fileToDataUrl(params.file)),
    provider: summaryProvider === 'Groq' ? 'Gemini + Groq' : 'Gemini',
    model: data.model,
    summaryProvider,
    summaryModel,
    simplifiedSummary,
    language: params.language,
    advisoryMode: params.advisoryMode,
    createdAt: new Date().toISOString()
  };

  window.sessionStorage.setItem('cropguard-latest-report', JSON.stringify(report));
  return report;
}
