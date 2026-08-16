import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, BookOpen, Layers, CheckCircle2, Share2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Project } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProject(slug)
      .then(setProject)
      .catch((err) => {
        console.error('Error fetching project detail:', err);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    info('Project URL copied to clipboard');
  };

  if (loading) {
    return <LoadingSpinner text="Loading project specifications..." className="min-h-[60vh]" />;
  }

  if (!project) {
    return (
      <div className="max-w-[1300px] mx-auto px-6 sm:px-8 py-12">
        <EmptyState
          title="Project Not Found"
          description="The requested project could not be found or has been moved."
          actionText="Back to Projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const techList = project.technologies
    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 space-y-12 pb-20">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all projects</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Project Overview Card */}
      <GlassCard variant="heavy" className="p-8 sm:p-12 space-y-8 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Metadata */}
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <GlassBadge variant="primary" size="md">
              {project.category}
            </GlassBadge>
            {project.featured && (
              <GlassBadge variant="secondary" size="md">
                Featured Project
              </GlassBadge>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-on-surface leading-tight">
            {project.title}
          </h1>

          <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2 border-y border-white/10 py-6 relative z-10">
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="primary" size="md" icon={<ExternalLink className="w-4 h-4" />}>
                Launch Live Demo
              </GlassButton>
            </a>
          )}

          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <GlassButton variant="secondary" size="md" icon={<Github className="w-4 h-4" />}>
                View Source Repository
              </GlassButton>
            </a>
          )}

          {project.research_url && (
            <Link to={project.research_url}>
              <GlassButton variant="pill" size="md" icon={<BookOpen className="w-4 h-4 text-primary" />}>
                Read Research Paper
              </GlassButton>
            </Link>
          )}
        </div>

        {/* Full Description / Architecture */}
        <div className="space-y-6 relative z-10 pt-4">
          <h2 className="font-display text-2xl font-bold text-on-surface">Architecture & Implementation</h2>
          <div className="font-body text-base text-on-surface-variant leading-relaxed space-y-4">
            <p>
              {project.full_description || project.short_description}
            </p>
          </div>
        </div>

        {/* Technologies Stack */}
        <div className="space-y-4 relative z-10 pt-4 border-t border-white/10">
          <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Technologies & Frameworks</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {techList.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-xl font-mono text-xs bg-white/5 border border-white/10 text-on-surface font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
