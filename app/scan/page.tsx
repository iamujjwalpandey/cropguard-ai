import CameraScanner from '@/components/CameraScanner';
import PageHeader from '@/components/PageHeader';

export default function ScanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Real-time camera scanning"
        title="Scan Crop Page"
        description="Use the browser camera to capture a crop leaf or plant, preview the image, and analyze visible symptoms with Gemini Vision. CropGuard AI does not store captured images in a database."
      />
      <section className="container pb-20">
        <CameraScanner />
      </section>
    </>
  );
}
