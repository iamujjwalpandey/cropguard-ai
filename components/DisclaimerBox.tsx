import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { ADVISORY_DISCLAIMER } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DisclaimerBoxProps {
  variant?: 'default' | 'warning';
  className?: string;
  text?: string;
}

export default function DisclaimerBox({ variant = 'default', className, text = ADVISORY_DISCLAIMER }: DisclaimerBoxProps) {
  const Icon = variant === 'warning' ? AlertTriangle : ShieldCheck;
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 text-sm leading-6',
        variant === 'warning'
          ? 'border-amber-300/30 bg-amber-400/10 text-amber-50'
          : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-50/85',
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{text}</p>
      </div>
    </div>
  );
}
