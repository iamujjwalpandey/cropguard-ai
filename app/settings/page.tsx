import PageHeader from '@/components/PageHeader';
import SettingsPanel from '@/components/SettingsPanel';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="AI Model & Provider Settings"
        description="Manage Gemini and Groq API keys, provider preferences, model detection, Free Tier Mode, and fallback behavior inside one secure settings page."
      />
      <section className="container pb-20">
        <SettingsPanel />
      </section>
    </>
  );
}
