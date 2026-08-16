import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant font-medium">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'ghost-input rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )
          )}
          {...props}
        />
        {error && <span className="text-xs font-label-mono text-error">{error}</span>}
        {!error && helperText && <span className="text-xs font-label-mono text-on-surface-variant/70">{helperText}</span>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
