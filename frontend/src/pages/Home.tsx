import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  Brain,
  Cpu,
  Database,
  Code2,
  Sparkles,
  ExternalLink,
  Github,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Profile, Project, Research, Skill, CVItem } from '../types';
import { api } from '../api/client';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredResearch, setFeaturedResearch] = useState<Research[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCV] = useState<CVItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [profRes, projRes, resRes, skillsRes, cvRes] = await Promise.allSettled([
          api.getProfile(),
          api.getProjects({ featured: true, published_only: true }),
          api.getResearch({ featured: true, published_only: true }),
          api.getSkills({ featured_only: true }),
          api.getActiveCV(),
        ]);

        if (!isMounted) return;

        if (profRes.status === 'fulfilled') setProfile(profRes.value);
        if (projRes.status === 'fulfilled') setFeaturedProjects(projRes.value);
        if (resRes.status === 'fulfilled') setFeaturedResearch(resRes.value);
        if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value);
        if (cvRes.status === 'fulfilled') setCV(cvRes.value);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadCV = () => {
    if (cv && cv.file_url) {
      window.open(cv.file_url, '_blank');
    } else {
      navigate('/cv');
    }
  };

  const primaryResearch = featuredResearch && featuredResearch.length > 0 ? featuredResearch[0] : null;

  return (
    <div className="max-w-[1300px] mx-auto px-6 sm:px-8 space-y-28 md:space-y-36 pb-16">
      {/* 1. Hero Section */}
      <section className="min-h-[75vh] flex flex-col lg:flex-row items-center justify-between gap-12 pt-6">
        {/* Left Column: Introductions & CTAs */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-primary/30 text-primary font-mono text-xs mb-6 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>System Architecture & AI</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-on-surface via-primary to-secondary">
              {profile?.name ? profile.name.toUpperCase() : 'JEFF G. WILSON'}
            </span>
          </h1>

          <p className="font-display text-lg sm:text-2xl text-on-surface-variant font-medium mb-6">
            {profile?.headline || 'Computer Engineer | Data Scientist | AI / ML Researcher'}
          </p>

          <p className="font-body text-base sm:text-lg text-on-surface-variant/80 max-w-2xl mb-10 leading-relaxed">
            {profile?.short_bio ||
              'I build intelligent software, data-driven systems, and research-driven AI solutions designed to bridge complex theoretical models with robust, scalable engineering.'}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Link to="/projects">
              <GlassButton variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Explore My Work
              </GlassButton>
            </Link>

            <GlassButton
              variant="secondary"
              size="lg"
              onClick={handleDownloadCV}
              icon={<Download className="w-4 h-4 text-primary" />}
            >
              Download CV
            </GlassButton>

            <Link to="/work-with-me">
              <GlassButton variant="ghost" size="lg" icon={<Mail className="w-4 h-4" />}>
                Work With Me
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Profile Visualization */}
        <div className="flex-1 w-full max-w-[480px] relative z-10 flex justify-center items-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            {/* Outer Decorative Rings */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_25s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-primary/20 border-dashed animate-[spin_35s_linear_infinite_reverse]" />

            {/* Glass Avatar Container */}
            <div className="absolute inset-8 rounded-full glass-panel overflow-hidden shadow-[0_0_50px_rgba(77,142,255,0.2)] flex items-center justify-center group border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/90 z-10 pointer-events-none" />

              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover relative z-0 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex flex-col items-center justify-center p-6 text-center text-on-surface-variant">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-3">
                    <Brain className="w-10 h-10" />
                  </div>
                  <span className="font-display font-bold text-sm text-on-surface">Jeff G. Wilson</span>
                  <span className="font-mono text-[11px] text-primary mt-1">Portfolio Avatar</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute bottom-6 left-0 w-full text-center z-20 font-mono text-xs font-semibold text-primary drop-shadow flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{profile?.status_text || 'STATUS: ONLINE'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Expertise Pills */}
      <section className="flex flex-wrap gap-3.5 justify-center pt-8 pb-8 border-y border-white/5">
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:border-primary/50 transition-colors cursor-default">
          <Brain className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-on-surface-variant">Machine Learning</span>
        </div>
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:border-secondary/50 transition-colors cursor-default">
          <Cpu className="w-4 h-4 text-secondary" />
          <span className="font-mono text-xs text-on-surface-variant">High-Performance Computing</span>
        </div>
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:border-tertiary/50 transition-colors cursor-default">
          <Database className="w-4 h-4 text-tertiary" />
          <span className="font-mono text-xs text-on-surface-variant">Data Engineering</span>
        </div>
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:border-primary/50 transition-colors cursor-default">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-on-surface-variant">Scalable Web Systems</span>
        </div>
        <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:border-secondary/50 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="font-mono text-xs text-on-surface-variant">RAG & Multimodal AI</span>
        </div>
      </section>

      {/* 3. Featured Research Paper Spotlight */}
      {primaryResearch && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">Featured Research</h2>
            </div>
            <Link
              to="/research"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <GlassCard variant="heavy" className="p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <GlassBadge variant="primary" size="sm">
                    {primaryResearch.publication_status || 'Under Review'}
                  </GlassBadge>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {primaryResearch.conference_journal} • {primaryResearch.year}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-on-surface leading-snug">
                  {primaryResearch.title}
                </h3>

                <p className="font-body text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  {primaryResearch.abstract}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link to={`/research/${primaryResearch.slug}`}>
                    <GlassButton variant="primary" size="md" icon={<BookOpen className="w-4 h-4" />}>
                      Read Research Summary
                    </GlassButton>
                  </Link>

                  {primaryResearch.external_url && (
                    <a href={primaryResearch.external_url} target="_blank" rel="noopener noreferrer">
                      <GlassButton variant="secondary" size="md" icon={<ExternalLink className="w-4 h-4" />}>
                        IEEE / External Link
                      </GlassButton>
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-center lg:border-l border-white/10 lg:pl-8">
                <div className="w-full aspect-[4/3] rounded-xl glass-panel flex flex-col items-center justify-center p-6 text-center border border-white/10 group-hover:border-primary/30 transition-colors">
                  <Brain className="w-12 h-12 text-primary/80 mb-3 animate-pulse-slow" />
                  <span className="font-mono text-xs font-bold text-on-surface">TrustRAG Architecture</span>
                  <span className="font-mono text-[11px] text-on-surface-variant mt-1">
                    Multimodal Factuality Grounding
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
      )}

      {/* 4. Featured Work Bento Grid */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">Featured Projects</h2>
            </div>
            <Link
              to="/projects"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {featuredProjects.map((project, idx) => {
              const isSpan8 = idx === 0;
              const colSpan = isSpan8 ? 'md:col-span-8' : 'md:col-span-4';
              const techList = project.technologies
                ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <GlassCard
                  key={project.id}
                  hoverEffect
                  className={`${colSpan} p-8 flex flex-col justify-between group min-h-[320px]`}
                  onClick={() => navigate(`/projects/${project.slug}`)}
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <GlassBadge variant={isSpan8 ? 'primary' : 'secondary'} size="sm">
                        {project.category}
                      </GlassBadge>
                      <ArrowUpRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>

                    <h3 className="font-display text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>

                  <div className="pt-6 relative z-10 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {techList.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-on-surface-variant"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. About Snapshot & Education */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GlassCard className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <h2 className="font-display text-2xl font-bold text-on-surface border-b border-white/10 pb-4">
            About Jeff G. Wilson
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            {profile?.full_bio ||
              'I am a Computer Engineering graduate currently pursuing an M.Tech in Data Science at Marwadi University. My passion lies in transforming theoretical computational models into dependable, high-scale software applications and robust AI systems.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl glass-panel flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm text-on-surface">M.Tech Data Science</h4>
                <p className="font-mono text-xs text-on-surface-variant">Marwadi University (Current)</p>
              </div>
            </div>
            <div className="p-4 rounded-xl glass-panel flex items-start gap-3">
              <Cpu className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-sm text-on-surface">B.E. Computer Engineering</h4>
                <p className="font-mono text-xs text-on-surface-variant">Graduated with Distinction</p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Link to="/about">
              <GlassButton variant="secondary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Read Full Biography
              </GlassButton>
            </Link>
          </div>
        </GlassCard>

        {/* Work With Me Banner */}
        <GlassCard variant="heavy" className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="font-mono text-xs text-secondary font-bold uppercase tracking-widest">
              Collaboration & Services
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
              HAVE AN IDEA?<br />
              <span className="text-primary">LET'S BUILD IT.</span>
            </h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              Available for academic research collaborations, scalable web platforms, and mobile apps.
            </p>
          </div>

          <div className="pt-6 relative z-10">
            <Link to="/work-with-me">
              <GlassButton variant="primary" size="lg" className="w-full justify-center" icon={<Mail className="w-4 h-4" />}>
                Start An Inquiry
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
