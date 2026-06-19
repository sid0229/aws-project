import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/primitives';

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'navy',
  footer,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: 'navy' | 'yellow' | 'success' | 'warning' | 'danger';
  footer?: string;
}) {
  const accents: Record<string, string> = {
    navy: 'bg-navy-50 text-navy-700',
    yellow: 'bg-yellow-light text-navy-800',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-rose-50 text-rose-600',
  };
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${trend.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-navy-800">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
      {footer && <p className="mt-2 text-xs text-ink-muted/80">{footer}</p>}
    </Card>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-bold text-navy-800">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  // not used directly — inline in tables for icons; kept for reusability
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 py-3">
      <p className="text-xs text-ink-muted">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="rounded-lg border border-border bg-white p-1.5 text-ink-muted transition hover:bg-navy-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`h-8 min-w-[2rem] rounded-lg px-2 text-sm font-medium transition ${
              p === page
                ? 'bg-navy-800 text-white'
                : 'border border-border bg-white text-ink-muted hover:bg-navy-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="rounded-lg border border-border bg-white p-1.5 text-ink-muted transition hover:bg-navy-50 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`border-b border-border bg-navy-50/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-border px-4 py-3 text-ink ${className}`}>{children}</td>;
}
