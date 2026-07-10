import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}

export default function PageHeader({ eyebrow = 'CropGuard AI', title, description, className }: PageHeaderProps) {
  return (
    <section className={cn('container py-10 sm:py-14', className)}>
      <Badge>{eyebrow}</Badge>
      <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-emerald-50/70 sm:text-lg">{description}</p>
    </section>
  );
}
