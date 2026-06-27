import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'success' | 'warning' | 'danger' | 'yellow' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'navy',
  className = '',
}) => {
  const variants = {
    navy: 'bg-navy-50 text-navy-700 border border-navy-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-100',
    yellow: 'bg-yellow-light text-navy-800 border border-yellow-pastel/30',
    gray: 'bg-slate-100 text-ink-muted border border-slate-200',
  };
  return (
    <span className={`chip ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
