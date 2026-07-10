import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PreventionPlanProps {
  preventionPlan: string[];
  monitoringPlan: string[];
}

export default function PreventionPlan({ preventionPlan, monitoringPlan }: PreventionPlanProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Prevention & Monitoring Plan</h3>
          <p className="text-xs text-emerald-50/60">Reduce spread risk and track symptom changes.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-100">Prevention Plan</p>
          <ul className="grid gap-2">
            {(preventionPlan.length ? preventionPlan : ['Improve sanitation, spacing, crop rotation, and irrigation practices.']).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-emerald-50/70">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-crop-neon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-100">Monitoring Plan</p>
          <ul className="grid gap-2">
            {(monitoringPlan.length ? monitoringPlan : ['Inspect nearby plants regularly and document symptom progression with photos.']).map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-emerald-50/70">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-crop-neon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
