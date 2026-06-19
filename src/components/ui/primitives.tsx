export function Avatar({
  name,
  color = 'bg-navy-700',
  size = 'md',
  className = '',
}: {
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const sizeMap = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white ${sizeMap[size]} ${color} ${className}`}
    >
      {initials}
    </div>
  );
}

export function Progress({
  value,
  max = 100,
  className = '',
  color,
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor =
    color ?? (pct > 75 ? 'bg-success' : pct >= 60 ? 'bg-warning' : 'bg-danger');
  return (
    <div className={`h-2 w-full rounded-full bg-navy-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  variant = 'navy',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'navy' | 'success' | 'warning' | 'danger' | 'yellow' | 'gray';
  className?: string;
}) {
  const variants = {
    navy: 'bg-navy-50 text-navy-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    yellow: 'bg-yellow-light text-navy-800',
    gray: 'bg-slate-100 text-ink-muted',
  };
  return <span className={`chip ${variants[variant]} ${className}`}>{children}</span>;
}

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`card ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-ink-muted/40">{icon}</div>}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
