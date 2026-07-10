'use client';

import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle2, FileImage, ImagePlus, Languages, Settings, Trash2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import LoadingScanner from '@/components/LoadingScanner';
import DisclaimerBox from '@/components/DisclaimerBox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { analyzeImageFile, ClientApiError } from '@/lib/client-analysis';
import { fileToDataUrl } from '@/lib/utils';
import type { AdvisoryLanguage, AdvisoryMode } from '@/lib/types';

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

export default function ImageUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [language, setLanguage] = useState<AdvisoryLanguage>('English');
  const [advisoryMode, setAdvisoryMode] = useState<AdvisoryMode>('Farmer-Friendly');

  async function validateAndSetFile(nextFile: File | undefined) {
    setError('');
    if (!nextFile) return;
    if (!SUPPORTED_TYPES.includes(nextFile.type)) {
      setError('Unsupported image format. Please upload a JPG, PNG, or WEBP crop image.');
      return;
    }
    if (nextFile.size > MAX_BYTES) {
      setError('Image too large. Please upload an image smaller than 8 MB.');
      return;
    }
    const dataUrl = await fileToDataUrl(nextFile);
    setFile(nextFile);
    setPreview(dataUrl);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void validateAndSetFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void validateAndSetFile(event.dataTransfer.files?.[0]);
  }

  function removeImage() {
    setFile(null);
    setPreview('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  async function analyze() {
    if (!file) {
      setError('Please upload a crop image before analysis.');
      return;
    }
    setAnalyzing(true);
    setError('');
    try {
      await analyzeImageFile({ file, imageDataUrl: preview, language, advisoryMode });
      router.push('/result');
    } catch (analysisError) {
      const message = analysisError instanceof ClientApiError || analysisError instanceof Error
        ? analysisError.message
        : 'Could not analyze the crop image. Please try again.';
      setError(
        message.includes('unclear') || message.includes('crop')
          ? message
          : message || 'Could not clearly detect crop symptoms. Please upload a closer, well-lit image of the affected leaf or plant.'
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (analyzing) return <LoadingScanner />;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <div className="border-b border-emerald-400/15 bg-emerald-400/8 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-crop-neon shadow-glow" />
            <div>
              <h2 className="text-xl font-black text-white">Manual Image Upload</h2>
              <p className="text-xs text-emerald-50/60">Drag, preview, analyze, export • JPG, PNG, WEBP supported</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {!preview ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative flex min-h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed p-8 text-center transition ${
                dragging
                  ? 'border-emerald-300 bg-emerald-400/15 shadow-glow'
                  : 'border-emerald-400/25 bg-white/[0.035] hover:border-emerald-300/45 hover:bg-emerald-400/8'
              }`}
              onClick={() => inputRef.current?.click()}
            >
              <div className="absolute inset-0 scanner-grid opacity-30" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-crop-neon shadow-glow">
                <UploadCloud className="h-11 w-11" />
              </div>
              <h3 className="relative mt-6 text-2xl font-black text-white">Upload crop image</h3>
              <p className="relative mt-3 max-w-xl text-sm leading-6 text-emerald-50/65">
                Drop a close, well-lit image of an affected leaf or plant here. CropGuard AI will temporarily send it to Gemini Vision for advisory analysis.
              </p>
              <div className="relative mt-6 flex flex-wrap justify-center gap-3 text-xs text-emerald-50/60">
                <span className="rounded-full border border-emerald-400/15 bg-black/30 px-3 py-1">JPG</span>
                <span className="rounded-full border border-emerald-400/15 bg-black/30 px-3 py-1">PNG</span>
                <span className="rounded-full border border-emerald-400/15 bg-black/30 px-3 py-1">WEBP</span>
                <span className="rounded-full border border-emerald-400/15 bg-black/30 px-3 py-1">Max 8 MB</span>
              </div>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleInput} />
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-black scanner-corners shadow-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Uploaded crop preview" className="max-h-[620px] w-full object-contain" />
                <div className="pointer-events-none absolute inset-0 scanner-grid opacity-25" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-emerald-50/70">
                  <FileImage className="h-5 w-5 text-crop-neon" />
                  <span className="truncate">{file?.name}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={analyze} size="lg">
                    <CheckCircle2 className="h-5 w-5" />
                    Analyze Image
                  </Button>
                  <Button onClick={removeImage} variant="destructive" size="lg">
                    <Trash2 className="h-5 w-5" />
                    Remove Image
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              {error.includes('unclear')
                ? 'Could not clearly detect crop symptoms. Please upload a closer, well-lit image of the affected leaf or plant.'
                : error}
            </div>
          )}
        </div>
      </Card>

      <aside className="grid gap-6 self-start">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-crop-neon" />
            <h3 className="font-bold text-white">Upload Preferences</h3>
          </div>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">
                <Languages className="h-4 w-4" /> Language
              </label>
              <Select value={language} onChange={(event) => setLanguage(event.target.value as AdvisoryLanguage)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual">Bilingual</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">Report Mode</label>
              <Select value={advisoryMode} onChange={(event) => setAdvisoryMode(event.target.value as AdvisoryMode)}>
                <option value="Farmer-Friendly">Farmer-Friendly</option>
                <option value="Expert">Expert</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-crop-neon" />
            <h3 className="font-bold text-white">Best image checklist</h3>
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-emerald-50/65">
            <li>• Leaf fills most of the frame.</li>
            <li>• Visible spots, discoloration, curling, or lesions are clear.</li>
            <li>• Avoid blurry, very dark, or far-away field images.</li>
            <li>• Capture affected and healthy comparison leaves when possible.</li>
          </ul>
        </Card>

        <Button asChild variant="secondary" size="lg">
          <Link href="/scan">
            <Camera className="h-5 w-5" />
            Use Camera Scanner
          </Link>
        </Button>

        <DisclaimerBox />
      </aside>
    </div>
  );
}
