import { useMemo, useState, useEffect } from 'react';
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
  Trash2,
  Edit,
} from 'lucide-react';
import {
  studentService,
  classService,
  attendanceService,
  resourceService,
  announcementService,
  marksService,
} from '../../lib/services';
import { Avatar, Badge, Card, ProgressBar } from '../ui/widgets';
import { StatCard, SectionHeader, TableContainer, Th, Td, Pagination } from './widgets';
import { useToast } from '../ui/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { FileUploadDropzone } from '../ui/file-upload-dropzone';
import { AttendanceTrendChart } from '../charts/reusable-charts';
import { demoData } from '../../lib/demo-data';
import type { AttendanceRecord, Resource, Announcement, Exam, ExamType } from '../../types';

// -------- Teacher Overview --------
export function TeacherOverview() {
  const { teacherSchedule } = demoData;
  const resources = resourceService.getAll();
  const announcements = announcementService.getAll();
  const attendanceTrend = demoData.attendanceTrend;
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
          <AttendanceTrendChart data={attendanceTrend} />
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Your Classes" description="Assigned classes this semester" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classService.getAll().slice(0, 3).map((c) => (
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
  const { toast } = useToast();
  const classesList = classService.getAll();
  const subjectsList = demoData.subjects;

  const [selectedClassId, setSelectedClassId] = useState(classesList[0]?.id || '');
  const [subject, setSubject] = useState(subjectsList[0]?.name || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Active roster of students for the selected class
  const classStudents = useMemo(() => {
    return studentService.getAll().filter((s) => s.classId === selectedClassId);
  }, [selectedClassId]);

  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});
  const [existingRecord, setExistingRecord] = useState<AttendanceRecord | null>(null);

  // Sync present map with DB or set default (all present)
  useEffect(() => {
    const record = attendanceService.getByClassAndDate(selectedClassId, subject, date);
    setExistingRecord(record || null);
    if (record) {
      const nextMap: Record<string, boolean> = {};
      classStudents.forEach((s) => {
        nextMap[s.id] = record.presentStudentIds.includes(s.id);
      });
      setPresentMap(nextMap);
    } else {
      const nextMap: Record<string, boolean> = {};
      classStudents.forEach((s) => {
        nextMap[s.id] = true;
      });
      setPresentMap(nextMap);
    }
  }, [selectedClassId, subject, date, classStudents]);

  const filtered = useMemo(() => {
    return classStudents.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [classStudents, search]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const presentCount = Object.values(presentMap).filter(Boolean).length;
  const attendanceRate = classStudents.length ? Math.round((presentCount / classStudents.length) * 100) : 0;

  const toggleAll = (val: boolean) => {
    if (existingRecord?.submitted) return;
    const next: Record<string, boolean> = {};
    classStudents.forEach((s) => (next[s.id] = val));
    setPresentMap((prev) => ({ ...prev, ...next }));
  };

  const handleSave = (submitted: boolean) => {
    if (existingRecord?.submitted) {
      toast({
        type: 'warning',
        title: 'Already submitted',
        description: 'This attendance sheet has already been finalized and cannot be overwritten.',
      });
      return;
    }

    const presentStudentIds = Object.entries(presentMap)
      .filter(([_, present]) => present)
      .map(([id]) => id);

    const cls = classesList.find((c) => c.id === selectedClassId);

    const record: AttendanceRecord = {
      id: existingRecord?.id || `att_${Date.now()}`,
      classId: selectedClassId,
      className: cls?.name || 'Class',
      subject,
      date,
      presentStudentIds,
      totalStudents: classStudents.length,
      submitted,
    };

    attendanceService.submit(record);
    setExistingRecord(record);
    toast({
      type: submitted ? 'success' : 'info',
      title: submitted ? 'Attendance Submitted' : 'Draft Saved',
      description: `${presentCount}/${classStudents.length} present for ${subject}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="input"
              disabled={existingRecord?.submitted}
            >
              {classesList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
              disabled={existingRecord?.submitted}
            >
              {subjectsList.map((s) => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              disabled={existingRecord?.submitted}
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="w-1/2 rounded-xl bg-navy-50 px-4 py-2.5">
              <p className="text-xs text-ink-muted">Present</p>
              <p className="font-display text-lg font-bold text-navy-800">{presentCount}<span className="text-xs text-ink-muted">/{classStudents.length}</span></p>
            </div>
            <div className="w-1/2 rounded-xl bg-navy-50 px-4 py-2.5">
              <p className="text-xs text-ink-muted">Percentage</p>
              <p className="font-display text-lg font-bold text-navy-800">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </Card>

      {existingRecord?.submitted && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800 text-sm">
          Attendance has been submitted and finalized for this class/subject/date.
        </div>
      )}

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
          {!existingRecord?.submitted && (
            <div className="flex gap-2">
              <button onClick={() => toggleAll(true)} className="btn-outline">
                <CheckCheck className="h-4 w-4" /> Mark all present
              </button>
              <button onClick={() => toggleAll(false)} className="btn-ghost">
                <X className="h-4 w-4" /> Mark all absent
              </button>
            </div>
          )}
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
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-muted text-sm">No students found.</td>
              </tr>
            ) : (
              paged.map((s) => {
                const present = presentMap[s.id] ?? false;
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
                        onClick={() => {
                          if (existingRecord?.submitted) return;
                          setPresentMap((prev) => ({ ...prev, [s.id]: !prev[s.id] }));
                        }}
                        disabled={existingRecord?.submitted}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          present
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                        } disabled:opacity-50`}
                      >
                        <span className={`h-4 w-4 rounded ${present ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                        Toggle
                      </button>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </TableContainer>
        <div className="px-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </Card>

      {!existingRecord?.submitted && (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleSave(false)} className="btn-outline">
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button onClick={() => handleSave(true)} className="btn-navy">
            <Send className="h-4 w-4" /> Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
}

// -------- Resources (Upload) --------
export function TeacherResources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(demoData.subjects[0].name);
  const [desc, setDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  // Sync files list
  const loadResources = () => {
    setResources(resourceService.getAll());
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleFileSelect = (file: File, sizeStr: string) => {
    setSelectedFile(file);
    setFileSizeStr(sizeStr);
  };

  const publish = () => {
    if (!title.trim()) {
      toast({ type: 'warning', title: 'Title required', description: 'Give your resource a title.' });
      return;
    }
    if (!selectedFile) {
      toast({ type: 'warning', title: 'File required', description: 'Please pick a file to upload first.' });
      return;
    }

    const newR: Resource = {
      id: `r_${Date.now()}`,
      title,
      subject,
      uploadedBy: 'Dr. Anil Sharma',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: fileSizeStr,
      downloads: 0,
      className: 'CSE - 3rd Year A',
      description: desc,
    };

    resourceService.save(newR);
    setTitle('');
    setDesc('');
    setSelectedFile(null);
    loadResources();
    toast({ type: 'success', title: 'Resource uploaded', description: `"${newR.title}" is now available to students.` });
  };

  const downloadSim = (id: string, titleStr: string) => {
    resourceService.incrementDownloads(id);
    loadResources();
    toast({ type: 'success', title: 'Download Started', description: `Simulated download of "${titleStr}" complete.` });
  };

  const confirmDelete = (id: string) => {
    setResourceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (resourceToDelete) {
      resourceService.delete(resourceToDelete);
      loadResources();
      setDeleteConfirmOpen(false);
      setResourceToDelete(null);
      toast({ type: 'info', title: 'Deleted', description: 'Resource removed successfully.' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <SectionHeader title="Upload Resource" description="Share PDFs, notes, and slides with your students" />
        <FileUploadDropzone onFileSelect={handleFileSelect} />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Graph Algorithms Notes" className="input" />
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              {demoData.subjects.map((s) => (
                <option key={s.code} value={s.name}>{s.name}</option>
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
        <SectionHeader title="Your Uploaded Resources" description={`${resources.length} resources shared`} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.id} hover className="flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                    <FileText className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase text-rose-500">PDF / Document</p>
                    <h3 className="mt-0.5 leading-tight font-semibold text-navy-800 truncate">{r.title}</h3>
                  </div>
                </div>
                <button onClick={() => confirmDelete(r.id)} className="text-ink-muted hover:text-danger p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-ink-muted">
                <p className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {r.subject}</p>
                <p>{r.uploadedDate} · {r.size}</p>
                <p>{r.downloads} downloads</p>
              </div>
              <button onClick={() => downloadSim(r.id, r.title)} className="btn-outline mt-3 w-full">
                <Download className="h-4 w-4" /> Download
              </button>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Resource?"
        description="Are you sure you want to delete this resource? It will be removed permanently."
      />
    </div>
  );
}

// -------- Announcements (Create) --------
export function TeacherAnnouncements() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'general' | 'exam' | 'event' | 'urgent'>('general');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [list, setList] = useState<Announcement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadAnnouncements = () => {
    setList(announcementService.getAll());
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const publish = () => {
    if (!title.trim() || !message.trim()) {
      toast({ type: 'warning', title: 'Fill all fields', description: 'Title and message are required.' });
      return;
    }
    const newA: Announcement = {
      id: editingId || `ann_${Date.now()}`,
      title,
      message,
      date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      teacher: 'Dr. Anil Sharma',
      category,
      read: false,
      status,
      audience: 'all',
    };
    announcementService.save(newA);
    setTitle('');
    setMessage('');
    setCategory('general');
    setEditingId(null);
    loadAnnouncements();
    toast({
      type: 'success',
      title: editingId ? 'Announcement updated' : 'Announcement saved',
      description: status === 'published' ? 'Students have been notified.' : 'Saved to drafts.',
    });
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setMessage(ann.message);
    setCategory(ann.category);
    setStatus(ann.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    announcementService.delete(id);
    loadAnnouncements();
    toast({ type: 'info', title: 'Deleted', description: 'Announcement removed.' });
  };

  const previewEnabled = title || message;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="p-5 lg:col-span-3">
        <SectionHeader title={editingId ? 'Edit Announcement' : 'Create Announcement'} description="Notify your students instantly" />
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Assignment 4 deadline extended" className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={category} onChange={(e: any) => setCategory(e.target.value)} className="input">
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="label">Publish Status</label>
              <select value={status} onChange={(e: any) => setStatus(e.target.value)} className="input">
                <option value="published">Published</option>
                <option value="draft">Draft Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Write your announcement…" className="input resize-none" />
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setMessage('');
                  setCategory('general');
                }}
                className="btn-ghost"
              >
                Cancel Edit
              </button>
            )}
            <button onClick={publish} className="btn-navy">
              <Send className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {previewEnabled && (
          <div className="mt-5 rounded-xl border border-dashed border-navy-200 bg-navy-50/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-navy-600">
              <Eye className="h-3.5 w-3.5" /> Preview
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <Badge variant={category === 'urgent' ? 'danger' : category === 'exam' ? 'warning' : 'navy'}>{category}</Badge>
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
        <SectionHeader title="Recent Announcements" description={`${list.length} announcements`} />
        <div className="max-h-[600px] space-y-3 overflow-y-auto scrollbar-thin pr-1">
          {list.map((a) => (
            <div key={a.id} className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1 items-center">
                  <Badge variant={a.category === 'urgent' ? 'danger' : a.category === 'exam' ? 'warning' : 'gray'}>{a.category}</Badge>
                  {a.status === 'draft' && <Badge variant="yellow">Draft</Badge>}
                </div>
                <span className="text-[10px] text-ink-muted">{a.date}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-800">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{a.message}</p>
              </div>
              <div className="flex justify-end gap-1 pt-2 border-t border-border mt-1">
                <button onClick={() => handleEdit(a)} className="text-ink-muted hover:text-navy-800 p-1">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-ink-muted hover:text-danger p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// -------- Marks Upload --------
export function TeacherMarks() {
  const { toast } = useToast();
  const classesList = classService.getAll();
  const subjectsList = demoData.subjects;

  const [classId, setClassId] = useState(classesList[0]?.id || '');
  const [subject, setSubject] = useState(subjectsList[0]?.name || '');
  const [examType, setExamType] = useState<ExamType>('internal');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Active roster of students for the selected class
  const classStudents = useMemo(() => {
    return studentService.getAll().filter((s) => s.classId === classId);
  }, [classId]);

  const max = examType === 'endsem' ? 50 : examType === 'midsem' ? 30 : 20;

  const [marks, setMarks] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Modal Dialog flags
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'draft' | 'published'>('draft');

  const examId = `${classId}_${subject.replace(/\s+/g, '')}_${examType}`;

  // Sync marks state when class, subject or exam type changes
  useEffect(() => {
    const existingExam = marksService.getExamById(examId);
    if (existingExam) {
      setStatus(existingExam.status);
      const nextMarks: Record<string, number> = {};
      existingExam.entries.forEach((ent) => {
        nextMarks[ent.studentId] = ent.marks[examType] || 0;
      });
      setMarks(nextMarks);
    } else {
      setStatus('draft');
      const nextMarks: Record<string, number> = {};
      classStudents.forEach((s) => {
        nextMarks[s.id] = 0;
      });
      setMarks(nextMarks);
    }
  }, [classId, subject, examType, classStudents, examId]);

  const filtered = classStudents;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const triggerSave = (kind: 'draft' | 'published') => {
    setPendingStatus(kind);
    // If overwrite/publishing, show confirmation modal
    if (kind === 'published' || status === 'published') {
      setConfirmOpen(true);
    } else {
      executeSave(kind);
    }
  };

  const executeSave = (kind: 'draft' | 'published') => {
    const entries = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      marks: {
        [examType]: marks[s.id] || 0,
      },
    }));

    const examRecord: Exam = {
      id: examId,
      classId,
      subject,
      examType,
      maxMarks: max,
      status: kind,
      entries,
    };

    marksService.saveExam(examRecord);
    setStatus(kind);
    setConfirmOpen(false);
    toast({
      type: kind === 'draft' ? 'info' : 'success',
      title: kind === 'draft' ? 'Marks saved as draft' : 'Marks published',
      description: `${subject} · ${examType} · Class ${classesList.find((c) => c.id === classId)?.name}`,
    });
  };

  const updateStudentMark = (studentId: string, val: string) => {
    const num = Number(val);
    const checkedVal = Math.min(max, Math.max(0, num));
    setMarks((prev) => ({ ...prev, [studentId]: checkedVal }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Class</label>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="input">
              {classesList.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input">
              {subjectsList.map((s) => (<option key={s.code} value={s.name}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="label">Exam Type</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['internal', 'midsem', 'endsem'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
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
            <p className="text-xs text-ink-muted">{classStudents.length} students · Status: <Badge variant={status === 'published' ? 'success' : 'warning'}>{status}</Badge></p>
          </div>
        </div>
        <TableContainer>
          <thead>
            <tr>
              <Th>Student</Th>
              <Th>Roll No</Th>
              <Th>Marks Input</Th>
              <Th>Percentage</Th>
              <Th>Grade</Th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-ink-muted text-sm">No students in this class.</td>
              </tr>
            ) : (
              paged.map((s) => {
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
                        onChange={(e) => updateStudentMark(s.id, e.target.value)}
                        className="w-20 rounded-lg border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200"
                      />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={pct} className="w-16" />
                        <span className="text-xs font-semibold text-ink">{pct}%</span>
                      </div>
                    </Td>
                    <Td>
                      <Badge variant={pct >= 50 ? 'success' : 'danger'}>{grade}</Badge>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </TableContainer>
        <div className="px-4">
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={() => triggerSave('draft')} className="btn-outline">
          <Save className="h-4 w-4" /> Save as Draft
        </button>
        <button onClick={() => triggerSave('published')} className="btn-navy">
          <Send className="h-4 w-4" /> Publish Marks
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => executeSave(pendingStatus)}
        title={pendingStatus === 'published' ? 'Publish Marks?' : 'Overwrite Published Marks?'}
        description={
          pendingStatus === 'published'
            ? 'Publishing marks will make them immediately visible to students on their dashboards. Proceed?'
            : 'These marks have already been published. Saving new edits will overwrite the existing entries. Proceed?'
        }
      />
    </div>
  );
}

// -------- Teacher's Students view --------
export function TeacherStudents() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const students = useMemo(() => {
    return studentService.getAll().filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const paged = students.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(students.length / pageSize);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-display text-base font-bold text-navy-800">My Students</h2>
          <p className="text-xs text-ink-muted">{students.length} students enrolled</p>
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
                  <ProgressBar value={s.attendancePct} className="w-16" />
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
