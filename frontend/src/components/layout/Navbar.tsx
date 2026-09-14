import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Profile } from '../../types';
import { api } from '../../api/client';
import { clsx } from 'clsx';

interface NavbarProps {
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ profile: initialProfile }) => {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!initialProfile) {
      api.getProfile().then(setProfile).catch(() => {});
    } else {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Research', to: '/research' },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      {/* Floating Centered Compact Pill Nav matching Reference Image */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 rounded-full border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl shadow-lg dark:shadow-xl z-50 hidden sm:flex items-center px-4 py-1.5 gap-1.5 transition-colors duration-200">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'px-3.5 py-1 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white font-semibold shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              )
            }
          >
            {link.label}
          </NavLink>
        ))}

        <div className="pl-1.5 border-l border-neutral-200 dark:border-white/10 ml-1 flex items-center">
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <nav className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between border-b border-neutral-200 dark:border-white/10 transition-colors duration-200">
        <Link to="/" className="font-display text-base font-bold tracking-tight text-neutral-900 dark:text-white">
          {profile?.name || 'JEFF G. WILSON'}
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[52px] bottom-0 z-40 bg-[#121212]/98 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  )
                }
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs opacity-50">→</span>
              </NavLink>
            ))}
            <NavLink
              to="/work-with-me"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-neutral-400 hover:text-white"
            >
              Work With Me
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium text-neutral-400 hover:text-white"
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};
