import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './primitives';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: 'navy' | 'yellow' | 'success' | 'warning' | 'danger';
  footer?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'navy',
  footer,
}) => {
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
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-800 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export interface SectionTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, description, action }) => {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-bold text-navy-800">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
};

export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search…' }) => {
  return (
    <div className="relative w-full max-w-sm">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
};

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPage }) => {
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
          className="rounded-lg border border-border bg-white p-1.5 text-ink-muted transition hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="rounded-lg border border-border bg-white p-1.5 text-ink-muted transition hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export interface TabsProps {
  tabs: { key: string; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  active: string;
  onChange: (key: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange }) => {
  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'border-navy-800 text-navy-800'
                  : 'border-transparent text-ink-muted hover:border-navy-200 hover:text-ink'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export { EmptyState } from './primitives';
export { Avatar, Progress as ProgressBar, Card, Badge } from './primitives';
