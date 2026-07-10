'use client';

import { useState } from 'react';
import { Check, Clipboard, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StoredReport } from '@/lib/types';
import { analysisToMarkdown, analysisToPlainText } from '@/lib/report';
import { downloadBlob } from '@/lib/utils';

interface ReportExporterProps {
  report: StoredReport;
}

export default function ReportExporter({ report }: ReportExporterProps) {
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(analysisToPlainText(report));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadMarkdown() {
    const stamp = new Date(report.createdAt).toISOString().slice(0, 10);
    downloadBlob(`cropguard-ai-report-${stamp}.md`, analysisToMarkdown(report), 'text/markdown;charset=utf-8');
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-3 no-print">
      <Button variant="secondary" onClick={copyReport}>
        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy Report'}
      </Button>
      <Button variant="secondary" onClick={downloadMarkdown}>
        <Download className="h-4 w-4" />
        Download Markdown
      </Button>
      <Button variant="secondary" onClick={printPdf}>
        <Printer className="h-4 w-4" />
        Print / Save PDF
      </Button>
    </div>
  );
}
