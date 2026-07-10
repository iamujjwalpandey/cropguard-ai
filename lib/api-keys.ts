'use client';

import type { AiSettings } from '@/lib/types';
import { safeJsonParse } from '@/lib/utils';

export const SETTINGS_STORAGE_KEY = 'cropguard-ai-settings';

export const DEFAULT_SETTINGS: AiSettings = {
  geminiApiKey: '',
  groqApiKey: '',
  preferredProvider: 'auto',
  autoDetectModel: true,
  freeTierMode: true,
  activeProvider: 'Not configured',
  detectedGeminiModel: 'Not tested',
  detectedGroqModel: 'Not tested'
};

export function getAiSettings(): AiSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...safeJsonParse<Partial<AiSettings>>(stored, {}) };
}

export function saveAiSettings(settings: AiSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function clearAiSettings() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
}

export function getProviderHeaders() {
  const settings = getAiSettings();
  const headers: Record<string, string> = {};
  if (settings.geminiApiKey.trim()) headers['x-gemini-api-key'] = settings.geminiApiKey.trim();
  if (settings.groqApiKey.trim()) headers['x-groq-api-key'] = settings.groqApiKey.trim();
  headers['x-preferred-provider'] = settings.preferredProvider;
  headers['x-free-tier-mode'] = String(settings.freeTierMode);
  headers['x-auto-detect-model'] = String(settings.autoDetectModel);
  if (settings.detectedGeminiModel && settings.detectedGeminiModel !== 'Not tested') {
    headers['x-gemini-model'] = settings.detectedGeminiModel.replace(/^models\//, '');
  }
  if (settings.detectedGroqModel && settings.detectedGroqModel !== 'Not tested') {
    headers['x-groq-model'] = settings.detectedGroqModel;
  }
  return headers;
}
