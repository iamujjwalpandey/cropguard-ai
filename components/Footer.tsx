import Link from 'next/link';
import { Code2, Leaf, ShieldCheck } from 'lucide-react';
import { ADVISORY_DISCLAIMER, MOTTO, PRODUCT_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-400/15 bg-black/30 no-print">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10">
              <Leaf className="h-5 w-5 text-crop-neon" />
            </div>
            <div>
              <p className="font-black text-white">{PRODUCT_NAME}</p>
              <p className="text-xs font-semibold text-crop-neon">{MOTTO}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/65">
            Privacy-first AI crop health scanning with Gemini Vision, optional Groq summaries, browser camera access,
            and exportable advisory reports. No database, no permanent crop image storage.
          </p>
          <p className="mt-3 text-xs leading-5 text-amber-100/75">{ADVISORY_DISCLAIMER}</p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Product</p>
          <div className="grid gap-2 text-sm text-emerald-50/65">
            <Link href="/scan" className="hover:text-crop-neon">Real-time scan</Link>
            <Link href="/upload" className="hover:text-crop-neon">Upload image</Link>
            <Link href="/guide" className="hover:text-crop-neon">Farmer guide</Link>
            <Link href="/settings" className="hover:text-crop-neon">AI settings</Link>
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Architecture</p>
          <div className="grid gap-2 text-sm text-emerald-50/65">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-crop-neon" /> No database</span>
            <span>Temporary session reports</span>
            <span>Local browser API settings</span>
            <span className="inline-flex items-center gap-2"><Code2 className="h-4 w-4 text-crop-neon" /> GitHub ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
