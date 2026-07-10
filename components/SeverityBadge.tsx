import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  Healthy: 'border-emerald-300/35 bg-emerald-400/12 text-emerald-100',
  Mild: 'border-lime-300/35 bg-lime-400/12 text-lime-100',
  Moderate: 'border-amber-300/35 bg-amber-400/12 text-amber-100',
  Severe: 'border-orange-300/35 bg-orange-400/12 text-orange-100',
  Critical: 'border-red-300/35 bg-red-400/12 text-red-100',
  Unknown: 'border-slate-300/25 bg-slate-400/10 text-slate-100'
};

export default function SeverityBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold', styles[value] || styles.Unknown, className)}>
      <Activity className="h-3.5 w-3.5" />
      {value || 'Unknown'} Severity
    </span>
  );
}
