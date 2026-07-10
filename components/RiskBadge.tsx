import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  Low: 'border-emerald-300/35 bg-emerald-400/12 text-emerald-100',
  Medium: 'border-amber-300/35 bg-amber-400/12 text-amber-100',
  High: 'border-orange-300/35 bg-orange-400/12 text-orange-100',
  Urgent: 'border-red-300/35 bg-red-400/12 text-red-100',
  'Needs Expert Review': 'border-sky-300/35 bg-sky-400/12 text-sky-100'
};

export default function RiskBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold', styles[value] || styles['Needs Expert Review'], className)}>
      <ShieldAlert className="h-3.5 w-3.5" />
      {value || 'Needs Expert Review'} Risk
    </span>
  );
}
