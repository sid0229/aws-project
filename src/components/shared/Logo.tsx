import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'compact';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: variant === 'compact' ? 'h-6 w-6' : 'h-6',
    sm: variant === 'compact' ? 'h-8 w-8' : 'h-8',
    md: variant === 'compact' ? 'h-10 w-10' : 'h-10',
    lg: variant === 'compact' ? 'h-14 w-14' : 'h-14',
    xl: variant === 'compact' ? 'h-20 w-20' : 'h-20',
  };

  const src = variant === 'compact' ? '/favicon.png' : '/logo.png';
  const alt = variant === 'compact' ? 'ClassPulse Brand Mark' : 'ClassPulse Full Logo';

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};
export default Logo;
