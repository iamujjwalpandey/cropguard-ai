'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Camera, Home, Info, Leaf, Menu, UploadCloud, X } from 'lucide-react';
import { useState } from 'react';
import SettingsIcon from '@/components/SettingsIcon';
import { Button } from '@/components/ui/button';
import { MOTTO, PRODUCT_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/scan', label: 'Scan Crop', icon: Camera },
  { href: '/upload', label: 'Upload', icon: UploadCloud },
  { href: '/guide', label: 'Guide', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info }
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-400/15 bg-black/45 backdrop-blur-2xl no-print">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 shadow-glow">
            <Leaf className="h-7 w-7 text-crop-neon" />
            <span className="absolute inset-1 rounded-xl border border-emerald-300/15" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight text-white sm:text-2xl">{PRODUCT_NAME}</p>
            <p className="text-xs font-bold text-crop-neon sm:text-sm">{MOTTO}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-emerald-50/80 transition hover:bg-emerald-400/10 hover:text-white',
                  active && 'border border-emerald-400/25 bg-emerald-400/12 text-white shadow-glow'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-emerald-400/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-emerald-100/70">
            No DB • AI Advisory
          </div>
          <SettingsIcon active={pathname === '/settings'} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <SettingsIcon active={pathname === '/settings'} />
          <Button variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-emerald-400/15 bg-black/80 lg:hidden">
          <div className="container grid gap-2 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-emerald-50/80 transition hover:bg-emerald-400/10 hover:text-white',
                    active && 'border border-emerald-400/25 bg-emerald-400/12 text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
