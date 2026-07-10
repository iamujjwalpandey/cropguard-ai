import { CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  'High Visual Match': 'border-emerald-300/35 bg-emerald-400/12 text-emerald-100',
  'Medium Visual Match': 'border-amber-300/35 bg-amber-400/12 text-amber-100',
  'Low Visual Match': 'border-orange-300/35 bg-orange-400/12 text-orange-100',
  'Needs Expert Verification': 'border-sky-300/35 bg-sky-400/12 text-sky-100'
};

export default function ConfidenceBadge({ value, className }: { value: string; className?: string }) {
  const Icon = value === 'High Visual Match' || value === 'Medium Visual Match' ? CheckCircle2 : HelpCircle;
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold', styles[value] || styles['Needs Expert Verification'], className)}>
      <Icon className="h-3.5 w-3.5" />
      {value || 'Needs Expert Verification'}
    </span>
  );
}
