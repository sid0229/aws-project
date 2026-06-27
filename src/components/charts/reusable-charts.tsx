import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-lift">
      {label && <p className="text-xs font-semibold text-navy-800">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-ink-muted">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5 align-middle" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-ink">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export interface AttendanceTrendChartProps {
  data: { week: string; attendance: number; average?: number }[];
}

export const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({ data }) => {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1F3A" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#0B1F3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#tGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface ClassPerformanceChartProps {
  data: { name: string; attendance: number; performance: number }[];
}

export const ClassPerformanceChart: React.FC<ClassPerformanceChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="attendance" name="Attendance" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="performance" name="Performance" fill="#FFE88A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface ResourceUsageChartProps {
  data: { month: string; uploads: number; downloads: number }[];
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="uploads" name="Uploads" stroke="#2E426A" strokeWidth={2} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="downloads" name="Downloads" stroke="#22C55E" strokeWidth={2} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface AnnouncementEngagementChartProps {
  data: { name: string; views: number; actions: number }[];
}

export const AnnouncementEngagementChart: React.FC<AnnouncementEngagementChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="views" name="Views" fill="#0B1F3A" radius={[0, 4, 4, 0]} />
          <Bar dataKey="actions" name="Interactions" fill="#22C55E" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
