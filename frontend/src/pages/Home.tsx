import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  Brain,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  BookOpen,
  GraduationCap,
  Eye,
  Briefcase,
  MapPin,
  Cpu,
  Cloud,
  BarChart3,
  Layers
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  PythonIcon,
  TensorFlowIcon,
  KerasIcon,
  ScikitLearnIcon,
  NumPyIcon
} from '../components/common/TechIcons';
import { Profile, Research, Skill, CVItem, Experience } from '../types';
import { api } from '../api/client';
import { downloadActiveCV } from '../utils/download';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredResearch, setFeaturedResearch] = useState<Research[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCV] = useState<CVItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingCV, setDownloadingCV] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [profRes, resRes, expRes, skillsRes, cvRes] = await Promise.allSettled([
          api.getProfile(),
          api.getResearch({ featured: true, published_only: true }),
          api.getExperience(true),
          api.getSkills({ featured_only: true }),
          api.getActiveCV(),
        ]);

        if (!isMounted) return;

        if (profRes.status === 'fulfilled') setProfile(profRes.value);
        if (resRes.status === 'fulfilled') setFeaturedResearch(resRes.value);
        if (expRes.status === 'fulfilled') setExperiences(expRes.value);
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

  const handleDownloadCV = async () => {
    setDownloadingCV(true);
    try {
      await downloadActiveCV(cv?.file_url, cv?.title || 'Jeff_G_Wilson_CV.pdf');
    } catch (err) {
      console.error('Error downloading CV:', err);
      navigate('/cv');
    } finally {
      setDownloadingCV(false);
    }
  };

  const primaryResearch = featuredResearch && featuredResearch.length > 0 ? featuredResearch[0] : null;
  const primaryExperience = experiences && experiences.length > 0 ? experiences[0] : null;

  // Curated Research Interests
  const researchInterests = [
    'Scientific Machine Learning',
    'Scientific Foundation Models',
    'Deep Learning',
    'Trustworthy and Uncertainty-Aware AI',
    'Multimodal Learning',
    'Inverse Problems',
    'Machine Learning for Complex Systems',
    'Representation Learning',
    'Constraint-Aware Machine Learning',
    'Generalization and Transfer Learning',
  ];

  // Signature Tech Stack matching reference image
  const coreTechStack = [
    { name: 'Python', icon: <PythonIcon size={52} /> },
    { name: 'TensorFlow', icon: <TensorFlowIcon size={52} /> },
    { name: 'Keras', icon: <KerasIcon size={52} /> },
    { name: 'Scikit-learn', icon: <ScikitLearnIcon size={52} /> },
    { name: 'NumPy', icon: <NumPyIcon size={52} /> },
  ];

  // Curated Technical Skills
  const technicalSkillGroups = [
    {
      category: 'Machine Learning & AI',
      icon: <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: [
        'Machine Learning',
        'Predictive Modelling',
        'Natural Language Processing',
        'Multimodal Learning',
        'Trustworthy AI',
      ],
    },
    {
      category: 'Optimization & Computational Methods',
      icon: <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: [
        'Genetic Algorithms',
        'Constraint-Based Optimization',
        'Algorithmic Problem Solving',
        'Data Preprocessing',
      ],
    },
    {
      category: 'Programming',
      icon: <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: ['Python', 'Java', 'JavaScript'],
    },
    {
      category: 'Data Science',
      icon: <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: [
        'Data Analytics',
        'Statistical Evaluation',
        'Machine Learning with Python',
      ],
    },
    {
      category: 'Frameworks & Tools',
      icon: <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: ['NLTK', 'Django', 'OpenCV', 'ChromaDB'],
    },
    {
      category: 'Cloud & Systems',
      icon: <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      skills: ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Linux', 'Windows'],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner size="lg" />
        <span className="font-mono text-xs text-neutral-400 tracking-wider">
          LOADING PORTFOLIO...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-16 pb-20 pt-4 sm:pt-8">
      {/* 1. Hero Section matching Reference Image */}
      <section className="flex flex-col items-center text-center">
        {/* Profile Avatar */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-neutral-300 dark:border-white/20 shadow-lg">
          <img
            src={profile?.avatar_url || '/avatar.jpg'}
            alt={profile?.name || 'Jeff G. Wilson'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/avatar.jpg';
            }}
          />
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.16] mt-6 mb-4 max-w-2xl mx-auto">
          Hi, I'm {profile?.name || 'Jeff G. Wilson'}, AI,
          <br />
          Machine Learning &amp;
          <br />
          Software Engineer
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed mb-6">
          {profile?.short_bio ||
            'I build practical Machine Learning and AI solutions that fit your business. From seamless integration into existing systems to complete AI-powered applications that cover everything from concept to launch.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Link to="/contact">
            <button className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-md cursor-pointer">
              Contact Me
            </button>
          </Link>

          <Link to="/work-with-me">
            <button className="flex items-center gap-2 border border-neutral-200 bg-neutral-100 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm">Available for new projects</span>
            </button>
          </Link>

          <Link to="/cv">
            <button
              className="flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-3.5 py-2.5 rounded-full text-xs font-mono transition-colors shadow-sm cursor-pointer"
              title="View Curriculum Vitae"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>View CV</span>
            </button>
          </Link>
        </div>

        {/* Social Links Row */}
        <div className="flex items-center justify-center gap-6 text-neutral-500 dark:text-neutral-400 mb-12">
          <a
            href={profile?.github_url || 'https://github.com'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={profile?.linkedin_url || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={profile?.twitter_url || 'https://x.com'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </section>

      {/* 2. Tech Stack Section matching Reference Image */}
      <section className="w-full flex flex-col items-center text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 text-center">Tech Stack</h2>

        {/* Horizontal centered row of icons and labels */}
        <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap max-w-2xl mx-auto pb-4">
          {coreTechStack.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center gap-2.5 shrink-0 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                {tech.icon}
              </div>
              <span className="text-xs text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white font-medium transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Latest Experience Spotlight */}
      {primaryExperience && (
        <section className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Experience</h2>
            </div>
            <Link
              to="/about#experience"
              className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <GlassCard className="p-6 sm:p-8 space-y-4 border border-neutral-200/80 bg-neutral-50 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/40 dark:border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {primaryExperience.start_date} – {primaryExperience.end_date || (primaryExperience.is_current ? 'Present' : '')}
                  </span>
                  {primaryExperience.is_current && (
                    <GlassBadge variant="emerald" size="sm">
                      Current
                    </GlassBadge>
                  )}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {primaryExperience.role}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {primaryExperience.company}
                </p>
              </div>

              {primaryExperience.location && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{primaryExperience.location}</span>
                </div>
              )}
            </div>

            {primaryExperience.description && (
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1.5">
                {primaryExperience.description.includes('\n') ? (
                  <ul className="space-y-1.5">
                    {primaryExperience.description
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
                  <p>{primaryExperience.description}</p>
                )}
              </div>
            )}

            {primaryExperience.technologies && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-200/40 dark:border-white/5">
                {primaryExperience.technologies
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tech) => (
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
        </section>
      )}

      {/* 4. Research Interests */}
      <section className="space-y-5 pt-4 border-t border-neutral-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Research Interests</h2>
          </div>
          <Link
            to="/research"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Research Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {researchInterests.map((interest, idx) => (
            <div
              key={interest}
              className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50 hover:border-neutral-300 dark:border-white/10 dark:bg-[#161616] dark:hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group shadow-sm dark:shadow-none"
            >
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {interest}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Technical Skills */}
      <section className="space-y-5 pt-4 border-t border-neutral-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Technical Skills</h2>
          </div>
          <Link
            to="/about#skills"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicalSkillGroups.map((group) => (
            <GlassCard
              key={group.category}
              className="p-5 flex flex-col justify-between border border-neutral-200/80 bg-neutral-50 hover:border-neutral-300 dark:border-white/10 dark:bg-[#161616] dark:hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-none"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    {group.icon}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-200/70 text-neutral-800 dark:bg-white/5 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/10 border border-transparent dark:border-white/5 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 6. Brief Biography & Contact CTA */}
      <section className="pt-4 border-t border-neutral-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">About Jeff G. Wilson</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {profile?.full_bio ||
              'Computer Engineering graduate currently pursuing an M.Tech in Data Science at Marwadi University. Focused on engineering dependable, high-scale software applications and robust AI systems.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/about">
              <GlassButton variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Full Biography
              </GlassButton>
            </Link>

            <Link to="/cv">
              <button
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-300 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 text-xs font-mono dark:text-neutral-300 dark:hover:text-white dark:hover:border-neutral-500 transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>View CV</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="md:col-span-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 dark:bg-[#161616] dark:border-white/10 shadow-sm dark:shadow-none flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Available for Work</span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">Have a project?</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Let's discuss and engineer the right solution.</p>
          </div>
          <Link to="/work-with-me">
            <button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black font-semibold py-2 px-4 rounded-full text-xs dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm">
              Start An Inquiry
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
