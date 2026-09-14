import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Github, ExternalLink, ArrowRight, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Project } from '../types';
import { api } from '../api/client';
import { clsx } from 'clsx';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getProjects({ published_only: true })
      .then(setProjects)
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.technologies && p.technologies.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  if (loading) {
    return <LoadingSpinner text="Loading applied engineering projects..." className="min-h-[60vh]" />;
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-12 pb-20 pt-4 sm:pt-8">
      {/* Header */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="w-8 h-1 bg-emerald-400 rounded-full mx-auto" />
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Selected <span className="text-emerald-400">Projects</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          A showcase of intelligent software, data architectures, research frameworks, and web platforms built with precision.
        </p>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-3 rounded-2xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200',
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/25'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech or project..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects match your filter"
          description="Try selecting a different category or clearing the search query."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const techList = project.technologies
              ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <GlassCard
                key={project.id}
                hoverEffect
                className="flex flex-col justify-between p-6 group h-full"
                onClick={() => navigate(`/projects/${project.slug}`)}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <GlassBadge variant="emerald" size="sm">
                      {project.category}
                    </GlassBadge>
                    <ArrowUpRight className="w-5 h-5 text-on-surface-variant group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  {/* Project Title */}
                  <h3 className="font-display text-xl font-bold text-on-surface group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Short Description */}
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {project.short_description}
                  </p>
                </div>

                {/* Tech & Links */}
                <div className="pt-6 mt-auto space-y-4 border-t border-white/5">
                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {techList.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-on-surface-variant"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div
                    className="flex items-center justify-between pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-xs font-mono text-primary font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
