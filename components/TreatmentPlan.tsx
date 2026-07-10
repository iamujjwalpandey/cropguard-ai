import { CheckCircle2, FlaskConical, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DisclaimerBox from '@/components/DisclaimerBox';

interface TreatmentPlanProps {
  organicTreatment: string[];
  nextSteps: string[];
  chemicalTreatmentWarning: string;
}

export default function TreatmentPlan({ organicTreatment, nextSteps, chemicalTreatmentWarning }: TreatmentPlanProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Cure & Treatment Suggestions</h3>
          <p className="text-xs text-emerald-50/60">Safe advisory support, not a final prescription.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-100">Immediate Next Steps</p>
          <ul className="grid gap-2">
            {(nextSteps.length ? nextSteps : ['Retake a clearer image and consult an agriculture expert if symptoms are severe.']).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-emerald-50/70">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-crop-neon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-100">Organic Treatment Options</p>
          <ul className="grid gap-2">
            {(organicTreatment.length ? organicTreatment : ['Use sanitation, airflow improvement, and expert-verified organic controls when appropriate.']).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-emerald-50/70">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-crop-neon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DisclaimerBox className="mt-5" variant="warning" text={chemicalTreatmentWarning} />
      <div className="mt-3 flex items-center gap-2 text-xs text-amber-100/70">
        <ShieldAlert className="h-4 w-4" />
        CropGuard AI does not provide exact chemical dosage instructions.
      </div>
    </Card>
  );
}
