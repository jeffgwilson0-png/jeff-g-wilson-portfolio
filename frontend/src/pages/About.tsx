import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Download,
  Mail,
  Brain,
  Code2,
  Cpu,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Profile, Education, Skill, CVItem } from '../types';
import { api } from '../api/client';

export const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCV] = useState<CVItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadAboutData = async () => {
      try {
        const [profRes, eduRes, skillsRes, cvRes] = await Promise.allSettled([
          api.getProfile(),
          api.getEducation(),
          api.getSkills(),
          api.getActiveCV(),
        ]);
        if (!isMounted) return;
        if (profRes.status === 'fulfilled') setProfile(profRes.value);
        if (eduRes.status === 'fulfilled') setEducations(eduRes.value);
        if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
        if (cvRes.status === 'fulfilled') setCV(cvRes.value);
      } catch (err) {
        console.error('Error loading about data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadCV = () => {
    if (cv && cv.file_url) {
      window.open(cv.file_url, '_blank');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading About profile..." className="min-h-[60vh]" />;
  }

  // Group skills by category
  const categories = ['Programming', 'AI / Machine Learning', 'Data Science', 'Cloud', 'Development', 'Design'];
  const groupedSkills: Record<string, Skill[]> = {};
  categories.forEach((cat) => {
    groupedSkills[cat] = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
  });

  return (
    <div className="max-w-[1300px] mx-auto px-6 sm:px-8 space-y-20 pb-20">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <span>About Me</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Bridging Theory with <span className="text-primary">Scalable AI Systems</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          {profile?.headline || 'Computer Engineer | Data Scientist | AI / ML Researcher'}
        </p>
      </header>

      {/* Main Biography Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <GlassCard variant="heavy" className="lg:col-span-8 p-8 sm:p-12 space-y-6">
          <h2 className="font-display text-2xl font-bold text-on-surface border-b border-white/10 pb-4">
            Professional Overview
          </h2>
          <div className="font-body text-base text-on-surface-variant leading-relaxed space-y-4">
            <p>
              {profile?.full_bio ||
                'I am a Computer Engineering graduate currently pursuing my Master of Technology (M.Tech) in Data Science at Marwadi University. My academic and professional journey is driven by a deep fascination with transforming intricate, high-dimensional data into actionable computational intelligence.'}
            </p>
            <p>
              Beyond formal research, I actively build full-stack systems, distributed services, and high-fidelity interfaces. My focus centers on ensuring that machine learning pipelines—particularly Retrieval-Augmented Generation (RAG) models—operate with maximum factual integrity, low latency, and deterministic reliability.
            </p>
            <p>
              I believe in engineering excellence: write clean, maintainable code, implement rigorous testing, and craft user interfaces that feel alive, intuitive, and technically polished.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <GlassButton
              variant="primary"
              size="md"
              onClick={handleDownloadCV}
              icon={<Download className="w-4 h-4" />}
            >
              Download Complete CV
            </GlassButton>

            <Link to="/work-with-me">
              <GlassButton variant="secondary" size="md" icon={<Mail className="w-4 h-4" />}>
                Work With Me
              </GlassButton>
            </Link>
          </div>
        </GlassCard>

        {/* Quick Facts Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
              Quick Facts
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-on-surface-variant">Location:</span>
                <span className="text-on-surface font-medium">{profile?.location || 'Rajkot, Gujarat, India'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-on-surface-variant">Focus:</span>
                <span className="text-primary font-medium">RAG & Multimodal AI</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-on-surface-variant">Status:</span>
                <span className="text-emerald-400 font-medium">Open for Collaboration</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Primary Stack:</span>
                <span className="text-on-surface font-medium">Python, React, PyTorch</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <h3 className="font-display text-lg font-bold text-on-surface">Currently Exploring</h3>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="font-body text-xs text-on-surface leading-relaxed">
                {profile?.currently_exploring || 'Advanced RAG Architectures & Multimodal Verification Frameworks'}
              </p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Academic Background / Education */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-bold text-on-surface">Education & Degrees</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations.map((edu) => (
            <GlassCard key={edu.id} className="p-8 space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs text-primary font-semibold">
                    {edu.start_date} – {edu.end_date || (edu.is_current ? 'Present' : '')}
                  </span>
                  <h3 className="font-display text-xl font-bold text-on-surface mt-1">{edu.degree}</h3>
                  <p className="font-body text-sm text-secondary font-medium">{edu.field_of_study}</p>
                </div>
                {edu.grade && (
                  <GlassBadge variant="primary" size="sm">
                    {edu.grade}
                  </GlassBadge>
                )}
              </div>

              <p className="font-body text-xs text-on-surface-variant font-mono">{edu.institution} • {edu.location}</p>

              {edu.description && (
                <p className="font-body text-sm text-on-surface-variant/80 pt-2 border-t border-white/5">
                  {edu.description}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Technical Competencies / Skills Matrix */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Code2 className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-bold text-on-surface">Technical Competencies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const catSkills = groupedSkills[category] || [];
            if (catSkills.length === 0) return null;

            return (
              <GlassCard key={category} className="p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-primary flex items-center justify-between border-b border-white/10 pb-2">
                  <span>{category}</span>
                  <span className="font-mono text-xs text-on-surface-variant font-normal">{catSkills.length} skills</span>
                </h3>

                <div className="space-y-3">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-on-surface">{skill.name}</span>
                        <span className="text-on-surface-variant">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/80 transition-all duration-700"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};
