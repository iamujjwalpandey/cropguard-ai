import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ADVISORY_DISCLAIMER, MOTTO, PRODUCT_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL('https://cropguard-ai.vercel.app'),
  title: {
    default: `${PRODUCT_NAME} — ${MOTTO}`,
    template: `%s | ${PRODUCT_NAME}`
  },
  description:
    'A premium privacy-first AI crop health scanner using Gemini Vision, Groq, browser camera APIs, and exportable advisory reports.',
  keywords: [
    'CropGuard AI',
    'AI crop scanner',
    'Gemini Vision',
    'Groq',
    'agritech',
    'plant disease detection',
    'Next.js'
  ],
  authors: [{ name: PRODUCT_NAME }],
  icons: {
    icon: '/cropguard-logo.svg'
  },
  openGraph: {
    title: `${PRODUCT_NAME} — ${MOTTO}`,
    description:
      'Scan crop images in real time and get AI-powered insights about possible diseases, severity, prevention, and treatment guidance.',
    type: 'website',
    images: ['/og-image.svg']
  }
};

export const viewport: Viewport = {
  themeColor: '#03150e',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="app-bg">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-40 field-grid animate-gridMove" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <div className="sr-only">{ADVISORY_DISCLAIMER}</div>
      </body>
    </html>
  );
}
