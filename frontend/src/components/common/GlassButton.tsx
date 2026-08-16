import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-label-mono font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-full gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2',
    lg: 'text-base px-8 py-3.5 rounded-full gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(173,198,255,0.3)] font-bold',
    secondary: 'glass-panel text-on-surface hover:border-primary/50 hover:bg-white/10 dark:hover:bg-white/10',
    ghost: 'text-on-surface-variant hover:text-primary hover:bg-white/5',
    danger: 'bg-error/20 border border-error/40 text-error hover:bg-error hover:text-on-error',
    pill: 'glass-panel text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/60',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
