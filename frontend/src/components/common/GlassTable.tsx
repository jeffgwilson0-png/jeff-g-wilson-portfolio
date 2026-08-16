import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassTable: React.FC<GlassTableProps> = ({ children, className, ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl glass-panel">
      <table className={twMerge(clsx('w-full text-left border-collapse text-sm', className))} {...props}>
        {children}
      </table>
    </div>
  );
};

export const GlassTableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead
      className={twMerge(
        clsx('border-b border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-on-surface-variant', className)
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export const GlassTableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr
      className={twMerge(
        clsx('border-b border-white/5 hover:bg-white/5 transition-colors duration-150', className)
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export const GlassTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td className={twMerge(clsx('px-6 py-4 text-on-surface align-middle', className))} {...props}>
      {children}
    </td>
  );
};

export const GlassTableHeadCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th className={twMerge(clsx('px-6 py-3.5 font-medium', className))} {...props}>
      {children}
    </th>
  );
};
