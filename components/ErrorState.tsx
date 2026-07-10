import Link from 'next/link';
import { AlertTriangle, ArrowRight, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorStateProps {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function ErrorState({ title, message, actionHref = '/upload', actionLabel = 'Upload Image' }: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-300/25 bg-amber-400/10 text-amber-200">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-emerald-50/70">{message}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href={actionHref}>
            <UploadCloud className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/scan">
            Start Crop Scan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
