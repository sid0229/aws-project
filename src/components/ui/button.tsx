import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'navy' | 'yellow' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'navy',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-navy-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    navy: 'bg-navy-800 text-white hover:bg-navy-700 hover:shadow-lift',
    yellow: 'bg-yellow-pastel text-navy-800 hover:bg-yellow-light hover:shadow-lift font-semibold',
    outline: 'border border-border bg-white text-ink hover:bg-navy-50 hover:border-navy-200',
    ghost: 'text-ink-muted hover:bg-navy-50 hover:text-navy-800',
    danger: 'bg-danger text-white hover:bg-red-600 hover:shadow-lift',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
