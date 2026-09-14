import React, { useState, useEffect } from 'react';
import { Download, FileText, ExternalLink, ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CVItem } from '../types';
import { api } from '../api/client';
import { downloadActiveCV, resolveFileUrl } from '../utils/download';

export const CVViewer: React.FC = () => {
  const [cv, setCV] = useState<CVItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.getActiveCV()
      .then(setCV)
      .catch((err) => console.error('Error fetching CV:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadActiveCV(cv?.file_url, cv?.title || 'Jeff_G_Wilson_CV.pdf');
    } catch (err) {
      console.error('Error downloading CV:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading curriculum vitae..." className="min-h-[60vh]" />;
  }

  const fileUrl = cv?.file_url ? resolveFileUrl(cv.file_url) : '/api/cv/download';

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-8 pb-20 pt-4 sm:pt-6">
      {/* Top Bar with Back and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          {cv?.file_url && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono transition-colors cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </button>
            </a>
          )}

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black font-semibold text-xs dark:hover:bg-neutral-200 transition-colors shadow-md cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Curriculum Vitae
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono">
          {cv?.title || 'Jeff_G_Wilson_CV.pdf'} • {cv?.version ? `v${cv.version}` : 'Active Version'}
        </p>
      </header>

      {/* Embedded Document Previewer */}
      <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#121212] shadow-xl">
        {cv?.file_url ? (
          <iframe
            src={`${fileUrl}#view=FitH`}
            className="w-full h-[75vh] min-h-[600px] border-0"
            title="Curriculum Vitae Viewer"
          />
        ) : (
          <div className="p-16 text-center space-y-4">
            <FileText className="w-16 h-16 mx-auto text-neutral-400" />
            <p className="text-sm text-neutral-500">
              Document preview is loading or not directly embeddable. Use the Download PDF button above to view it.
            </p>
          </div>
        )}
      </div>

      {/* Footer download bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#161616]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">{cv?.title || 'Jeff G. Wilson — CV'}</p>
            <p className="text-[11px] font-mono text-neutral-500">Ready for download</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black font-semibold text-xs dark:hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
        >
          <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
          <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
        </button>
      </div>
    </div>
  );
};
