import React, { useEffect, useState } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassButton } from '../components/common/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Certification } from '../types';
import { api } from '../api/client';

export const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCertifications(true)
      .then(setCertifications)
      .catch((err) => console.error('Error fetching certifications:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading certifications..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-16 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Professional Credentials</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Certifications & <span className="text-primary">Credentials</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Verified competencies and specialized professional course certifications.
        </p>
      </header>

      {certifications.length === 0 ? (
        <EmptyState
          title="No certifications added yet"
          description="Certifications will appear here once added from the Admin Console."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((cert) => (
            <GlassCard key={cert.id} variant="heavy" className="p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">{cert.issue_date || 'Certified'}</span>
                  {cert.credential_id && (
                    <GlassBadge variant="outline" size="sm">
                      ID: {cert.credential_id}
                    </GlassBadge>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-on-surface leading-snug">{cert.name}</h3>
                <p className="font-mono text-xs text-secondary font-medium">{cert.issuing_organization}</p>
              </div>

              {cert.description && (
                <p className="font-body text-sm text-on-surface-variant/90 leading-relaxed pt-4 border-t border-white/10">
                  {cert.description}
                </p>
              )}

              {cert.verification_url && (
                <div className="pt-2">
                  <a href={cert.verification_url} target="_blank" rel="noopener noreferrer">
                    <GlassButton variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Verify Credential
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
