import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassBadgeProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-md font-mono tracking-wider',
    md: 'text-xs px-3 py-1 rounded-full font-mono tracking-wide',
  };

  const variantStyles = {
    primary: 'bg-primary/10 text-primary border border-primary/30',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/30',
    tertiary: 'bg-tertiary/10 text-tertiary border border-tertiary/30',
    outline: 'border border-white/15 text-on-surface-variant bg-white/5',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    error: 'bg-error/10 text-error border border-error/30',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium select-none',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
