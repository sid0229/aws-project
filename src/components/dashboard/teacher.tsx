import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CalendarClock,
  FolderOpen,
  Megaphone,
  TrendingUp,
  UploadCloud,
  Search,
  CheckCheck,
  Send,
  Save,
  Eye,
  X,
  FileText,
  Download,
  BookOpen,
  Clock,
} from 'lucide-react';
import { demoData } from '../../lib/demo-data';
import { Avatar, Badge, Card, Progress } from '../ui/primitives';
import { StatCard, SectionHeader, TableContainer, Th, Td, Pagination } from './widgets';
import { useToast } from '../ui/toast';

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

// -------- Teacher Overview --------
export function TeacherOverview() {
  const { teacherSchedule, classes, resources, announcements, attendanceTrend } = demoData;
  const avgAtt = Math.round(attendanceTrend.reduce((a, b) => a + b.attendance, 0) / attendanceTrend.length);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-navy-800 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-200">Welcome back,</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Dr. Anil Sharma</h2>
            <p className="mt-2 text-sm text-navy-200">Department of Computer Science · Faculty ID: FAC-001</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-center">
            <p className="text-xs text-navy-200">Today's Classes</p>
            <p className="font-display text-3xl font-bold text-yellow-pastel">{teacherSchedule.length}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today's Classes" value={teacherSchedule.length} icon={CalendarClock} accent="navy" />
        <StatCard label="Resources Uploaded" value={resources.length} icon={FolderOpen} accent="yellow" />
        <StatCard label="Announcements" value={announcements.length} icon={Megaphone} accent="success" />
        <StatCard label="Avg Attendance" value={`${avgAtt}%`} icon={TrendingUp} accent="warning" trend={{ value: '+3%', up: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Today's Schedule" description="Your classes for the day" />
          <div className="space-y-3">
            {teacherSchedule.map((s, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-3 transition hover:border-navy-200 hover:bg-navy-50/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                  <Clock className="h-5 w-5 text-navy-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{s.subject}</p>
                  <p className="text-xs text-ink-muted">{s.class} · Room {s.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-navy-800">{s.time}</p>
                  <p className="text-[11px] text-ink-muted">{s.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Attendance Trend" description="Class average" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B1F3A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0B1F3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <RTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="attendance" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#tGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Your Classes" description="Assigned classes this semester" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-xl border border-border p-4 transition hover:border-navy-200 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <Badge variant="navy">{c.grade}</Badge>
                <span className="text-xs text-ink-muted">Room {c.room}</span>
              </div>
              <p className="mt-2 font-semibold text-navy-800">{c.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{c.studentsCount} students</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// -------- Attendance Management --------
export function TeacherAttendance() {
  const { students } = demoData;
  const { toast } = useToast();
  const [classFilter, setClassFilter] = useState('CSE - 3rd Year A');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const roster = useMemo(() => students.slice(0, 22).map((s) => ({ ...s, present: true })), []);
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(
    Object.fromEntries(roster.map((s) => [s.id, true]))
  );

  const filtered = roster.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const presentCount = Object.values(presentMap).filter(Boolean).length;

  const toggleAll = (val: boolean) => {
    const next: Record<string, boolean> = {};
    filtered.forEach((s) => (next[s.id] = val));
    setPresentMap((prev) => ({ ...prev, ...next }));
  };

  const submit = () => {
    toast({
      type: 'success',
      title: 'Attendance submitted',
      description: `${presentCount}/${roster.length} marked present for ${subject}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Class</label>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="input">
              {['CSE - 3rd Year A', 'CSE - 3rd Year B', 'IT - 3rd Year'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              {demoData.subjects.map((s) => (
                <option key={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-xl bg-navy-50 px-4 py-2.5">
              <p className="text-xs text-ink-muted">Present</p>
              <p className="font-display text-xl font-bold text-navy-800">{presentCount}<span className="text-sm text-ink-muted">/{roster.length}</span></p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or roll no…"
              className="input pl-9"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleAll(true)} className="btn-outline">
              <CheckCheck className="h-4 w-4" /> Mark all present
            </button>
            <button onClick={() => toggleAll(false)} className="btn-ghost">
              <X className="h-4 w-4" /> Mark all absent
            </button>
          </div>
        </div>
        <TableContainer>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Roll No</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => {
              const present = presentMap[s.id];
              return (
                <tr key={s.id} className="transition hover:bg-navy-50/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <div>
                        <p className="font-medium text-ink">{s.name}</p>
                        <p className="text-xs text-ink-muted">{s.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td><Badge variant="gray">{s.rollNo}</Badge></Td>
                  <Td>
                    <Badge variant={present ? 'success' : 'danger'}>
                      {present ? 'Present' : 'Absent'}
                    </Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() => setPresentMap((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        present
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`h-4 w-4 rounded ${present ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                      Toggle
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableContainer>
        <div className="px-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={() => toast({ type: 'info', title: 'Saved as draft' })} className="btn-outline">
          <Save className="h-4 w-4" /> Save Draft
        </button>
        <button onClick={submit} className="btn-navy">
          <Send className="h-4 w-4" /> Submit Attendance
        </button>
      </div>
    </div>
  );
}

// -------- Resources (Upload) --------
export function TeacherResources() {
  const { resources } = demoData;
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState<typeof resources>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(demoData.subjects[0].name);
  const [desc, setDesc] = useState('');

  const publish = () => {
    if (!title) {
      toast({ type: 'warning', title: 'Title required', description: 'Give your resource a title.' });
      return;
    }
    const newR = {
      id: `r${Date.now()}`,
      title,
      subject,
      uploadedBy: 'Dr. Anil Sharma',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: '2.1 MB',
      downloads: 0,
      className: 'CSE - 3rd Year A',
    };
    setUploaded((p) => [newR, ...p]);
    setTitle('');
    setDesc('');
    toast({ type: 'success', title: 'Resource uploaded', description: `"${newR.title}" is now available to students.` });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <SectionHeader title="Upload Resource" description="Share PDFs, notes, and slides with your students" />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            toast({ type: 'info', title: 'File added', description: 'Ready to publish.' });
          }}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragOver ? 'border-navy-500 bg-navy-50' : 'border-border bg-navy-50/30'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-light">
            <UploadCloud className="h-7 w-7 text-navy-800" />
          </div>
          <p className="mt-3 text-sm font-semibold text-navy-800">Drag & drop your PDF here</p>
          <p className="mt-1 text-xs text-ink-muted">or click to browse · Max 50 MB</p>
          <button onClick={() => toast({ type: 'info', title: 'File picker', description: 'Demo: file selection disabled.' })} className="btn-outline mt-4">
            <FileText className="h-4 w-4" /> Choose PDF
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Graph Algorithms Notes" className="input" />
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              {demoData.subjects.map((s) => (
                <option key={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Brief description of the resource…" className="input resize-none" />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={publish} className="btn-navy">
            <UploadCloud className="h-4 w-4" /> Publish Resource
          </button>
        </div>
      </Card>

      <div>
        <SectionHeader title="Your Uploaded Resources" description={`${[...uploaded, ...resources].length} resources shared`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...uploaded, ...resources].map((r) => (
            <Card key={r.id} hover className="flex flex-col p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                  <FileText className="h-5 w-5 text-rose-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase text-rose-500">PDF</p>
                  <h3 className="mt-0.5 leading-tight font-semibold text-navy-800">{r.title}</h3>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-ink-muted">
                <p className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {r.subject}</p>
                <p>{r.uploadedDate} · {r.size}</p>
                <p>{r.downloads} downloads</p>
              </div>
              <button className="btn-outline mt-3 w-full">
                <Download className="h-4 w-4" /> Download
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------- Announcements (Create) --------
export function TeacherAnnouncements() {
  const { announcements } = demoData;
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [list, setList] = useState(announcements);

  const publish = () => {
    if (!title || !message) {
      toast({ type: 'warning', title: 'Fill all fields', description: 'Title and message are required.' });
      return;
    }
    const newA = {
      id: `a${Date.now()}`,
      title,
      message,
      date: 'Just now',
      teacher: 'Dr. Anil Sharma',
      category: 'general' as const,
      read: false,
    };
    setList((p) => [newA, ...p]);
    setTitle('');
    setMessage('');
    toast({ type: 'success', title: 'Announcement published', description: 'Students have been notified.' });
  };

  const previewEnabled = title || message;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="p-5 lg:col-span-3">
        <SectionHeader title="Create Announcement" description="Notify your students instantly" />
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Assignment 4 deadline extended" className="input" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="Write your announcement…" className="input resize-none" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setTitle(''); setMessage(''); }} className="btn-ghost">Clear</button>
            <button onClick={publish} className="btn-navy">
              <Send className="h-4 w-4" /> Publish
            </button>
          </div>
        </div>

        {previewEnabled && (
          <div className="mt-5 rounded-xl border border-dashed border-navy-200 bg-navy-50/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-navy-600">
              <Eye className="h-3.5 w-3.5" /> Preview
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <Badge variant="navy">general</Badge>
              <h3 className="mt-2 font-bold text-navy-800">{title || 'Your title appears here'}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{message || 'Your message body will appear here.'}</p>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Avatar name="Dr. Anil Sharma" size="xs" />
                <span className="text-xs font-medium text-ink">Dr. Anil Sharma</span>
                <span className="text-xs text-ink-muted">· Just now</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5 lg:col-span-2">
        <SectionHeader title="Recent" description={`${list.length} announcements`} />
        <div className="max-h-[600px] space-y-3 overflow-y-auto scrollbar-thin pr-1">
          {list.map((a) => (
            <div key={a.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gray">{a.category}</Badge>
                <span className="text-[11px] text-ink-muted">{a.date}</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-navy-800">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{a.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// -------- Marks Upload --------
export function TeacherMarks() {
  const { students, subjects } = demoData;
  const { toast } = useToast();
  const [className, setClassName] = useState('CSE - 3rd Year A');
  const [subject, setSubject] = useState(subjects[0].name);
  const [examType, setExamType] = useState<'internal' | 'midsem' | 'endsem'>('internal');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const roster = students.slice(0, 22);
  const [marks, setMarks] = useState<Record<string, number>>(
    Object.fromEntries(roster.map((s, i) => [s.id, Math.round(12 + (i % 9))]))
  );
  const max = examType === 'internal' ? 20 : examType === 'midsem' ? 30 : 50;
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const filtered = roster;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const save = (kind: 'draft' | 'publish') => {
    setStatus(kind === 'draft' ? 'draft' : 'published');
    toast({
      type: kind === 'draft' ? 'info' : 'success',
      title: kind === 'draft' ? 'Marks saved as draft' : 'Marks published',
      description: `${subject} · ${examType} · Class ${className}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Class</label>
            <select value={className} onChange={(e) => setClassName(e.target.value)} className="input">
              {['CSE - 3rd Year A', 'CSE - 3rd Year B', 'IT - 3rd Year'].map((c) => (<option key={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              {subjects.map((s) => (<option key={s.code}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="label">Exam Type</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['internal', 'midsem', 'endsem'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setExamType(t); }}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize transition ${
                    examType === t ? 'border-navy-700 bg-navy-50 text-navy-800 ring-2 ring-navy-200' : 'border-border bg-white text-ink-muted hover:bg-navy-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">Max marks: <span className="font-semibold text-navy-800">{max}</span></p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="font-display text-base font-bold text-navy-800">Student Marks</h2>
            <p className="text-xs text-ink-muted">{roster.length} students · Status: <Badge variant={status === 'published' ? 'success' : 'warning'}>{status}</Badge></p>
          </div>
        </div>
        <TableContainer>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Roll No</Th>
              <Th>Marks</Th>
              <Th>Percentage</Th>
              <Th>Grade</Th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => {
              const m = marks[s.id] ?? 0;
              const pct = Math.round((m / max) * 100);
              const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'F';
              return (
                <tr key={s.id} className="transition hover:bg-navy-50/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <p className="font-medium text-ink">{s.name}</p>
                    </div>
                  </Td>
                  <Td><Badge variant="gray">{s.rollNo}</Badge></Td>
                  <Td>
                    <input
                      type="number"
                      min={0}
                      max={max}
                      value={m}
                      onChange={(e) => setMarks((prev) => ({ ...prev, [s.id]: Math.min(max, Math.max(0, Number(e.target.value))) }))}
                      className="w-20 rounded-lg border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200"
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="w-16" />
                      <span className="text-xs font-semibold text-ink">{pct}%</span>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={pct >= 60 ? 'success' : 'danger'}>{grade}</Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableContainer>
        <div className="px-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={() => save('draft')} className="btn-outline">
          <Save className="h-4 w-4" /> Save as Draft
        </button>
        <button onClick={() => save('publish')} className="btn-navy">
          <Send className="h-4 w-4" /> Publish Marks
        </button>
      </div>
    </div>
  );
}

// -------- Teacher's Students view --------
export function TeacherStudents() {
  const { students } = demoData;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filtered = students.slice(0, 60).filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-display text-base font-bold text-navy-800">My Students</h2>
          <p className="text-xs text-ink-muted">{filtered.length} students across your classes</p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search students…" className="input pl-9" />
        </div>
      </div>
      <TableContainer>
        <thead>
          <tr>
            <Th>Student</Th>
            <Th>Roll No</Th>
            <Th>Class</Th>
            <Th>Attendance</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {paged.map((s) => (
            <tr key={s.id} className="transition hover:bg-navy-50/40">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} color={s.avatarColor} size="sm" />
                  <div>
                    <p className="font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-ink-muted">{s.email}</p>
                  </div>
                </div>
              </Td>
              <Td><Badge variant="gray">{s.rollNo}</Badge></Td>
              <Td className="text-sm">{s.className}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Progress value={s.attendancePct} className="w-16" />
                  <span className="text-xs font-semibold text-ink">{s.attendancePct}%</span>
                </div>
              </Td>
              <Td>
                <Badge variant={s.status === 'active' ? 'success' : 'gray'}>
                  {s.status}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableContainer>
      <div className="px-4">
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </Card>
  );
}
