import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Option {
  value: string | number;
  label: string;
}

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Option[];
  error?: string;
  helperText?: string;
  children?: React.ReactNode;
}

export const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, options, error, helperText, className, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant font-medium">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={twMerge(
            clsx(
              'ghost-input rounded-xl px-4 py-3 text-sm text-on-surface bg-surface w-full cursor-pointer',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface-container-high text-on-surface">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <span className="text-xs font-label-mono text-error">{error}</span>}
        {!error && helperText && <span className="text-xs font-label-mono text-on-surface-variant/70">{helperText}</span>}
      </div>
    );
  }
);

GlassSelect.displayName = 'GlassSelect';
