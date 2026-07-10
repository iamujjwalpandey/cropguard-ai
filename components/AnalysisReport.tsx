'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  HelpCircle,
  Leaf,
  Microscope,
  RotateCcw,
  Sprout,
  Stethoscope,
  UploadCloud,
  type LucideIcon
} from 'lucide-react';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import DisclaimerBox from '@/components/DisclaimerBox';
import PreventionPlan from '@/components/PreventionPlan';
import ReportExporter from '@/components/ReportExporter';
import RiskBadge from '@/components/RiskBadge';
import SeverityBadge from '@/components/SeverityBadge';
import TreatmentPlan from '@/components/TreatmentPlan';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ADVISORY_DISCLAIMER, PRODUCT_NAME } from '@/lib/constants';
import type { StoredReport } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

function InfoCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 print-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-white print-text">{title}</h3>
          <div className="mt-2 text-sm leading-6 text-emerald-50/70 print-text">{children}</div>
        </div>
      </div>
    </Card>
  );
}

function ListBlock({ items }: { items: string[] }) {
  const normalized = items?.length ? items : ['Not available. Expert verification is recommended.'];
  return (
    <ul className="grid gap-2">
      {normalized.map((item) => (
        <li key={item} className="flex gap-2">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-crop-neon" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AnalysisReport({ report }: { report: StoredReport }) {
  const { analysis } = report;
  const [mode, setMode] = useState<'farmer' | 'expert'>(report.advisoryMode === 'Expert' ? 'expert' : 'farmer');
  const unclear =
    analysis.confidenceLabel === 'Needs Expert Verification' ||
    analysis.severityLevel === 'Unknown' ||
    analysis.possibleDisease.toLowerCase().includes('unknown');

  return (
    <div className="grid gap-6 print-card">
      <Card className="overflow-hidden print-card">
        <div className="border-b border-emerald-400/15 bg-emerald-400/8 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-crop-neon">{PRODUCT_NAME} Report</p>
              <h1 className="mt-2 text-3xl font-black text-white print-text sm:text-4xl">Crop Health Summary</h1>
              <p className="mt-2 text-sm text-emerald-50/60 print-text">Generated {formatDateTime(report.createdAt)} • {report.provider}{report.model ? ` • ${report.model}` : ''}</p>
            </div>
            <ReportExporter report={report} />
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[420px_1fr]">
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-black scanner-corners shadow-glow">
              {report.imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={report.imageDataUrl} alt="Analyzed crop preview" className="max-h-[520px] w-full object-contain" />
              ) : (
                <div className="flex h-72 items-center justify-center text-emerald-50/50">No image preview available</div>
              )}
              <div className="pointer-events-none absolute inset-0 scanner-grid opacity-25" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <SeverityBadge value={analysis.severityLevel} />
              <RiskBadge value={analysis.riskLevel} />
              <ConfidenceBadge value={analysis.confidenceLabel} />
            </div>
          </div>

          <div className="grid gap-5">
            {unclear && (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Could not clearly detect crop symptoms. Please upload a closer, well-lit image of the affected leaf or plant, and consult an expert for verification.</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <InfoCard icon={Leaf} title="Possible Disease">
                <p className="font-semibold text-white print-text">{analysis.possibleDisease}</p>
                <p className="mt-1 text-xs text-emerald-50/55 print-text">Category: {analysis.diseaseCategory}</p>
              </InfoCard>
              <InfoCard icon={Clock} title="Estimated Urgency">
                {analysis.estimatedUrgency}
              </InfoCard>
              <InfoCard icon={Sprout} title="Spread Risk">
                {analysis.spreadRisk}
              </InfoCard>
            </div>

            <Card className="p-5 print-card">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-crop-neon" />
                  <h2 className="font-bold text-white print-text">Advisory Mode</h2>
                </div>
                <div className="flex rounded-full border border-emerald-400/20 bg-black/25 p-1 no-print">
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${mode === 'farmer' ? 'bg-emerald-400 text-black' : 'text-emerald-50/65'}`}
                    onClick={() => setMode('farmer')}
                  >
                    Farmer
                  </button>
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${mode === 'expert' ? 'bg-emerald-400 text-black' : 'text-emerald-50/65'}`}
                    onClick={() => setMode('expert')}
                  >
                    Expert
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-4 text-sm leading-7 text-emerald-50/75 print-text">
                {mode === 'farmer' ? analysis.farmerFriendlyExplanation : analysis.expertExplanation}
              </div>
              {report.simplifiedSummary && (
                <div className="mt-4 rounded-2xl border border-crop-neon/25 bg-crop-neon/10 p-4 text-sm leading-7 text-emerald-50/80 print-text">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-crop-neon">
                    Fast simplified advisory{report.summaryProvider ? ` • ${report.summaryProvider}` : ''}
                  </p>
                  {report.simplifiedSummary}
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard icon={Microscope} title="Visible Symptoms Detected">
          <ListBlock items={analysis.visibleSymptoms} />
        </InfoCard>
        <InfoCard icon={Brain} title="Possible Causes">
          <ListBlock items={analysis.possibleCauses} />
        </InfoCard>
      </div>

      <TreatmentPlan
        organicTreatment={analysis.organicTreatment}
        nextSteps={analysis.nextSteps}
        chemicalTreatmentWarning={analysis.chemicalTreatmentWarning}
      />

      <PreventionPlan preventionPlan={analysis.preventionPlan} monitoringPlan={analysis.monitoringPlan} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard icon={Stethoscope} title="When to Consult an Expert">
          {analysis.whenToConsultExpert}
        </InfoCard>
        <InfoCard icon={HelpCircle} title="Limitations">
          {analysis.limitations}
        </InfoCard>
      </div>

      <DisclaimerBox variant="warning" text={analysis.disclaimer || ADVISORY_DISCLAIMER} />

      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-emerald-400/15 bg-white/[0.04] p-5 sm:flex-row sm:items-center no-print">
        <div>
          <h3 className="font-bold text-white">Ready to analyze another image?</h3>
          <p className="mt-1 text-sm text-emerald-50/60">Use live scanning or upload another close, well-lit crop image.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/scan">
              <RotateCcw className="h-4 w-4" />
              Analyze Another Image
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/upload">
              <UploadCloud className="h-4 w-4" />
              Upload Image
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
