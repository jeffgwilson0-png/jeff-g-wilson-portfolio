import React, { useEffect, useState } from 'react';
import {
  Brain,
  FileText,
  Bookmark,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Users,
  Building,
  Calendar,
  Network
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Research as ResearchType } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const Research: React.FC = () => {
  const [researchList, setResearchList] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { success, info } = useToast();

  useEffect(() => {
    api.getResearch({ published_only: true })
      .then(setResearchList)
      .catch((err) => console.error('Error fetching research:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCitation = (item: ResearchType) => {
    const citation = `${item.authors} (${item.year || '2024'}). "${item.title}". ${item.conference_journal || 'Under Review'}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(item.id);
    success('Citation copied to clipboard');
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading AI research publications..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <Brain className="w-4 h-4" />
          <span>Research & Innovation</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Exploration & <span className="text-primary">Synthesis</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          An index of academic research, focusing on trustworthy machine learning, multimodal Retrieval-Augmented Generation, and factuality grounding.
        </p>
      </header>

      {/* Research Papers List */}
      <div className="space-y-12">
        {researchList.map((paper) => {
          const techList = paper.technologies
            ? paper.technologies.split(',').map((t) => t.trim()).filter(Boolean)
            : [];

          return (
            <GlassCard
              key={paper.id}
              variant="heavy"
              className="p-8 sm:p-12 relative overflow-hidden group"
            >
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Status & Venue */}
                  <div className="flex flex-wrap items-center gap-3">
                    <GlassBadge variant="primary" size="sm">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span>{paper.publication_status || 'Under Review'}</span>
                    </GlassBadge>
                    <span className="font-mono text-xs text-on-surface-variant">
                      {paper.conference_journal} • {paper.year}
                    </span>
                    {paper.research_area && (
                      <GlassBadge variant="secondary" size="sm">
                        {paper.research_area}
                      </GlassBadge>
                    )}
                  </div>

                  {/* Paper Title */}
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface leading-snug">
                    {paper.title}
                  </h2>

                  {/* Authors & Venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2 text-on-surface">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <span>{paper.authors}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface">
                      <Building className="w-4 h-4 text-secondary shrink-0" />
                      <span>{paper.conference_journal}</span>
                    </div>
                  </div>

                  {/* Abstract */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                      Abstract
                    </h4>
                    <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                      {paper.abstract}
                    </p>
                  </div>

                  {/* Methodology if available */}
                  {paper.methodology && (
                    <div className="space-y-2 pt-2">
                      <h4 className="font-mono text-xs font-bold text-secondary uppercase tracking-wider">
                        Methodology & Approach
                      </h4>
                      <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                        {paper.methodology}
                      </p>
                    </div>
                  )}

                  {/* Tech stack */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {techList.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-on-surface"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    {paper.pdf_url && (
                      <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer">
                        <GlassButton variant="primary" size="md" icon={<Download className="w-4 h-4" />}>
                          Download Paper (PDF)
                        </GlassButton>
                      </a>
                    )}

                    <GlassButton
                      variant="secondary"
                      size="md"
                      onClick={() => handleCopyCitation(paper)}
                      icon={copiedId === paper.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    >
                      {copiedId === paper.id ? 'Citation Copied' : 'Copy Citation'}
                    </GlassButton>

                    {paper.external_url && (
                      <a href={paper.external_url} target="_blank" rel="noopener noreferrer">
                        <GlassButton variant="ghost" size="md" icon={<ExternalLink className="w-4 h-4" />}>
                          External Link
                        </GlassButton>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Visual Representation Card */}
                <div className="lg:col-span-4 flex flex-col justify-center items-center lg:border-l border-white/10 lg:pl-8 space-y-4">
                  <div className="w-full aspect-[4/3] rounded-2xl glass-panel flex flex-col items-center justify-center p-6 text-center border border-white/10 group-hover:border-primary/40 transition-colors relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/10">
                      <Network className="w-8 h-8 animate-pulse-slow" />
                    </div>
                    <span className="font-mono text-sm font-bold text-on-surface">TrustRAG Model</span>
                    <span className="font-mono text-xs text-on-surface-variant mt-1">
                      Graph-Augmented Multimodal Retrieval
                    </span>
                    <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-primary">
                      Architecture Blueprint
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
