import ImageUploader from '@/components/ImageUploader';
import PageHeader from '@/components/PageHeader';

export default function UploadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Manual crop image upload"
        title="Upload Image Page"
        description="Drag and drop a JPG, PNG, or WEBP crop image. CropGuard AI temporarily analyzes it with Gemini Vision and creates a structured advisory report."
      />
      <section className="container pb-20">
        <ImageUploader />
      </section>
    </>
  );
}
