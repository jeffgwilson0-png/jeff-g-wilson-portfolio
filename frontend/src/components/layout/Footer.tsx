import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Twitter, Mail, Shield, ArrowUp } from 'lucide-react';
import { Profile } from '../../types';

export const Footer: React.FC<{ profile?: Profile | null }> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-white/5 bg-background py-12 mt-20 relative z-10 transition-colors duration-200">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand & Identity */}
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <Link to="/" className="font-display text-base font-bold text-on-surface hover:text-emerald-400 tracking-wider">
            {profile?.name ? profile.name.toUpperCase() : 'JEFF G. WILSON'}
          </Link>
          <p className="font-body text-xs text-on-surface-variant max-w-sm text-center md:text-left">
            Computer Engineer, Data Scientist &amp; AI Researcher. Built with Liquid Glass.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 font-mono text-xs">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {profile?.instagram_url && (
            <a
              href={profile.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
          )}
          {profile?.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </a>
          )}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          )}
        </div>

        {/* Footer Right / Back to Top & Admin */}
        <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
          <Link
            to="/admin/login"
            className="hover:text-primary transition-colors flex items-center gap-1.5 py-1 px-3 rounded-full border border-white/5 bg-white/5"
            title="Admin Console"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full glass-panel hover:border-primary/50 text-on-surface-variant hover:text-primary transition-colors"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 sm:px-8 mt-8 pt-6 border-t border-white/5 text-center text-xs font-mono text-on-surface-variant/60">
        © {new Date().getFullYear()} {profile?.name || 'Jeff G. Wilson'}. All rights reserved.
      </div>
    </footer>
  );
};
