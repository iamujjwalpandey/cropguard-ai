'use client';

import { useEffect, useState } from 'react';
import AnalysisReport from '@/components/AnalysisReport';
import ErrorState from '@/components/ErrorState';
import PageHeader from '@/components/PageHeader';
import type { StoredReport } from '@/lib/types';
import { safeJsonParse } from '@/lib/utils';

export default function ResultPage() {
  const [report, setReport] = useState<StoredReport | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem('cropguard-latest-report');
    if (stored) setReport(safeJsonParse<StoredReport | null>(stored, null));
    setLoaded(true);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Analysis Result Page"
        title="AI-generated crop health report"
        description="Review the structured advisory report, switch between farmer-friendly and expert explanations, and export it as text, Markdown, or PDF."
      />
      <section className="container pb-20">
        {loaded && report ? (
          <AnalysisReport report={report} />
        ) : loaded ? (
          <ErrorState
            title="No crop report found"
            message="Analysis reports are stored only in temporary browser session state. Please scan or upload a crop image to create a new report."
            actionHref="/upload"
            actionLabel="Upload Crop Image"
          />
        ) : null}
      </section>
    </>
  );
}
