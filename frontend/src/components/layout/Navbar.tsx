import React from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { Profile } from '../../types';
import { clsx } from 'clsx';

interface NavbarProps {
  profile?: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Research', to: '/research' },
    { label: 'About', to: '/about' },
  ];

  return (
    <nav
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 rounded-full border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl shadow-lg dark:shadow-xl z-50 flex items-center px-2.5 sm:px-4 py-1 sm:py-1.5 gap-0.5 sm:gap-1.5 max-w-[calc(100vw-16px)] transition-colors duration-200 whitespace-nowrap"
      aria-label="Main Navigation"
    >
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            clsx(
              'px-2.5 sm:px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors shrink-0',
              isActive
                ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white font-semibold shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            )
          }
        >
          {link.label}
        </NavLink>
      ))}

      <div className="pl-1 sm:pl-1.5 border-l border-neutral-200 dark:border-white/10 ml-0.5 sm:ml-1 flex items-center shrink-0">
        <ThemeToggle />
      </div>
    </nav>
  );
};
