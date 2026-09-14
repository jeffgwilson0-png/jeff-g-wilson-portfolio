import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Download,
  Mail,
  Code2,
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
  Building,
  Eye,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Profile, Education, Experience, Conference, Skill, CVItem } from '../types';
import { api } from '../api/client';
import { downloadActiveCV } from '../utils/download';
import { clsx } from 'clsx';

type AboutSection = 'all' | 'skills' | 'experience' | 'education' | 'conferences';

export const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCV] = useState<CVItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [activeSection, setActiveSection] = useState<AboutSection>('all');

  useEffect(() => {
    let isMounted = true;
    const loadAboutData = async () => {
      try {
        const [profRes, eduRes, expRes, confRes, skillsRes, cvRes] = await Promise.allSettled([
          api.getProfile(),
          api.getEducation(),
          api.getExperience(true),
          api.getConferences(true),
          api.getSkills(),
          api.getActiveCV(),
        ]);
        if (!isMounted) return;
        if (profRes.status === 'fulfilled') setProfile(profRes.value);
        if (eduRes.status === 'fulfilled') setEducations(eduRes.value);
        if (expRes.status === 'fulfilled') setExperiences(expRes.value);
        if (confRes.status === 'fulfilled') setConferences(confRes.value);
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

  const handleDownloadCV = async () => {
    setDownloadingCV(true);
    try {
      await downloadActiveCV(cv?.file_url, cv?.title || 'Jeff_G_Wilson_CV.pdf');
    } catch (err) {
      console.error('Error downloading CV:', err);
    } finally {
      setDownloadingCV(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading About profile..." className="min-h-[60vh]" />;
  }

  // Group skills by category
  const categories = [
    'Machine Learning & AI',
    'Optimization & Computational Methods',
    'Programming',
    'Data Science',
    'Frameworks & Tools',
    'Cloud & Systems',
  ];
  const groupedSkills: Record<string, Skill[]> = {};
  categories.forEach((cat) => {
    groupedSkills[cat] = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
  });

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-16 pb-20 pt-4 sm:pt-8">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          About Jeff G. Wilson
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {profile?.headline || 'Computer Engineer | Data Scientist | AI / ML Researcher'}
        </p>

        {/* Section Jump Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'conferences', label: 'Conferences' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={clsx(
                'px-4 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer',
                activeSection === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:bg-[#1e1e1e] dark:text-neutral-400 dark:hover:text-white dark:border-white/10'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 1. Main Biography Section */}
      {(activeSection === 'all' || activeSection === 'experience') && (
        <section>
          <GlassCard className="p-6 sm:p-8 space-y-4 border border-neutral-200/80 bg-neutral-50 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:shadow-none">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white border-b border-neutral-200/60 dark:border-white/10 pb-3">
              Professional Overview
            </h2>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
              <p>
                {profile?.full_bio ||
                  'I am a Computer Engineering graduate currently pursuing my Master of Technology (M.Tech) in Data Science at Marwadi University. My academic and professional journey is driven by a deep fascination with transforming intricate, high-dimensional data into actionable computational intelligence.'}
              </p>
              <p>
                Beyond formal research, I actively build full-stack systems, distributed services, and high-fidelity interfaces. My focus centers on ensuring that machine learning pipelines—particularly Retrieval-Augmented Generation (RAG) models—operate with maximum factual integrity, low latency, and deterministic reliability.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/cv">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black font-semibold text-xs dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View CV</span>
                </button>
              </Link>

              <Link to="/work-with-me">
                <GlassButton variant="secondary" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
                  Work With Me
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </section>
      )}

      {/* 2. Professional Experience Timeline */}
      {(activeSection === 'all' || activeSection === 'experience') && (
        <section className="space-y-6 pt-4 border-t border-neutral-200 dark:border-white/10" id="experience">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Experience</h2>
          </div>

          {experiences.length === 0 ? (
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 dark:bg-[#161616] dark:border-white/10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No experience records published yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 md:ml-6 pl-6 md:pl-8 space-y-8">
              {experiences.map((exp) => {
                const techList = exp.technologies
                  ? exp.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                  : [];

                return (
                  <div key={exp.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] md:-left-[39px] top-4 w-3.5 h-3.5 rounded-full bg-white dark:bg-black border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors shadow-sm" />

                    <GlassCard className="p-6 space-y-3 border border-neutral-200/80 bg-neutral-50 hover:border-neutral-300 dark:border-white/10 dark:bg-[#161616] dark:hover:border-neutral-700 shadow-sm dark:shadow-none transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-200/40 dark:border-white/5 pb-3">
                        <div>
                          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            {exp.end_date || exp.is_current
                              ? `${exp.start_date} – ${exp.end_date || 'Present'}`
                              : exp.start_date}
                          </span>
                          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">{exp.role}</h3>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">{exp.company}</p>
                        </div>

                        {exp.location && (
                          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>

                      {exp.description && (
                        <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1.5 pt-1">
                          {exp.description.includes('\n') ? (
                            <ul className="space-y-1.5">
                              {exp.description
                                .split('\n')
                                .map((line) => line.replace(/^[\*\-\•]\s*/, '').trim())
                                .filter(Boolean)
                                .map((line, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
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
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-200/60 text-neutral-700 dark:bg-white/5 dark:text-neutral-400"
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
        </section>
      )}

      {/* 3. Education & Degrees */}
      {(activeSection === 'all' || activeSection === 'education') && (
        <section className="space-y-6 pt-4 border-t border-neutral-200 dark:border-white/10" id="education">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Education</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educations.map((edu) => (
              <GlassCard key={edu.id} className="p-6 space-y-3 border border-neutral-200/80 bg-neutral-50 dark:border-white/10 dark:bg-[#161616] shadow-sm dark:shadow-none">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{edu.institution}</span>
                      {edu.location ? `, ${edu.location}` : ''}
                    </p>
                    {edu.field_of_study && !edu.degree.toLowerCase().includes(edu.field_of_study.toLowerCase()) && (
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">{edu.field_of_study}</p>
                    )}
                  </div>
                  {edu.grade && (
                    <GlassBadge variant="emerald" size="sm">
                      {edu.grade}
                    </GlassBadge>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-200/40 dark:border-white/5 flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  <span>{edu.start_date} – </span>
                  <span className={edu.end_date?.toLowerCase().includes('expected') ? 'font-bold' : 'font-medium'}>
                    {edu.end_date || (edu.is_current ? 'Present' : '')}
                  </span>
                </div>

                {edu.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-200/40 dark:border-white/5">
                    {edu.description}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* 4. Conferences & Engagements */}
      {(activeSection === 'all' || activeSection === 'conferences') && (
        <section className="space-y-6 pt-4 border-t border-neutral-200 dark:border-white/10" id="conferences">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Conferences &amp; Events</h2>
          </div>

          {conferences.length === 0 ? (
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 dark:bg-[#161616] dark:border-white/10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No conference records published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conferences.map((conf) => (
                <GlassCard key={conf.id} className="p-6 space-y-3 border border-neutral-200/80 bg-neutral-50 dark:border-white/10 dark:bg-[#161616] shadow-sm dark:shadow-none flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {conf.date_string}
                      </span>
                      {conf.featured && (
                        <GlassBadge variant="emerald" size="sm">
                          Featured
                        </GlassBadge>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
                      {conf.event_name}
                    </h3>

                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <Users className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{conf.role}</span>
                      </div>
                      {conf.location && (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{conf.location}</span>
                        </div>
                      )}
                    </div>

                    {conf.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-200/40 dark:border-white/5">
                        {conf.description}
                      </p>
                    )}
                  </div>

                  {conf.external_url && (
                    <div className="pt-2">
                      <a href={conf.external_url} target="_blank" rel="noopener noreferrer">
                        <GlassButton variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Event Link
                        </GlassButton>
                      </a>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5. Technical Skills */}
      {(activeSection === 'all' || activeSection === 'skills') && (
        <section className="space-y-6 pt-4 border-t border-neutral-200 dark:border-white/10" id="skills">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Technical Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const catSkills = groupedSkills[cat] || [];
              if (catSkills.length === 0) return null;

              return (
                <GlassCard
                  key={cat}
                  className="p-5 flex flex-col justify-between border border-neutral-200/80 bg-neutral-50 dark:border-white/10 dark:bg-[#161616] shadow-sm dark:shadow-none"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-200/40 dark:border-white/5 pb-2.5">
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                        {cat}
                      </h3>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {catSkills.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {catSkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-200/70 text-neutral-800 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/10 border border-transparent dark:border-white/5 transition-colors"
                        >
                          {skill.name}
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
    </div>
  );
};
