import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Users,
  GraduationCap,
  BookCopy,
  FolderOpen,
  TrendingUp,
  Search,
  UserPlus,
  Upload,
  MoreHorizontal,
  Mail,
  Trash2,
  Pencil,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import { demoData } from '../../lib/demo-data';
import { Avatar, Badge, Card, Progress } from '../ui/primitives';
import { StatCard, SectionHeader, TableContainer, Th, Td, Pagination } from './widgets';
import { Modal } from '../ui/modal';
import { useToast } from '../ui/toast';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-lift">
      {label && <p className="text-xs font-semibold text-navy-800">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-ink-muted">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-semibold text-ink">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// -------- Admin Overview --------
export function AdminOverview() {
  const { students, teachers, classes, resources, attendanceTrend, classPerformance } = demoData;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-navy-800 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-200">Institution Overview</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Northgate University</h2>
            <p className="mt-2 text-sm text-navy-200">Academic Year 2024-25 · Semester in progress</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Students', val: students.length },
              { label: 'Faculty', val: teachers.length },
              { label: 'Classes', val: classes.length },
            ].map((x) => (
              <div key={x.label} className="rounded-xl bg-white/10 px-4 py-2 text-center">
                <p className="font-display text-xl font-bold text-yellow-pastel">{x.val}</p>
                <p className="text-[10px] text-navy-200">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={Users} accent="navy" trend={{ value: '+4%', up: true }} />
        <StatCard label="Total Teachers" value={teachers.length} icon={GraduationCap} accent="yellow" />
        <StatCard label="Total Classes" value={classes.length} icon={BookCopy} accent="success" />
        <StatCard label="Total Resources" value={resources.length} icon={FolderOpen} accent="warning" trend={{ value: '+12%', up: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Attendance Trends" description="Last 7 weeks" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="admAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE88A" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#FFE88A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <RTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#admAtt)" />
                <Area type="monotone" dataKey="average" name="Average" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Class Performance" description="Attendance vs performance" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YY />
                <RTooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="attendance" name="Attendance %" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="performance" name="Performance %" fill="#FFE88A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
function YY() {
  return <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />;
}

// -------- Student Management --------
export function AdminStudents() {
  const { students } = demoData;
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const pageSize = 10;
  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()) || s.className.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-display text-base font-bold text-navy-800">Student Management</h2>
          <p className="text-xs text-ink-muted">{filtered.length} students enrolled</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search students…" className="input pl-9" />
          </div>
          <button onClick={() => toast({ type: 'info', title: 'Import CSV', description: 'Demo: feature preview only.' })} className="btn-outline">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
          <button onClick={() => setModal(true)} className="btn-navy">
            <UserPlus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>
      <TableContainer>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Roll No</Th>
            <Th>Email</Th>
            <Th>Class</Th>
            <Th>Attendance</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map((s) => (
            <tr key={s.id} className="transition hover:bg-navy-50/40">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} color={s.avatarColor} size="sm" />
                  <p className="font-medium text-ink">{s.name}</p>
                </div>
              </Td>
              <Td><Badge variant="gray">{s.rollNo}</Badge></Td>
              <Td className="text-xs text-ink-muted">{s.email}</Td>
              <Td className="text-xs">{s.className}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Progress value={s.attendancePct} className="w-14" />
                  <span className="text-xs font-semibold text-ink">{s.attendancePct}%</span>
                </div>
              </Td>
              <Td><Badge variant={s.status === 'active' ? 'success' : 'gray'}>{s.status}</Badge></Td>
              <Td>
                <div className="flex items-center gap-1">
                  <button onClick={() => toast({ type: 'info', title: 'Edit student', description: s.name })} className="rounded-lg p-1.5 text-ink-muted hover:bg-navy-50 hover:text-navy-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => toast({ type: 'warning', title: 'Remove student?', description: `This will remove ${s.name}.` })} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-50 hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => toast({ type: 'info', title: s.name, description: s.email })} className="rounded-lg p-1.5 text-ink-muted hover:bg-navy-50 hover:text-navy-800">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableContainer>
      <div className="px-4">
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Student" description="Create a student record">
        <div className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" placeholder="e.g. Aarav Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Roll number</label>
              <input className="input" placeholder="CS-A001" />
            </div>
            <div>
              <label className="label">Class</label>
              <select className="input">
                {demoData.classes.map((c) => (<option key={c.id}>{c.name}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="student@university.edu" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
            <button onClick={() => { setModal(false); toast({ type: 'success', title: 'Student added', description: 'New record created.' }); }} className="btn-navy">
              <UserPlus className="h-4 w-4" /> Add Student
            </button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

// -------- Teacher Management --------
export function AdminTeachers() {
  const { teachers, classes } = demoData;
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  const [assignModal, setAssignModal] = useState<string | null>(null);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-display text-base font-bold text-navy-800">Teacher Management</h2>
          <p className="text-xs text-ink-muted">{teachers.length} faculty members</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-navy">
          <UserPlus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => {
          const assigned = classes.filter((c) => t.assignedClassIds.includes(c.id));
          return (
            <div key={t.id} className="rounded-xl border border-border p-4 transition hover:border-navy-200 hover:shadow-soft">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} color={t.avatarColor} size="md" />
                  <div>
                    <p className="font-semibold text-navy-800">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.subject}</p>
                  </div>
                </div>
                <button onClick={() => toast({ type: 'warning', title: 'Remove teacher?', description: t.name })} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-50 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-ink-muted">
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {t.email}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {t.studentsCount} students</p>
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Assigned Classes</p>
                <div className="flex flex-wrap gap-1.5">
                  {assigned.map((c) => (<Badge key={c.id} variant="navy">{c.name}</Badge>))}
                </div>
                <button onClick={() => setAssignModal(t.id)} className="btn-ghost mt-2 w-full text-xs">
                  <Building2 className="h-3.5 w-3.5" /> Assign Class
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Teacher" description="Onboard a faculty member">
        <div className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" placeholder="Dr. Jane Doe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="faculty@university.edu" />
          </div>
          <div>
            <label className="label">Primary subject</label>
            <select className="input">{demoData.subjects.map((s) => (<option key={s.code}>{s.name}</option>))}</select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
            <button onClick={() => { setModal(false); toast({ type: 'success', title: 'Teacher added' }); }} className="btn-navy">
              <UserPlus className="h-4 w-4" /> Add Teacher
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Class" description="Select a class to assign">
        <div className="space-y-2">
          {classes.map((c) => (
            <button key={c.id} onClick={() => { setAssignModal(null); toast({ type: 'success', title: 'Class assigned', description: c.name }); }} className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left transition hover:border-navy-200 hover:bg-navy-50/40">
              <div>
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-xs text-ink-muted">{c.studentsCount} students · Room {c.room}</p>
              </div>
              <CalendarCheck className="h-4 w-4 text-navy-600" />
            </button>
          ))}
        </div>
      </Modal>
    </Card>
  );
}

// -------- Classes --------
export function AdminClasses() {
  const { classes } = demoData;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((c) => (
        <Card key={c.id} hover className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50">
              <BookCopy className="h-6 w-6 text-navy-700" />
            </div>
            <Badge variant="navy">{c.grade}</Badge>
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-navy-800">{c.name}</h3>
          <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
            <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {c.teacherName}</p>
            <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Room {c.room}</p>
            <p className="flex items-center gap-2"><Users className="h-4 w-4" /> {c.studentsCount} students</p>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="mb-1 text-xs text-ink-muted">Avg Attendance</p>
            <Progress value={75 + (c.studentsCount % 20)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// -------- Reports --------
export function AdminReports() {
  const { classPerformance, resourceUsage, announcementEngagement } = demoData;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Avg Attendance" value="87%" icon={TrendingUp} accent="success" trend={{ value: '+3%', up: true }} />
        <StatCard label="Resource Downloads" value="2.4k" icon={FolderOpen} accent="yellow" />
        <StatCard label="Announcement Reach" value="4.8k" icon={Users} accent="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Attendance Analytics" description="Class-wise attendance %" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={70} />
                <RTooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar dataKey="attendance" name="Attendance %" fill="#0B1F3A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Resource Usage" description="Uploads & downloads over time" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resourceUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <RTooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="uploads" name="Uploads" stroke="#0B1F3A" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="downloads" name="Downloads" stroke="#FFE88A" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Announcement Engagement" description="Views vs actions per announcement" />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={announcementEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <RTooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="views" name="Views" fill="#16355C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actions" name="Actions" fill="#FFE88A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
