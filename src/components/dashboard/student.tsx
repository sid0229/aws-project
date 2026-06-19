import { useState } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CalendarCheck,
  FolderOpen,
  Megaphone,
  Download,
  FileText,
  ArrowRight,
  CheckCircle2,
  Circle,
  BookOpen,
} from 'lucide-react';
import { demoData } from '../../lib/demo-data';
import { Avatar, Badge, Card, Progress } from '../ui/primitives';
import { StatCard, SectionHeader, TableContainer, Th, Td } from './widgets';
import { useAuth } from '../../lib/auth';

const PIE_COLORS = ['#0B1F3A', '#16355C', '#475C84', '#FFE88A', '#22C55E', '#F59E0B'];

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

// -------- Dashboard Overview --------
export function StudentOverview({ onNavigate }: { onNavigate: (k: any) => void }) {
  const { attendanceSubjects, resources, announcements, marksData, attendanceTrend } = demoData;
  const overallAtt = Math.round(
    (attendanceSubjects.reduce((a, s) => a + s.attended, 0) / attendanceSubjects.reduce((a, s) => a + s.total, 0)) * 100
  );
  const unread = announcements.filter((a) => !a.read).length;

  const subjectBreakdown = attendanceSubjects.map((s) => ({
    name: s.code,
    value: Math.round((s.attended / s.total) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="overflow-hidden border-0 bg-navy-800 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-200">Good afternoon,</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Aarav Sharma</h2>
            <p className="mt-2 text-sm text-navy-200">CSE - 3rd Year A · Roll No. CS-A001</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-xs text-navy-200">Overall Attendance</p>
              <p className="font-display text-3xl font-bold text-yellow-pastel">{overallAtt}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance" value={`${overallAtt}%`} icon={CalendarCheck} accent="success" trend={{ value: '+2%', up: true }} />
        <StatCard label="Subjects" value={attendanceSubjects.length} icon={BookOpen} accent="navy" footer="Enrolled this semester" />
        <StatCard label="Resources" value={resources.length} icon={FolderOpen} accent="yellow" footer="New this week" />
        <StatCard label="Unread Updates" value={unread} icon={Megaphone} accent="warning" footer="Tap to view" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Attendance Trend" description="Weekly attendance percentage" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE88A" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#FFE88A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <RTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="attendance" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#attGrad)" />
                <Area type="monotone" dataKey="average" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="By Subject" description="Attendance per subject" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subjectBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {subjectBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjectBreakdown.map((s, i) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {s.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent activity row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader
            title="Recent Marks"
            action={
              <button onClick={() => onNavigate('marks')} className="btn-ghost text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {marksData.slice(0, 4).map((m) => {
              const total = m.internal + m.midsem + m.endsem;
              const max = m.maxInternal + m.maxMidsem + m.maxEndsem;
              const pct = Math.round((total / max) * 100);
              return (
                <div key={m.subject} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{m.subject}</p>
                    <p className="text-xs text-ink-muted">{total}/{max} · {pct}%</p>
                  </div>
                  <Badge variant={pct >= 75 ? 'success' : pct >= 60 ? 'warning' : 'danger'}>
                    {pct >= 75 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs work'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Latest Announcements"
            action={
              <button onClick={() => onNavigate('announcements')} className="btn-ghost text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {announcements.slice(0, 4).map((a) => (
              <button
                key={a.id}
                onClick={() => onNavigate('announcements')}
                className="w-full rounded-xl border border-border p-3 text-left transition hover:border-navy-200 hover:bg-navy-50/50"
              >
                <div className="flex items-start gap-2">
                  {!a.read ? <Circle className="mt-1 h-3 w-3 shrink-0 text-warning" /> : <CheckCircle2 className="mt-1 h-3 w-3 shrink-0 text-ink-muted/40" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">{a.message}</p>
                    <p className="mt-1 text-[11px] text-ink-muted/80">{a.teacher} · {a.date}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// -------- Attendance --------
export function StudentAttendance() {
  const { attendanceSubjects } = demoData;
  const overall = Math.round(
    (attendanceSubjects.reduce((a, s) => a + s.attended, 0) / attendanceSubjects.reduce((a, s) => a + s.total, 0)) * 100
  );
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Overall Attendance</p>
          <p className="mt-1 font-display text-4xl font-bold text-navy-800">{overall}%</p>
          <Progress value={overall} className="mt-3" />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Classes Attended</p>
          <p className="mt-1 font-display text-4xl font-bold text-navy-800">{attendanceSubjects.reduce((a, s) => a + s.attended, 0)}</p>
          <p className="mt-2 text-xs text-ink-muted">across {attendanceSubjects.length} subjects</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Subjects at Risk</p>
          <p className="mt-1 font-display text-4xl font-bold text-danger">
            {attendanceSubjects.filter((s) => s.attended / s.total < 0.75).length}
          </p>
          <p className="mt-2 text-xs text-ink-muted">below 75% threshold</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-display text-lg font-bold text-navy-800">Subject-wise Attendance</h2>
          <p className="mt-0.5 text-sm text-ink-muted">Detailed breakdown with progress indicators</p>
        </div>
        <TableContainer>
          <thead>
            <tr>
              <Th>Subject</Th>
              <Th>Code</Th>
              <Th>Attended</Th>
              <Th>Total</Th>
              <Th>Percentage</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {attendanceSubjects.map((s) => {
              const pct = Math.round((s.attended / s.total) * 100);
              const status = pct > 75 ? 'success' : pct >= 60 ? 'warning' : 'danger';
              return (
                <tr key={s.code} className="transition hover:bg-navy-50/40">
                  <Td>
                    <div>
                      <p className="font-medium text-ink">{s.subject}</p>
                      <p className="text-xs text-ink-muted">{s.teacher}</p>
                    </div>
                  </Td>
                  <Td><Badge variant="gray">{s.code}</Badge></Td>
                  <Td><span className="font-semibold text-navy-800">{s.attended}</span></Td>
                  <Td className="text-ink-muted">{s.total}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="w-24" />
                      <span className="w-12 text-sm font-semibold text-ink">{pct}%</span>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={status as any}>
                      {pct > 75 ? 'On track' : pct >= 60 ? 'At risk' : 'Critical'}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableContainer>
      </Card>
    </div>
  );
}

// -------- Resources --------
export function StudentResources() {
  const { resources } = demoData;
  const [subjects] = useState(['All', ...new Set(resources.map((r) => r.subject))]);
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? resources : resources.filter((r) => r.subject === filter);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-800">Resource Library</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{filtered.length} resources available for download</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === s ? 'bg-navy-800 text-white' : 'border border-border bg-white text-ink-muted hover:bg-navy-50'
                }`}
              >
                {s.length > 20 ? s.slice(0, 18) + '…' : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id} hover className="flex flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                <FileText className="h-6 w-6 text-rose-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">PDF Document</p>
                <h3 className="mt-0.5 leading-tight font-semibold text-navy-800">{r.title}</h3>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-ink-muted">
              <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {r.subject}</p>
              <p>Uploaded by {r.uploadedBy}</p>
              <p>{r.uploadedDate} · {r.size}</p>
              <p className="text-ink-muted/80">{r.downloads} downloads</p>
            </div>
            <button className="btn-outline mt-4 w-full">
              <Download className="h-4 w-4" />
              Download
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// -------- Announcements --------
export function StudentAnnouncements() {
  const { announcements } = demoData;
  const [items, setItems] = useState(announcements);
  const catColor: Record<string, any> = {
    general: 'navy',
    exam: 'yellow',
    event: 'success',
    urgent: 'danger',
  };
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mb-6 p-5">
        <h2 className="font-display text-lg font-bold text-navy-800">Announcements</h2>
        <p className="mt-0.5 text-sm text-ink-muted">{items.filter((a) => !a.read).length} unread · {items.length} total</p>
      </Card>
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-5">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <div className={`absolute -left-[18px] top-3 h-3 w-3 rounded-full ring-4 ring-bg ${a.read ? 'bg-ink-muted/30' : catColor[a.category] === 'danger' ? 'bg-danger' : catColor[a.category] === 'success' ? 'bg-success' : catColor[a.category] === 'yellow' ? 'bg-warning' : 'bg-navy-700'}`} />
              <Card className="p-5" >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={catColor[a.category]}>{a.category}</Badge>
                    {!a.read && <Badge variant="warning">Unread</Badge>}
                  </div>
                  <span className="text-xs text-ink-muted">{a.date}</span>
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-navy-800">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{a.message}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <Avatar name={a.teacher} size="xs" />
                  <span className="text-xs font-medium text-ink">{a.teacher}</span>
                </div>
                {!a.read && (
                  <button
                    onClick={() => setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, read: true } : x)))}
                    className="btn-ghost mt-2 text-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark as read
                  </button>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------- Marks --------
export function StudentMarks() {
  const { marksData } = demoData;
  const overall = marksData.map((m) => {
    const total = m.internal + m.midsem + m.endsem;
    const max = m.maxInternal + m.maxMidsem + m.maxEndsem;
    return Math.round((total / max) * 100);
  });
  const avg = Math.round(overall.reduce((a, b) => a + b, 0) / overall.length);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-navy-800 p-5 text-white">
          <p className="text-sm text-navy-200">Overall Score</p>
          <p className="mt-1 font-display text-4xl font-bold text-yellow-pastel">{avg}%</p>
          <p className="mt-2 text-xs text-navy-200">Across {marksData.length} subjects</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Highest</p>
          <p className="mt-1 font-display text-4xl font-bold text-success">{Math.max(...overall)}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Lowest</p>
          <p className="mt-1 font-display text-4xl font-bold text-warning">{Math.min(...overall)}%</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {marksData.map((m) => {
          const total = m.internal + m.midsem + m.endsem;
          const max = m.maxInternal + m.maxMidsem + m.maxEndsem;
          const pct = Math.round((total / max) * 100);
          return (
            <Card key={m.subject} hover className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-navy-800">{m.subject}</h3>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-navy-800">{pct}%</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Internal', value: m.internal, max: m.maxInternal },
                  { label: 'Mid Sem', value: m.midsem, max: m.maxMidsem },
                  { label: 'End Sem', value: m.endsem, max: m.maxEndsem },
                ].map((x) => {
                  const xp = Math.round((x.value / x.max) * 100);
                  return (
                    <div key={x.label} className="rounded-xl border border-border p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{x.label}</p>
                      <p className="mt-1 font-display text-lg font-bold text-navy-800">{x.value}<span className="text-xs text-ink-muted">/{x.max}</span></p>
                      <Progress value={xp} className="mt-2" />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-ink-muted">Total: <span className="font-semibold text-ink">{total}/{max}</span></span>
                <Badge variant={pct >= 75 ? 'success' : pct >= 60 ? 'warning' : 'danger'}>
                  {pct >= 75 ? 'Distinction' : pct >= 60 ? 'Pass' : 'At risk'}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// -------- Profile --------
export function StudentProfile() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="overflow-hidden">
        <div className="h-24 bg-navy-800" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar name={user?.name ?? 'Student'} color={user?.avatarColor ?? 'bg-navy-700'} size="lg" className="ring-4 ring-white" />
            <button className="btn-outline">Edit Profile</button>
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-navy-800">{user?.name}</h2>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Roll No', value: 'CS-A001' },
              { label: 'Class', value: 'CSE 3-A' },
              { label: 'Semester', value: '5th' },
              { label: 'CGPA', value: '8.4' },
            ].map((x) => (
              <div key={x.label} className="rounded-xl border border-border p-3">
                <p className="text-xs text-ink-muted">{x.label}</p>
                <p className="mt-0.5 font-semibold text-navy-800">{x.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-display text-base font-bold text-navy-800">Account Settings</h3>
        <div className="mt-4 space-y-4">
          {[
            { label: 'Full Name', value: user?.name ?? '' },
            { label: 'Email', value: user?.email ?? '' },
            { label: 'Phone', value: '+91 98765 43210' },
            { label: 'Department', value: 'Computer Science & Engineering' },
          ].map((f) => (
            <div key={f.label}>
              <label className="label">{f.label}</label>
              <input className="input" defaultValue={f.value} />
            </div>
          ))}
          <button className="btn-navy">Save Changes</button>
        </div>
      </Card>
    </div>
  );
}

