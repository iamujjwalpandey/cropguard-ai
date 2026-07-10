import { BrainCircuit, Camera, CheckCircle2, Cloud, Code2, FileText, Lock, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import DisclaimerBox from '@/components/DisclaimerBox';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { PRODUCT_NAME, TECH_STACK } from '@/lib/constants';

const demonstrations = [
  'Computer vision workflow',
  'AI image reasoning',
  'Multimodal LLM integration',
  'Prompt engineering',
  'Browser camera access',
  'No-database architecture',
  'Responsible AI design',
  'Report generation',
  'Modern responsive UI',
  'Vercel deployment',
  'GitHub-ready documentation'
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About CropGuard AI"
        title="A privacy-first AI agritech scanner built for real portfolios"
        description="CropGuard AI is a no-database AI crop health scanner built using Next.js, Gemini Vision, Groq, browser camera APIs, and modern frontend technologies."
      />
      <section className="container pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-emerald-400/25 bg-emerald-400/10 text-crop-neon">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black text-white">What is {PRODUCT_NAME}?</h2>
            <p className="mt-4 text-sm leading-7 text-emerald-50/70">
              CropGuard AI helps farmers, agriculture students, researchers, crop advisors, and agritech teams scan leaves or plants using camera capture or image upload. Gemini Vision analyzes visible symptoms and returns a structured crop health report. Groq can optionally rewrite the analysis into simple farmer-friendly English or Hindi.
            </p>
            <p className="mt-4 text-sm leading-7 text-emerald-50/70">
              The project is designed as a serious recruiter-grade agritech SaaS demo: premium UI, real browser camera workflow, safe AI output, API provider settings, no database, and exportable advisory reports.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <Lock className="h-8 w-8 text-crop-neon" />
            <h3 className="mt-5 text-2xl font-black text-white">Privacy-first architecture</h3>
            <p className="mt-3 text-sm leading-7 text-emerald-50/70">
              No permanent database is used. Browser local storage is used only for demo API settings. Crop images and reports remain temporary session data unless the user exports them.
            </p>
            <div className="mt-5 grid gap-3 text-sm text-emerald-50/70">
              <div className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-crop-neon" /> No Supabase / Firebase / database</div>
              <div className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-crop-neon" /> Server-side environment variables supported</div>
              <div className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-crop-neon" /> Downloadable reports</div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AboutTile icon={BrainCircuit} title="AI reasoning" text="Structured Gemini Vision reports with schema validation, parsing recovery, and safe fallbacks." />
          <AboutTile icon={Camera} title="Camera workflow" text="MediaDevices API capture flow with permission handling, retake, and mobile back-camera preference." />
          <AboutTile icon={FileText} title="Report export" text="Copy, Markdown download, and print/save PDF export for farmer advisory reports." />
          <AboutTile icon={ShieldCheck} title="Responsible AI" text="No final diagnosis claims, chemical safety warning, limitations, and expert consultation guidance." />
        </div>

        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Code2 className="mt-1 h-7 w-7 shrink-0 text-crop-neon" />
            <div>
              <h2 className="text-2xl font-black text-white">Project demonstrates</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {demonstrations.map((item) => (
                  <div key={item} className="flex gap-2 rounded-2xl border border-emerald-400/15 bg-white/[0.04] p-3 text-sm text-emerald-50/70">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-crop-neon" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Cloud className="mt-1 h-7 w-7 shrink-0 text-crop-neon" />
            <div>
              <h2 className="text-2xl font-black text-white">Deployment stack</h2>
              <p className="mt-3 text-sm leading-7 text-emerald-50/70">
                Built for Vercel deployment with environment variables and modern Next.js API routes.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {TECH_STACK.map((tech) => (
                  <span key={tech} className="rounded-full border border-emerald-400/20 bg-white/[0.045] px-4 py-2 text-sm font-semibold text-emerald-50/75">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <DisclaimerBox variant="warning" />
        </div>
      </section>
    </>
  );
}

function AboutTile({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <Card className="p-5">
      <Icon className="h-7 w-7 text-crop-neon" />
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-emerald-50/65">{text}</p>
    </Card>
  );
}
