import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Download, Mail, Menu, X, Shield, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Profile } from '../../types';
import { api } from '../../api/client';
import { downloadActiveCV } from '../../utils/download';
import { clsx } from 'clsx';

interface NavbarProps {
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ profile: initialProfile }) => {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialProfile) {
      api.getProfile().then(setProfile).catch(() => {});
    } else {
      setProfile(initialProfile);
    }

    api.getActiveCV().then((cv) => {
      if (cv && cv.file_url) {
        setCvUrl(cv.file_url);
      }
    }).catch(() => {});
  }, [initialProfile]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Projects', to: '/projects' },
    { label: 'Research', to: '/research' },
    { label: 'Experience', to: '/experience' },
    { label: 'Conferences', to: '/conferences' },
    { label: 'Work With Me', to: '/work-with-me' },
  ];

  const handleDownloadCV = async () => {
    setDownloading(true);
    try {
      await downloadActiveCV(cvUrl, 'Jeff_G_Wilson_CV.pdf');
    } catch (err) {
      console.error('Download error:', err);
      navigate('/cv');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Floating Desktop Glass Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[1300px] rounded-full border border-white/10 bg-white/[0.05] dark:bg-white/[0.04] backdrop-blur-32 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 hidden lg:flex justify-between items-center px-8 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="font-display text-lg font-extrabold tracking-tight text-on-surface hover:text-primary transition-colors flex items-center gap-2"
        >
          <span>{profile?.name ? profile.name.toUpperCase() : 'JEFF G. WILSON'}</span>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-1 xl:space-x-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-1.5 rounded-full font-body text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-primary font-bold bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.15)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <a
            href="/api/cv/download"
            download="Jeff_G_Wilson_CV.pdf"
            onClick={(e) => {
              handleDownloadCV();
            }}
            className="bg-primary text-on-primary font-label-mono text-xs font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-all duration-200 shadow-[0_0_15px_rgba(173,198,255,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'Downloading...' : 'Download CV'}</span>
          </a>

          <Link
            to="/contact"
            className="glass-panel text-on-surface font-label-mono text-xs font-medium px-4 py-2 rounded-full hover:border-primary/40 hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>Contact</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-nav px-5 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-base font-extrabold tracking-tight text-primary">
          {profile?.name || 'JEFF G. WILSON'}
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass-panel text-on-surface hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-40 bg-surface/95 backdrop-blur-3xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'px-5 py-3.5 rounded-xl font-body text-base font-medium transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  )
                }
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs text-outline opacity-60">→</span>
              </NavLink>
            ))}
            <NavLink
              to="/education"
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-3.5 rounded-xl font-body text-base text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            >
              Education & Certifications
            </NavLink>
            <NavLink
              to="/awards"
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-3.5 rounded-xl font-body text-base text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            >
              Awards & Honors
            </NavLink>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href="/api/cv/download"
              download="Jeff_G_Wilson_CV.pdf"
              onClick={() => {
                setMobileMenuOpen(false);
                handleDownloadCV();
              }}
              className="w-full bg-primary text-on-primary font-label-mono text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Downloading...' : 'Download CV'}</span>
            </a>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full glass-panel text-on-surface font-label-mono text-sm font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-center"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>Contact Me</span>
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-mono text-on-surface-variant/60 hover:text-primary py-2 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
