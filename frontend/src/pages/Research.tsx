import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Mail,
  Eye,
  FlaskConical,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';

export const Research: React.FC = () => {
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

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 space-y-12 pb-20 pt-4 sm:pt-8">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-8 h-1 bg-emerald-400 rounded-full mx-auto" />
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Research Profile
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">
          Scientific Machine Learning • Trustworthy AI • Computational Modelling
        </p>
      </header>

      {/* 1. Main Research Profile Statement Card */}
      <GlassCard className="p-6 sm:p-10 space-y-6 border border-neutral-200/80 bg-neutral-50 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:shadow-none">
        <div className="flex items-center gap-2.5 border-b border-neutral-200/60 dark:border-white/10 pb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Overview &amp; Research Agenda
            </h2>
            <p className="text-xs font-mono text-neutral-500">
              Jeff G. Wilson • Research Assistant
            </p>
          </div>
        </div>

        {/* The Exact User-Provided Research Profile Text */}
        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed sm:leading-loose">
          Computer Engineering graduate and current M.Tech. Data Science student with a growing research focus on machine learning, deep learning, trustworthy AI, and computational modelling. Experienced in Python-based machine learning, predictive modelling, natural language processing, multimodal AI, genetic algorithms, and constraint-based optimization. Research experience includes a submitted IEEE conference paper on a trustworthy retrieval-augmented multimodal framework for AI-generated misinformation detection. Currently working as a University Teaching Assistant while developing research and technical communication skills. Interested in developing reliable and generalizable machine-learning methods for complex scientific problems, particularly learning from incomplete, heterogeneous, or indirect observations.
        </p>

        <div className="pt-2 flex flex-wrap gap-3 border-t border-neutral-200/40 dark:border-white/5 items-center">
          <Link to="/contact">
            <button className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-5 py-2.5 rounded-full text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact for Collaboration</span>
            </button>
          </Link>

          <Link to="/cv">
            <button className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/60 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2.5 rounded-full text-xs font-mono transition-colors cursor-pointer">
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>View CV</span>
            </button>
          </Link>
        </div>
      </GlassCard>

      {/* 2. Research Experience */}
      <section className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Research Experience</h2>
        </div>

        <GlassCard className="p-6 sm:p-8 space-y-5 border border-neutral-200/80 bg-neutral-50 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:shadow-none">
          <div className="space-y-2 border-b border-neutral-200/40 dark:border-white/5 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <GlassBadge variant="emerald" size="sm">
                Submitted / Under Review
              </GlassBadge>
              <span className="font-mono text-xs text-neutral-500">
                IEEE Conference
              </span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-900 dark:text-white leading-snug">
              TrustRAG: A Trustworthy Retrieval-Augmented Multimodal Framework for Real-Time AI-Generated Misinformation Detection
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Research Project / IEEE Conference Submitted — Marwadi University
            </p>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Designed a multimodal machine-learning framework combining text and visual information for AI-generated misinformation detection.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Integrated text representations, image-derived features, retrieval-based evidence, and model reasoning into a unified pipeline.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Developed a trustworthiness layer combining model confidence and evidence agreement to assess prediction reliability.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Evaluated the proposed framework using benchmark datasets and multiple performance metrics.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Applied statistical significance testing across multiple random seeds to assess the robustness of experimental results.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>Investigated approaches for improving the reliability, interpretability, and evidence support of machine-learning predictions.</span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-200/40 dark:border-white/5">
            {[
              'Multimodal AI',
              'Retrieval-Augmented Generation (RAG)',
              'Misinformation Detection',
              'Trustworthy ML',
              'Statistical Testing',
              'Model Calibration'
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-200/60 text-neutral-700 dark:bg-white/5 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* 3. Research Interests Focus Area Tags */}
      <section className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Core Research Interests</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {researchInterests.map((interest, idx) => (
            <div
              key={interest}
              className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50 hover:border-neutral-300 dark:border-white/10 dark:bg-[#161616] dark:hover:border-emerald-500/40 transition-all flex items-center gap-3 group shadow-sm dark:shadow-none"
            >
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {interest}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
