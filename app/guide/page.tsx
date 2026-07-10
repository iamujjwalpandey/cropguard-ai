import { AlertTriangle, BookOpen, Camera, ShieldCheck } from 'lucide-react';
import DisclaimerBox from '@/components/DisclaimerBox';
import GuideSection from '@/components/GuideSection';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { GUIDE_SECTIONS } from '@/lib/constants';

export default function GuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Farmer Guide"
        title="Practical crop image and disease safety guide"
        description="Learn how to capture better crop images, understand common symptom categories, prevent disease spread, and use AI crop analysis safely."
      />
      <section className="container pb-20">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <Camera className="h-7 w-7 text-crop-neon" />
            <h3 className="mt-4 font-bold text-white">Capture clearly</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50/65">Close, well-lit photos make AI advisory more useful.</p>
          </Card>
          <Card className="p-5">
            <BookOpen className="h-7 w-7 text-crop-neon" />
            <h3 className="mt-4 font-bold text-white">Learn symptoms</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50/65">Understand fungal, bacterial, viral, nutrient, and stress patterns.</p>
          </Card>
          <Card className="p-5">
            <ShieldCheck className="h-7 w-7 text-crop-neon" />
            <h3 className="mt-4 font-bold text-white">Act safely</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50/65">Do not apply chemicals without certified agriculture guidance.</p>
          </Card>
        </div>

        <div className="grid gap-5">
          {GUIDE_SECTIONS.map((section, index) => (
            <GuideSection key={section.title} title={section.title} points={section.points} index={index} />
          ))}
        </div>

        <div className="mt-8">
          <DisclaimerBox variant="warning" />
        </div>

        <Card className="mt-8 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
            <p className="text-sm leading-7 text-emerald-50/70">
              This guide is educational. CropGuard AI does not provide exact pesticide dosage instructions. Local crop variety, weather, soil, irrigation, pest pressure, and crop stage must be considered by a qualified expert.
            </p>
          </div>
        </Card>
      </section>
    </>
  );
}
