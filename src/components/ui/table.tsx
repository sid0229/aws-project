import React from 'react';

export const TableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto scrollbar-thin ${className}`}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
};

export const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <th className={`border-b border-border bg-navy-50/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted ${className}`}>
      {children}
    </th>
  );
};

export const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <td className={`border-b border-border px-4 py-3 text-ink ${className}`}>{children}</td>
  );
};
