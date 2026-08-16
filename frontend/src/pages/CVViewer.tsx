import { Download, FileText, ExternalLink, Calendar, CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
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

  return (
    <div className="max-w-[1000px] mx-auto px-6 sm:px-8 space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <header className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <FileText className="w-4 h-4" />
          <span>Curriculum Vitae</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Curriculum <span className="text-primary">Vitae</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Official academic resume and engineering CV of Jeff G. Wilson.
        </p>
      </header>

      <GlassCard variant="heavy" className="p-8 sm:p-12 text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto shadow-xl shadow-primary/10">
          <FileText className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-on-surface">
            {cv?.title || 'Jeff_G_Wilson_CV.pdf'}
          </h2>
          <p className="font-mono text-xs text-on-surface-variant">
            {cv?.version ? `Version: ${cv.version}` : 'Latest Verified Version'} • {cv?.file_size ? `${Math.round(cv.file_size / 1024)} KB` : 'Active'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="/api/cv/download"
            download="Jeff_G_Wilson_CV.pdf"
            onClick={(e) => {
              handleDownload();
            }}
            className="inline-flex items-center justify-center font-label-mono font-bold transition-all duration-300 active:scale-95 text-base px-8 py-3.5 rounded-full gap-2.5 bg-primary text-on-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(173,198,255,0.3)] cursor-pointer"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </a>

          {cv?.file_url && (
            <a href={resolveFileUrl(cv.file_url)} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="secondary" size="lg" icon={<ExternalLink className="w-4 h-4" />}>
                Open in New Tab
              </GlassButton>
            </a>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
