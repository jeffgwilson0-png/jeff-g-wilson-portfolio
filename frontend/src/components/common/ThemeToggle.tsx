import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { clsx } from 'clsx';

export const ThemeToggle: React.FC<{ showLabel?: boolean; className?: string }> = ({
  className,
}) => {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer',
        effectiveTheme === 'dark'
          ? 'text-neutral-400 hover:text-white hover:bg-white/10'
          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60',
        className
      )}
      title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme"
    >
      {effectiveTheme === 'dark' ? (
        <Moon className="w-3.5 h-3.5" />
      ) : (
        <Sun className="w-3.5 h-3.5 text-amber-500" />
      )}
    </button>
  );
};
