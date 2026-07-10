'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsIconProps {
  active?: boolean;
  className?: string;
}

export default function SettingsIcon({ active, className }: SettingsIconProps) {
  return (
    <Link
      href="/settings"
      aria-label="Open CropGuard AI settings"
      className={cn(
        'relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-white/[0.055] text-emerald-50 transition hover:border-emerald-300/50 hover:bg-emerald-400/10 hover:text-white',
        active && 'border-emerald-300/70 bg-emerald-400/15 shadow-glow',
        className
      )}
    >
      <Settings className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-crop-neon shadow-glow" />
    </Link>
  );
}
