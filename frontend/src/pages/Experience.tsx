import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Experience as ExperienceType } from '../types';
import { api } from '../api/client';

export const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperience(true)
      .then(setExperiences)
      .catch((err) => console.error('Error fetching experiences:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading experience timeline..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <Briefcase className="w-4 h-4" />
          <span>Professional Experience</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Experience & <span className="text-primary">Timeline</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          A track record of AI research, full-stack software development, and technical execution.
        </p>
      </header>

      {/* Vertical Liquid Glass Timeline */}
      {experiences.length === 0 ? (
        <EmptyState title="No experience records" description="Experience records will appear here once published." />
      ) : (
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {experiences.map((exp) => {
            const techList = exp.technologies
              ? exp.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div key={exp.id} className="relative group">
                {/* Glowing Timeline Node */}
                <div className="absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full bg-surface border-2 border-primary group-hover:bg-primary shadow-[0_0_15px_rgba(173,198,255,0.5)] transition-colors" />

                {/* Experience Card */}
                <GlassCard variant="heavy" className="p-8 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-xs text-primary font-bold">
                        {exp.end_date || exp.is_current
                          ? `${exp.start_date} – ${exp.end_date || 'Present'}`
                          : exp.start_date}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-on-surface mt-1">{exp.role}</h3>
                      <p className="font-body text-base text-secondary font-semibold">{exp.company}</p>
                    </div>

                    {exp.location && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-on-surface-variant">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <div className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed space-y-1.5 pt-1">
                      {exp.description.includes('\n') ? (
                        <ul className="space-y-2">
                          {exp.description
                            .split('\n')
                            .map((line) => line.replace(/^[\*\-\•]\s*/, '').trim())
                            .filter(Boolean)
                            .map((line, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span>{line}</span>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p>{exp.description}</p>
                      )}
                    </div>
                  )}

                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {techList.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-on-surface"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
