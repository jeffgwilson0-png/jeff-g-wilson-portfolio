import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string; className?: string }> = ({
  size = 'md',
  text,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <Loader2 className={clsx('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="font-mono text-xs text-on-surface-variant animate-pulse">{text}</p>}
    </div>
  );
};
