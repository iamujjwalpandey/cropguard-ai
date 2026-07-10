export type SeverityLevel = 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Critical' | 'Unknown';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Urgent' | 'Needs Expert Review';
export type ConfidenceLabel =
  | 'High Visual Match'
  | 'Medium Visual Match'
  | 'Low Visual Match'
  | 'Needs Expert Verification';

export type PreferredProvider = 'auto' | 'gemini' | 'groq';
export type AdvisoryLanguage = 'English' | 'Hindi' | 'Bilingual';
export type AdvisoryMode = 'Farmer-Friendly' | 'Expert';

export interface CropAnalysis {
  cropHealthStatus: string;
  possibleDisease: string;
  diseaseCategory: string;
  visibleSymptoms: string[];
  severityLevel: SeverityLevel | string;
  riskLevel: RiskLevel | string;
  confidenceLabel: ConfidenceLabel | string;
  possibleCauses: string[];
  spreadRisk: string;
  estimatedUrgency: string;
  farmerFriendlyExplanation: string;
  expertExplanation: string;
  organicTreatment: string[];
  chemicalTreatmentWarning: string;
  preventionPlan: string[];
  monitoringPlan: string[];
  nextSteps: string[];
  whenToConsultExpert: string;
  limitations: string;
  disclaimer: string;
}

export interface StoredReport {
  analysis: CropAnalysis;
  imageDataUrl?: string;
  provider: 'Gemini' | 'Gemini + Groq' | 'Groq' | 'Demo';
  model?: string;
  summaryProvider?: 'Gemini' | 'Groq' | 'None';
  summaryModel?: string;
  simplifiedSummary?: string;
  language: AdvisoryLanguage;
  advisoryMode: AdvisoryMode;
  createdAt: string;
}

export interface AiSettings {
  geminiApiKey: string;
  groqApiKey: string;
  preferredProvider: PreferredProvider;
  autoDetectModel: boolean;
  freeTierMode: boolean;
  activeProvider: string;
  detectedGeminiModel: string;
  detectedGroqModel: string;
  lastGeminiStatus?: ProviderTestResult;
  lastGroqStatus?: ProviderTestResult;
}

export interface ProviderTestResult {
  ok: boolean;
  provider: 'Gemini' | 'Groq';
  message: string;
  detectedModel?: string;
  availableModels?: string[];
  statusCode?: number;
  testedAt: string;
}

export interface ApiErrorPayload {
  error: string;
  code?: string;
  detail?: string;
}

export interface AnalysisApiResponse {
  analysis: CropAnalysis;
  provider: 'Gemini';
  model: string;
  rawProviderResponse?: unknown;
}

export interface SummaryApiResponse {
  summary: string;
  provider: 'Gemini' | 'Groq' | 'None';
  model?: string;
}
