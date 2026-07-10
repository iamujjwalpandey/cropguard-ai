'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CameraOff, CheckCircle2, FlipHorizontal2, ImagePlus, RefreshCcw, RotateCcw, ScanLine, Settings, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import LoadingScanner from '@/components/LoadingScanner';
import DisclaimerBox from '@/components/DisclaimerBox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { analyzeImageFile, ClientApiError } from '@/lib/client-analysis';
import { dataUrlToFile } from '@/lib/utils';
import type { AdvisoryLanguage, AdvisoryMode } from '@/lib/types';

export default function CameraScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'>('idle');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedDataUrl, setCapturedDataUrl] = useState('');
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [language, setLanguage] = useState<AdvisoryLanguage>('English');
  const [advisoryMode, setAdvisoryMode] = useState<AdvisoryMode>('Farmer-Friendly');

  useEffect(() => {
    return () => stopCamera();
  }, []);

  async function enumerateVideoDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter((device) => device.kind === 'videoinput');
    setDevices(videoDevices);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }

  async function startCamera(options?: { deviceId?: string; nextFacingMode?: 'environment' | 'user' }) {
    setError('');
    setPermissionState('requesting');

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unavailable');
      setError('Camera not available in this browser. Please upload an image instead.');
      return;
    }

    try {
      stopCamera();
      const constraints: MediaStreamConstraints = {
        video: options?.deviceId
          ? { deviceId: { exact: options.deviceId } }
          : { facingMode: { ideal: options?.nextFacingMode || facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPermissionState('granted');
      setCameraReady(true);
      await enumerateVideoDevices();
    } catch (cameraError) {
      setPermissionState('denied');
      setError(
        cameraError instanceof DOMException && cameraError.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please enable camera access or upload an image instead.'
          : 'Camera not available. Please check your device camera or upload an image instead.'
      );
    }
  }

  async function switchCamera() {
    setCapturedDataUrl('');
    if (devices.length > 1) {
      const nextIndex = (deviceIndex + 1) % devices.length;
      setDeviceIndex(nextIndex);
      await startCamera({ deviceId: devices[nextIndex].deviceId });
      return;
    }
    const nextFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacingMode);
    await startCamera({ nextFacingMode });
  }

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
  }

  function retake() {
    setCapturedDataUrl('');
    setError('');
  }

  async function analyzeCapturedImage() {
    if (!capturedDataUrl) {
      setError('Please capture a crop image before analysis.');
      return;
    }
    setAnalyzing(true);
    setError('');
    try {
      const file = dataUrlToFile(capturedDataUrl, `cropguard-camera-${Date.now()}.jpg`);
      await analyzeImageFile({ file, imageDataUrl: capturedDataUrl, language, advisoryMode });
      router.push('/result');
    } catch (analysisError) {
      const message = analysisError instanceof ClientApiError || analysisError instanceof Error
        ? analysisError.message
        : 'Could not analyze crop image. Please try again.';
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  }

  if (analyzing) return <LoadingScanner />;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-emerald-400/15 bg-emerald-400/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-crop-neon shadow-glow" />
            <div>
              <h2 className="text-xl font-black text-white">Live Crop Scan</h2>
              <p className="text-xs text-emerald-50/60">Browser camera scanning • Temporary processing • No database</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={switchCamera} disabled={!cameraReady}>
              <FlipHorizontal2 className="h-4 w-4" />
              Switch Camera
            </Button>
            <Button variant="outline" asChild>
              <Link href="/upload">
                <UploadCloud className="h-4 w-4" />
                Upload Instead
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="relative mx-auto aspect-[4/3] max-h-[640px] w-full overflow-hidden rounded-3xl border border-emerald-400/25 bg-black scanner-corners shadow-glow">
            {!capturedDataUrl && (
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            )}

            {capturedDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={capturedDataUrl} alt="Captured crop preview" className="h-full w-full object-cover" />
            )}

            <div className="pointer-events-none absolute inset-0 scanner-grid opacity-40" />
            {cameraReady && !capturedDataUrl && <div className="scan-line animate-scan" />}

            {!cameraReady && !capturedDataUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 p-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-crop-neon shadow-glow">
                  {permissionState === 'requesting' ? <RefreshCcw className="h-9 w-9 animate-spin" /> : <Camera className="h-9 w-9" />}
                </div>
                <h3 className="mt-6 text-2xl font-black text-white">Enable live crop scanner</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-emerald-50/65">
                  CropGuard AI needs camera permission to scan a crop leaf or plant in real time. Use a close, well-lit view of visible symptoms.
                </p>
                <Button className="mt-6" size="lg" onClick={() => startCamera()} disabled={permissionState === 'requesting'}>
                  <Camera className="h-5 w-5" />
                  {permissionState === 'requesting' ? 'Requesting Camera…' : 'Allow Camera Access'}
                </Button>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {!capturedDataUrl ? (
                <Button size="lg" onClick={captureImage} disabled={!cameraReady}>
                  <ScanLine className="h-5 w-5" />
                  Capture Crop Image
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={analyzeCapturedImage}>
                    <CheckCircle2 className="h-5 w-5" />
                    Analyze Image
                  </Button>
                  <Button size="lg" variant="secondary" onClick={retake}>
                    <RotateCcw className="h-5 w-5" />
                    Retake
                  </Button>
                </>
              )}
              {!cameraReady && permissionState !== 'requesting' && (
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/upload">
                    <ImagePlus className="h-5 w-5" />
                    Upload Crop Image
                  </Link>
                </Button>
              )}
            </div>
            <p className="text-xs text-emerald-50/55">
              Tip: for mobile, CropGuard AI prefers the back camera where supported.
            </p>
          </div>
        </div>
      </Card>

      <aside className="grid gap-6 self-start">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-crop-neon" />
            <h3 className="font-bold text-white">Scan Preferences</h3>
          </div>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">Language</label>
              <Select value={language} onChange={(event) => setLanguage(event.target.value as AdvisoryLanguage)}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bilingual">Bilingual</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/60">Mode</label>
              <Select value={advisoryMode} onChange={(event) => setAdvisoryMode(event.target.value as AdvisoryMode)}>
                <option value="Farmer-Friendly">Farmer-Friendly</option>
                <option value="Expert">Expert</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <CameraOff className="h-5 w-5 text-amber-200" />
            <h3 className="font-bold text-white">Camera troubleshooting</h3>
          </div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-emerald-50/65">
            <li>• Allow camera permission in your browser.</li>
            <li>• Use HTTPS or localhost for camera access.</li>
            <li>• If permission is blocked, upload an image instead.</li>
            <li>• Capture affected leaves clearly, not the full field from far away.</li>
          </ul>
        </Card>

        <DisclaimerBox />
      </aside>
    </div>
  );
}
