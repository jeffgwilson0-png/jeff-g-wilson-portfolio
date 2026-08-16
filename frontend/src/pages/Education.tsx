import React, { useEffect, useState } from 'react';
import { GraduationCap, MapPin, Award, BookOpen } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Education as EducationType } from '../types';
import { api } from '../api/client';

export const Education: React.FC = () => {
  const [educations, setEducations] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEducation(true)
      .then(setEducations)
      .catch((err) => console.error('Error fetching education:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading academic history..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Background</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Education & <span className="text-primary">Degrees</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Foundation in Computer Engineering and advanced specialization in Data Science.
        </p>
      </header>

      {educations.length === 0 ? (
        <EmptyState title="No education records found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educations.map((edu) => (
            <GlassCard key={edu.id} variant="heavy" className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-primary font-bold">
                    {edu.start_date} – {edu.end_date || (edu.is_current ? 'Present' : '')}
                  </span>
                  {edu.grade && (
                    <GlassBadge variant="primary" size="sm">
                      {edu.grade}
                    </GlassBadge>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-on-surface leading-snug">{edu.degree}</h3>
                <p className="font-body text-base text-secondary font-medium">{edu.field_of_study}</p>
                <p className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{edu.institution} {edu.location ? `• ${edu.location}` : ''}</span>
                </p>
              </div>

              {edu.description && (
                <div className="pt-4 border-t border-white/10 font-body text-sm text-on-surface-variant/90 leading-relaxed">
                  {edu.description}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
