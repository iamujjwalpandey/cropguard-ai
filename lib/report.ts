import { ADVISORY_DISCLAIMER, PRODUCT_NAME, MOTTO } from '@/lib/constants';
import type { CropAnalysis, StoredReport } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

function list(items: string[] | undefined) {
  if (!items?.length) return '- Not available';
  return items.map((item) => `- ${item}`).join('\n');
}

export function analysisToMarkdown(report: StoredReport) {
  const { analysis } = report;
  const imageBlock = report.imageDataUrl
    ? `\n<img src="${report.imageDataUrl}" alt="Crop image preview" width="420" />\n`
    : '\n_Image preview was not included._\n';

  return `# ${PRODUCT_NAME} Crop Health Report\n\n**Motto:** ${MOTTO}\n\n**Generated:** ${formatDateTime(report.createdAt)}\n\n**AI Provider:** ${report.provider}${report.model ? ` (${report.model})` : ''}\n\n**Language:** ${report.language}\n\n${imageBlock}\n\n## Crop Health Summary\n\n${analysis.cropHealthStatus || 'Not available'}\n\n## Possible Disease\n\n${analysis.possibleDisease || 'Unknown / Needs expert verification'}\n\n## Disease Category\n\n${analysis.diseaseCategory || 'Unknown'}\n\n## Visible Symptoms Detected\n\n${list(analysis.visibleSymptoms)}\n\n## Severity Level\n\n${analysis.severityLevel || 'Unknown'}\n\n## Risk Level\n\n${analysis.riskLevel || 'Needs Expert Review'}\n\n## AI Confidence Label\n\n${analysis.confidenceLabel || 'Needs Expert Verification'}\n\n## Possible Causes\n\n${list(analysis.possibleCauses)}\n\n## Spread Risk\n\n${analysis.spreadRisk || 'Not available'}\n\n## Estimated Urgency\n\n${analysis.estimatedUrgency || 'Not available'}\n\n## Cure Suggestions\n\n${list(analysis.nextSteps)}\n\n## Organic Treatment Suggestions\n\n${list(analysis.organicTreatment)}\n\n## Chemical Treatment Safety Warning\n\n${analysis.chemicalTreatmentWarning || ADVISORY_DISCLAIMER}\n\n## Prevention Plan\n\n${list(analysis.preventionPlan)}\n\n## Monitoring Plan\n\n${list(analysis.monitoringPlan)}\n\n## Farmer-Friendly Explanation\n\n${analysis.farmerFriendlyExplanation || 'Not available'}\n\n${report.simplifiedSummary ? `## Simplified Advisory\n\n${report.simplifiedSummary}\n\n` : ''}## Expert Explanation\n\n${analysis.expertExplanation || 'Not available'}\n\n## When to Consult an Expert\n\n${analysis.whenToConsultExpert || 'Consult a certified agriculture expert for severe, unclear, or fast-spreading symptoms.'}\n\n## Limitations\n\n${analysis.limitations || 'AI image analysis may miss field context, hidden symptoms, and overlapping causes.'}\n\n## Disclaimer\n\n${analysis.disclaimer || ADVISORY_DISCLAIMER}\n`;
}

export function analysisToPlainText(report: StoredReport) {
  return analysisToMarkdown(report)
    .replace(/<img[^>]+>/g, '[Crop image preview included in exported Markdown if supported]')
    .replace(/^#+\s/gm, '')
    .replace(/\*\*/g, '');
}

export function createEmptyAnalysis(overrides: Partial<CropAnalysis> = {}): CropAnalysis {
  return {
    cropHealthStatus: 'Unknown crop health status. Expert verification is recommended.',
    possibleDisease: 'Unknown / Needs expert verification',
    diseaseCategory: 'Unknown',
    visibleSymptoms: [],
    severityLevel: 'Unknown',
    riskLevel: 'Needs Expert Review',
    confidenceLabel: 'Needs Expert Verification',
    possibleCauses: [],
    spreadRisk: 'Unknown because the available image or context is insufficient.',
    estimatedUrgency: 'Consult an expert if symptoms are spreading or crop value is high.',
    farmerFriendlyExplanation: 'The image does not provide enough clear information for a confident advisory. Please capture a closer, well-lit image and consult a local agriculture expert if symptoms are serious.',
    expertExplanation: 'Insufficient visual evidence for reliable differential diagnosis from image-only analysis.',
    organicTreatment: [],
    chemicalTreatmentWarning: ADVISORY_DISCLAIMER,
    preventionPlan: [],
    monitoringPlan: [],
    nextSteps: ['Retake a close, well-lit image of the affected plant area.', 'Check nearby plants for similar symptoms.', 'Consult a certified agriculture expert if symptoms are severe or spreading.'],
    whenToConsultExpert: 'Consult an expert when symptoms are severe, unclear, or spreading quickly.',
    limitations: 'Image-only AI analysis cannot confirm a final diagnosis and may miss field context.',
    disclaimer: ADVISORY_DISCLAIMER,
    ...overrides
  };
}
