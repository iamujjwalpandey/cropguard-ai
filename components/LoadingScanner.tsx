'use client';

import { useEffect, useState } from 'react';
import { Loader2, ScanLine } from 'lucide-react';
import { LOADING_MESSAGES } from '@/lib/constants';
import { Card } from '@/components/ui/card';

interface LoadingScannerProps {
  title?: string;
  messages?: string[];
}

export default function LoadingScanner({ title = 'Analyzing crop image', messages = LOADING_MESSAGES }: LoadingScannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % messages.length), 1500);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-0 scanner-grid opacity-35" />
      <div className="scan-line animate-scan" />
      <div className="relative z-10 flex flex-col items-center justify-center py-10 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 shadow-glow">
          <ScanLine className="h-9 w-9 text-crop-neon" />
          <Loader2 className="absolute h-20 w-20 animate-spin text-emerald-400/25" />
        </div>
        <h3 className="mt-6 text-2xl font-black text-white">{title}</h3>
        <p className="mt-3 text-sm font-semibold text-crop-neon">{messages[index]}</p>
        <p className="mt-2 max-w-md text-xs leading-5 text-emerald-50/60">
          CropGuard AI is using Gemini Vision for image reasoning and optional Groq rewriting. Images are processed temporarily and are not stored in a database.
        </p>
      </div>
    </Card>
  );
}
