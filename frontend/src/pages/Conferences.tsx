import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, Award, Users } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassButton } from '../components/common/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Conference } from '../types';
import { api } from '../api/client';

export const Conferences: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getConferences(true)
      .then(setConferences)
      .catch((err) => console.error('Error fetching conferences:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading conference engagements..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <Calendar className="w-4 h-4" />
          <span>Conferences & Events</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Conferences & <span className="text-primary">Engagements</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Active participation in regional engineering summits, tech events, and academic documentation.
        </p>
      </header>

      {conferences.length === 0 ? (
        <EmptyState title="No conference records found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {conferences.map((conf) => (
            <GlassCard key={conf.id} variant="heavy" className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">{conf.date_string}</span>
                  {conf.featured && (
                    <GlassBadge variant="secondary" size="sm">
                      Featured Event
                    </GlassBadge>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-on-surface leading-snug">{conf.event_name}</h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-secondary">
                    <Users className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">{conf.role}</span>
                  </div>
                  {conf.location && (
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{conf.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {conf.description && (
                <p className="font-body text-sm text-on-surface-variant/90 leading-relaxed pt-4 border-t border-white/10">
                  {conf.description}
                </p>
              )}

              {conf.external_url && (
                <div className="pt-2">
                  <a href={conf.external_url} target="_blank" rel="noopener noreferrer">
                    <GlassButton variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Event Details
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
