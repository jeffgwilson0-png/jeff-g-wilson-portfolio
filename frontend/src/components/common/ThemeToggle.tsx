import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { clsx } from 'clsx';

export const ThemeToggle: React.FC<{ showLabel?: boolean; className?: string }> = ({
  showLabel = false,
  className,
}) => {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <div
      className={clsx(
        'inline-flex items-center p-1 rounded-full glass-panel border border-white/10 bg-white/5',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme('dark')}
        title="Dark Theme"
        className={clsx(
          'p-1.5 rounded-full transition-all duration-200 flex items-center gap-1 text-xs',
          theme === 'dark'
            ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        {showLabel && <span className="font-mono text-[11px] pr-1">Dark</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('light')}
        title="Light Theme"
        className={clsx(
          'p-1.5 rounded-full transition-all duration-200 flex items-center gap-1 text-xs',
          theme === 'light'
            ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        {showLabel && <span className="font-mono text-[11px] pr-1">Light</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        title="System Preference"
        className={clsx(
          'p-1.5 rounded-full transition-all duration-200 flex items-center gap-1 text-xs',
          theme === 'system'
            ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
            : 'text-on-surface-variant hover:text-on-surface'
        )}
      >
        <Laptop className="w-3.5 h-3.5" />
        {showLabel && <span className="font-mono text-[11px] pr-1">Auto</span>}
      </button>
    </div>
  );
};
