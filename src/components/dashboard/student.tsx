import { useState, useMemo, useEffect } from 'react';
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
import {
  studentService,
  resourceService,
  announcementService,
  marksService,
} from '../../lib/services';
import { Avatar, Badge, Card, ProgressBar } from '../ui/widgets';
import { StatCard, SectionHeader, TableContainer, Th, Td } from './widgets';
import { useAuth } from '../../lib/auth';
import { useToast } from '../ui/toast';
import { demoData } from '../../lib/demo-data';
import type { Resource, Announcement } from '../../types';

// -------- Dashboard Overview --------
export function StudentOverview({ onNavigate }: { onNavigate: (k: any) => void }) {
  const { user } = useAuth();
  const student = useMemo(() => {
    return studentService.getById(user?.id || '') || {
      id: 's1',
      name: 'Aarav Sharma',
      rollNo: 'CS-A001',
      classId: 'c1',
      className: 'CSE - 3rd Year A',
      attendancePct: 82,
    };
  }, [user]);

  const resources = resourceService.getAll();
  const announcements = announcementService.getAll();
  const marks = marksService.getExams().filter((e) => e.status === 'published');

  const unread = announcements.filter((a) => !a.read).length;
  const overallAtt = student.attendancePct || 82;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="overflow-hidden border-0 bg-navy-800 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-200">Welcome,</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{student.name}</h2>
            <p className="mt-2 text-sm text-navy-200">{student.className} · Roll No. {student.rollNo}</p>
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
        <StatCard label="Attendance" value={`${overallAtt}%`} icon={CalendarCheck} accent="success" />
        <StatCard label="Subjects" value={demoData.attendanceSubjects.length} icon={BookOpen} accent="navy" footer="Enrolled this semester" />
        <StatCard label="Resources" value={resources.length} icon={FolderOpen} accent="yellow" footer="Shared materials" />
        <StatCard label="Unread Updates" value={unread} icon={Megaphone} accent="warning" footer="Tap to view" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Attendance Trend" description="Weekly attendance percentage" />
          <div className="h-64 flex items-center justify-center bg-navy-50/50 rounded-xl border border-dashed border-navy-200 p-4">
            <div className="text-center">
              <CalendarCheck className="h-8 w-8 text-navy-800 mx-auto mb-2" />
              <p className="text-sm font-semibold text-navy-800">Your Current Attendance is {overallAtt}%</p>
              <p className="text-xs text-ink-muted mt-1">Attendance logs are active and updated by class instructors.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="By Subject" description="Attendance per subject" />
          <div className="space-y-3 mt-4">
            {demoData.attendanceSubjects.map((s) => {
              const pct = s.subject.includes("Data") ? student.attendancePct : Math.round((s.attended / s.total) * 100);
              return (
                <div key={s.code} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-ink truncate max-w-[120px]">{s.subject}</span>
                    <span className="text-navy-800">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent activity row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader
            title="Recent Exam Marks"
            action={
              <button onClick={() => onNavigate('marks')} className="btn-ghost text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="space-y-3">
            {marks.slice(0, 4).map((ex) => {
              const myEntry = ex.entries.find((e) => e.studentId === student.id);
              const score = myEntry?.marks[ex.examType] ?? 0;
              const pct = Math.round((score / ex.maxMarks) * 100);
              return (
                <div key={ex.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{ex.subject}</p>
                    <p className="text-xs text-ink-muted">{ex.examType.toUpperCase()} · {score}/{ex.maxMarks} · {pct}%</p>
                  </div>
                  <Badge variant={pct >= 75 ? 'success' : pct >= 60 ? 'warning' : 'danger'}>
                    {pct >= 75 ? 'Excellent' : pct >= 60 ? 'Good' : 'Needs work'}
                  </Badge>
                </div>
              );
            })}
            {marks.length === 0 && (
              <p className="text-sm text-ink-muted text-center py-4">No marks published yet.</p>
            )}
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
  const { user } = useAuth();
  const student = useMemo(() => {
    return studentService.getById(user?.id || '') || { classId: 'c1', attendancePct: 82 };
  }, [user]);

  const overall = student.attendancePct || 82;
  const attendanceSubjects = demoData.attendanceSubjects;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Overall Attendance</p>
          <p className="mt-1 font-display text-4xl font-bold text-navy-800">{overall}%</p>
          <ProgressBar value={overall} className="mt-3" />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Classes Attended</p>
          <p className="mt-1 font-display text-4xl font-bold text-navy-800">
            {Math.round(attendanceSubjects.reduce((a, s) => a + s.attended, 0) * (overall / 82))}
          </p>
          <p className="mt-2 text-xs text-ink-muted">across {attendanceSubjects.length} subjects</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Subjects at Risk</p>
          <p className="mt-1 font-display text-4xl font-bold text-danger">
            {attendanceSubjects.filter((s) => (s.subject.includes("Data") ? overall : Math.round((s.attended / s.total) * 100)) < 75).length}
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
              const pct = s.subject.includes("Data") ? overall : Math.round((s.attended / s.total) * 100);
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
                      <ProgressBar value={pct} className="w-24" />
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
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const loadResources = () => {
    setResources(resourceService.getAll());
  };

  useEffect(() => {
    loadResources();
  }, []);

  const subjects = useMemo(() => {
    return ['All', ...new Set(resources.map((r) => r.subject))];
  }, [resources]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSubj = filter === 'All' || r.subject === filter;
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
      return matchSubj && matchSearch;
    });
  }, [resources, filter, search]);

  const downloadSim = (id: string, titleStr: string) => {
    resourceService.incrementDownloads(id);
    loadResources();
    toast({ type: 'success', title: 'Download Complete', description: `Simulated download of "${titleStr}" complete.` });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-800">Resource Library</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{filtered.length} resources available for download</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search resources..."
              className="input pl-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
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
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-ink-muted">No resources match your filters.</Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card key={r.id} hover className="flex flex-col p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                  <FileText className="h-6 w-6 text-rose-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">PDF Document</p>
                  <h3 className="mt-0.5 leading-tight font-semibold text-navy-800 truncate">{r.title}</h3>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-ink-muted">
                <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {r.subject}</p>
                <p>Uploaded by {r.uploadedBy}</p>
                <p>{r.uploadedDate} · {r.size}</p>
                <p className="text-ink-muted/80">{r.downloads} downloads</p>
              </div>
              <button onClick={() => downloadSim(r.id, r.title)} className="btn-outline mt-4 w-full">
                <Download className="h-4 w-4" />
                Download
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Announcements --------
export function StudentAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);

  const loadAnnouncements = () => {
    setItems(announcementService.getAll().filter((a) => a.status === 'published'));
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleMarkAsRead = (id: string) => {
    announcementService.toggleReadState(id, true);
    loadAnnouncements();
  };

  const catColor: Record<string, any> = {
    general: 'navy',
    exam: 'yellow',
    event: 'success',
    urgent: 'danger',
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mb-6 p-5">
        <h2 className="font-display text-lg font-bold text-navy-800">Announcements Feed</h2>
        <p className="mt-0.5 text-sm text-ink-muted">{items.filter((a) => !a.read).length} unread · {items.length} total</p>
      </Card>
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-5">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <div className={`absolute -left-[18px] top-3 h-3 w-3 rounded-full ring-4 ring-bg ${a.read ? 'bg-ink-muted/30' : catColor[a.category] === 'danger' ? 'bg-danger' : catColor[a.category] === 'success' ? 'bg-success' : catColor[a.category] === 'yellow' ? 'bg-warning' : 'bg-navy-700'}`} />
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={catColor[a.category]}>{a.category}</Badge>
                    {!a.read && <Badge variant="warning">New</Badge>}
                  </div>
                  <span className="text-xs text-ink-muted">{a.date}</span>
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-navy-800">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{a.message}</p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={a.teacher} size="xs" />
                    <span className="text-xs font-medium text-ink">{a.teacher}</span>
                  </div>
                  {!a.read && (
                    <button
                      onClick={() => handleMarkAsRead(a.id)}
                      className="btn-ghost text-xs py-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark as read
                    </button>
                  )}
                </div>
              </Card>
            </div>
          ))}
          {items.length === 0 && (
            <Card className="p-8 text-center text-ink-muted">No announcements published yet.</Card>
          )}
        </div>
      </div>
    </div>
  );
}

// -------- Marks --------
export function StudentMarks() {
  const { user } = useAuth();
  const student = useMemo(() => {
    return studentService.getById(user?.id || '') || { id: 's1' };
  }, [user]);

  const exams = useMemo(() => {
    return marksService.getExams().filter((e) => e.status === 'published');
  }, []);

  const overall = useMemo(() => {
    return exams.map((ex) => {
      const entry = ex.entries.find((e) => e.studentId === student.id);
      const score = entry?.marks[ex.examType] ?? 0;
      return Math.round((score / ex.maxMarks) * 100);
    });
  }, [exams, student.id]);

  const avg = overall.length ? Math.round(overall.reduce((a, b) => a + b, 0) / overall.length) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-navy-800 p-5 text-white">
          <p className="text-sm text-navy-200">Overall Score</p>
          <p className="mt-1 font-display text-4xl font-bold text-yellow-pastel">{avg}%</p>
          <p className="mt-2 text-xs text-navy-200">Across {exams.length} published exams</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Highest Score</p>
          <p className="mt-1 font-display text-4xl font-bold text-success">
            {overall.length ? Math.max(...overall) : 0}%
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Lowest Score</p>
          <p className="mt-1 font-display text-4xl font-bold text-warning">
            {overall.length ? Math.min(...overall) : 0}%
          </p>
        </Card>
      </div>

      {exams.length === 0 ? (
        <Card className="p-8 text-center text-ink-muted">No marks records found.</Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {exams.map((ex) => {
            const entry = ex.entries.find((e) => e.studentId === student.id);
            const score = entry?.marks[ex.examType] ?? 0;
            const pct = Math.round((score / ex.maxMarks) * 100);
            return (
              <Card key={ex.id} hover className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-navy-800">{ex.subject}</h3>
                    <p className="text-xs text-ink-muted mt-0.5 capitalize">{ex.examType} Exam</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-navy-800">{pct}%</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-border p-4 bg-navy-50/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-ink-muted uppercase">Score Secured</span>
                    <span className="font-display text-lg font-bold text-navy-800">{score} <span className="text-xs text-ink-muted">/ {ex.maxMarks}</span></span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-ink-muted">Status: <span className="font-semibold text-emerald-600">Published</span></span>
                  <Badge variant={pct >= 75 ? 'success' : pct >= 50 ? 'warning' : 'danger'}>
                    {pct >= 75 ? 'Distinction' : pct >= 50 ? 'Pass' : 'At risk'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -------- Profile --------
export function StudentProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Local state for editable profile fields
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
  });

  const student = useMemo(() => {
    return studentService.getById(user?.id || '') || { rollNo: 'CS-A001', className: 'CSE - 3rd Year A' };
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfile((p) => ({
        ...p,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const saveChanges = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast({ type: 'warning', title: 'Required Fields', description: 'Name and email are required.' });
      return;
    }
    
    // Save to students DB
    if (user?.id) {
      const studentRec = studentService.getById(user.id);
      if (studentRec) {
        studentRec.name = profile.name;
        studentRec.email = profile.email;
        studentService.save(studentRec);
      }
      
      // Update session credentials in localStorage db
      const users = (window as any).localStorage ? JSON.parse(localStorage.getItem('cp_users') || '[]') : [];
      const userIdx = users.findIndex((u: any) => u.id === user.id);
      if (userIdx !== -1) {
        users[userIdx].name = profile.name;
        users[userIdx].email = profile.email;
        localStorage.setItem('cp_users', JSON.stringify(users));
      }
      
      // Update current session
      const session = JSON.parse(localStorage.getItem('cp_session') || '{}');
      session.name = profile.name;
      session.email = profile.email;
      localStorage.setItem('cp_session', JSON.stringify(session));
    }
    
    toast({ type: 'success', title: 'Profile Updated', description: 'Your edits have been saved.' });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="overflow-hidden">
        <div className="h-24 bg-navy-800" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar name={profile.name || 'Student'} color={user?.avatarColor ?? 'bg-navy-700'} size="lg" className="ring-4 ring-white" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-navy-800">{profile.name}</h2>
          <p className="text-sm text-ink-muted">{profile.email}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Roll No', value: student.rollNo || 'CS-A001' },
              { label: 'Class', value: student.className || 'CSE 3-A' },
              { label: 'Semester', value: '5th' },
              { label: 'CGPA', value: '8.4' },
            ].map((x) => (
              <div key={x.label} className="rounded-xl border border-border p-3 bg-navy-50/10">
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
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Department</label>
            <input
              className="input"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
            />
          </div>
          <button onClick={saveChanges} className="btn-navy">Save Changes</button>
        </div>
      </Card>
    </div>
  );
}
