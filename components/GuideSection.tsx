import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GuideSectionProps {
  title: string;
  points: string[];
  index?: number;
}

export default function GuideSection({ title, points, index }: GuideSectionProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {typeof index === 'number' && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-sm font-black text-crop-neon">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <ul className="mt-4 grid gap-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-emerald-50/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-crop-neon" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
