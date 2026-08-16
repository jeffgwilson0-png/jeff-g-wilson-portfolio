import React from 'react';
import { Inbox } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are currently no records available in this category.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-panel border border-white/5 my-6">
      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant mb-4 border border-white/10">
        {icon || <Inbox className="w-7 h-7 text-primary/70" />}
      </div>
      <h3 className="font-display text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p className="font-body text-sm text-on-surface-variant max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <GlassButton variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </GlassButton>
      )}
    </div>
  );
};
