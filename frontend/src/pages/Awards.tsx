import React, { useEffect, useState } from 'react';
import { Award as AwardIcon, Calendar, Building, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassButton } from '../components/common/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Award } from '../types';
import { api } from '../api/client';

export const Awards: React.FC = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAwards(true)
      .then(setAwards)
      .catch((err) => console.error('Error fetching awards:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading honors and awards..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <AwardIcon className="w-4 h-4" />
          <span>Recognition</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Awards & <span className="text-primary">Honors</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Academic recognitions, competition awards, and distinguished achievements.
        </p>
      </header>

      {awards.length === 0 ? (
        <EmptyState
          title="No awards added yet"
          description="Honors and awards will appear here once added from the Admin Console."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awards.map((award) => (
            <GlassCard key={award.id} variant="heavy" className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">{award.award_date}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-on-surface leading-snug">{award.title}</h3>
                <p className="font-mono text-xs text-secondary font-medium">{award.organization}</p>
              </div>

              {award.description && (
                <p className="font-body text-sm text-on-surface-variant/90 leading-relaxed pt-4 border-t border-white/10">
                  {award.description}
                </p>
              )}

              {award.external_url && (
                <div className="pt-2">
                  <a href={award.external_url} target="_blank" rel="noopener noreferrer">
                    <GlassButton variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Details
                    </GlassButton>
                  </a>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
