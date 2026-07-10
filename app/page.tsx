'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, CheckCircle2, DatabaseZap, Leaf, Lock, ScanLine, ShieldCheck, Sparkles, UploadCloud, type LucideIcon } from 'lucide-react';
import DisclaimerBox from '@/components/DisclaimerBox';
import FeatureCard from '@/components/FeatureCard';
import Hero3D from '@/components/Hero3D';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FEATURE_CARDS, HOW_IT_WORKS, MOTTO, PRODUCT_NAME, TECH_STACK } from '@/lib/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }}>
          <Badge className="mb-6 gap-2">
            <span className="h-2 w-2 rounded-full bg-crop-neon shadow-glow" />
            AI Powered • Real-Time • Advisory
          </Badge>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            AI Crop Health Scanner for <span className="gradient-text neon-text">Smarter Farming</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/75">
            Scan crop images in real time and get AI-powered insights about possible diseases, severity, prevention, and treatment guidance.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/scan">
                <ScanLine className="h-5 w-5" />
                Start Crop Scan
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/upload">
                <UploadCloud className="h-5 w-5" />
                Upload Crop Image
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <StatCard icon={Leaf} value="No database" label="Privacy-first architecture" />
            <StatCard icon={Sparkles} value="Gemini Vision" label="Multimodal AI workflow" />
            <StatCard icon={ShieldCheck} value="Safe advisory" label="Expert consultation warning" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.12 }}>
          <Hero3D />
        </motion.div>
      </section>

      <section className="container py-16">
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <Badge>How it works</Badge>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">From crop image to actionable advisory</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/65">
              CropGuard AI combines a farmer-friendly capture flow with multimodal LLM reasoning, structured JSON validation, and exportable reports.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/guide">
              Read Farmer Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOW_IT_WORKS.map((step, index) => (
            <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.07 }}>
              <Card className="h-full p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-emerald-100/50">Step {index + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-50/65">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge>Features</Badge>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">A real AI agritech SaaS experience</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-50/65">
            Designed to feel like a premium production app: camera scanning, upload flow, provider settings, privacy-first architecture, and report export.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {FEATURE_CARDS.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 sm:p-8">
            <Badge>AI analysis capabilities</Badge>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Structured crop health intelligence</h2>
            <p className="mt-4 text-sm leading-7 text-emerald-50/70">
              Gemini returns a validated JSON report with possible disease, visible symptoms, severity level, risk level, spread risk, causes, organic options, prevention, monitoring, limitations, and disclaimer.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                'Possible disease and disease category',
                'Visible symptoms and likely causes',
                'Severity and risk labels without fake numeric accuracy',
                'Farmer-friendly and expert explanations',
                'Organic treatment options and chemical safety warning',
                'Next steps and expert consultation trigger points'
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-3 text-sm text-emerald-50/75">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-crop-neon" />
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 scanner-grid opacity-20" />
            <div className="relative grid gap-4 md:grid-cols-2">
              <DashboardCard title="Disease advisory" value="Possible issue" detail="AI advisory only" />
              <DashboardCard title="Severity label" value="Mild / Moderate / Severe" detail="Qualitative classification" />
              <DashboardCard title="Risk level" value="Low → Urgent" detail="Includes spread risk" />
              <DashboardCard title="Export" value="Markdown + PDF" detail="Copy-to-clipboard included" />
            </div>
            <div className="relative mt-6 rounded-3xl border border-emerald-400/15 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-crop-neon">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-white">Real-time camera crop scanner</p>
                  <p className="text-sm text-emerald-50/60">MediaDevices API with capture, retake, analyze, and camera switching support.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 sm:p-8 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
                <Lock className="h-7 w-7" />
              </div>
              <div>
                <Badge>Privacy-first no-database</Badge>
                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">No permanent crop image or report storage</h2>
                <p className="mt-4 text-sm leading-7 text-emerald-50/70">
                  CropGuard AI intentionally avoids Supabase, Firebase, MongoDB, PostgreSQL, MySQL, and all permanent databases. API settings are saved only in browser local storage for demo mode. Reports live in temporary session state unless the user exports them.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
              <DatabaseZap className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-white">Temporary by design</h3>
            <p className="mt-3 text-sm leading-7 text-emerald-50/65">
              Camera frames and uploaded crop images are processed on-demand and not persisted in an application database.
            </p>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <Badge>Technology stack</Badge>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">Recruiter-grade engineering choices</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="rounded-full border border-emerald-400/20 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-emerald-50/75">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <DisclaimerBox variant="warning" />
      </section>

      <section className="container pb-20 pt-8">
        <Card className="relative overflow-hidden p-8 text-center sm:p-12">
          <div className="absolute inset-0 bg-radial-emerald opacity-80" />
          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-crop-neon">{PRODUCT_NAME}</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-6xl">{MOTTO}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-emerald-50/70">
              Start with a camera scan or upload a crop image to generate a safe, structured, exportable advisory report.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/scan">Start Crop Scan <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/settings">Configure AI Keys</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-emerald-400/15 bg-white/[0.04] p-4 backdrop-blur-xl">
      <Icon className="h-6 w-6 text-crop-neon" />
      <p className="mt-3 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-emerald-50/55">{label}</p>
    </div>
  );
}

function DashboardCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-emerald-400/15 bg-black/25 p-5 backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100/45">{title}</p>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm text-emerald-50/55">{detail}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-3/4 rounded-full bg-premium-gradient" />
      </div>
    </div>
  );
}
