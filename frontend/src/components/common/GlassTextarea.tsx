import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant font-medium">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={twMerge(
            clsx(
              'ghost-input rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 w-full resize-none',
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

GlassTextarea.displayName = 'GlassTextarea';
