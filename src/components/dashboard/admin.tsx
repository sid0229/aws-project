import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookCopy,
  FolderOpen,
  TrendingUp,
  Search,
  UserPlus,
  Upload,
  Trash2,
  Pencil,
  Building2,
  Mail,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  studentService,
  teacherService,
  classService,
  resourceService,
} from '../../lib/services';
import { Avatar, Badge, Card, ProgressBar } from '../ui/widgets';
import { StatCard, SectionHeader, TableContainer, Th, Td, Pagination } from './widgets';
import { Modal } from '../ui/modal';
import { useToast } from '../ui/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import {
  ClassPerformanceChart,
  ResourceUsageChart,
  AnnouncementEngagementChart,
  AttendanceTrendChart,
} from '../charts/reusable-charts';
import { demoData } from '../../lib/demo-data';
import type { Student, Teacher, ClassRoom } from '../../types';

// Helper to parse CSV simply
function parseSimpleCSV(text: string): string[][] {
  const lines = text.split('\n');
  return lines
    .map((line) => line.split(',').map((cell) => cell.trim()))
    .filter((row) => row.length > 1 || (row.length === 1 && row[0] !== ''));
}

// -------- Admin Overview --------
export function AdminOverview() {
  const students = studentService.getAll();
  const teachers = teacherService.getAll();
  const classes = classService.getAll();
  const resources = resourceService.getAll();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-navy-800 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-200">Institution Overview</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Northgate University</h2>
            <p className="mt-2 text-sm text-navy-200">Academic Year 2026-27 · Semester in progress</p>
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
        <StatCard label="Total Students" value={students.length} icon={Users} accent="navy" />
        <StatCard label="Total Teachers" value={teachers.length} icon={GraduationCap} accent="yellow" />
        <StatCard label="Total Classes" value={classes.length} icon={BookCopy} accent="success" />
        <StatCard label="Total Resources" value={resources.length} icon={FolderOpen} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Attendance Trends" description="Weekly institutional average" />
          <AttendanceTrendChart data={demoData.attendanceTrend} />
        </Card>

        <Card className="p-5">
          <SectionHeader title="Class Performance" description="Attendance vs performance" />
          <ClassPerformanceChart data={demoData.classPerformance} />
        </Card>
      </div>
    </div>
  );
}

// -------- Student Management --------
export function AdminStudents() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes] = useState<ClassRoom[]>(classService.getAll());
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Add/Edit Student modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    classId: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Delete modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // CSV Import Modal State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importSummary, setImportSummary] = useState<{
    valid: { name: string; rollNo: string; email: string; classId: string; className: string }[];
    invalid: { row: number; data: string[]; reason: string }[];
  } | null>(null);

  const loadStudents = () => {
    setStudents(studentService.getAll());
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Pre-fill form when editing
  const handleOpenAdd = () => {
    setEditStudentId(null);
    setFormData({
      name: '',
      rollNo: `ST${Date.now().toString().slice(-4)}`,
      email: '',
      classId: classes[0]?.id || '',
      status: 'active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditStudentId(s.id);
    setFormData({
      name: s.name,
      rollNo: s.rollNo,
      email: s.email,
      classId: s.classId,
      status: s.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ type: 'warning', title: 'Missing fields', description: 'Name and email are required.' });
      return;
    }
    const selectedClass = classes.find((c) => c.id === formData.classId);

    const studentRecord: Student = {
      id: editStudentId || `s_${Date.now()}`,
      name: formData.name,
      rollNo: formData.rollNo,
      email: formData.email,
      classId: formData.classId,
      className: selectedClass?.name || 'Unassigned',
      avatarColor: 'bg-navy-700',
      status: formData.status,
      attendancePct: editStudentId ? (students.find((s) => s.id === editStudentId)?.attendancePct ?? 90) : 100,
    };

    studentService.save(studentRecord);
    setModalOpen(false);
    loadStudents();
    toast({
      type: 'success',
      title: editStudentId ? 'Student updated' : 'Student added',
      description: `Successfully saved record for ${formData.name}.`,
    });
  };

  const confirmDelete = (s: Student) => {
    setStudentToDelete(s);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (studentToDelete) {
      studentService.delete(studentToDelete.id);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      loadStudents();
      toast({ type: 'info', title: 'Deleted', description: 'Student record removed.' });
    }
  };

  // CSV Processing
  const handleParseCSV = () => {
    if (!csvText.trim()) {
      toast({ type: 'warning', title: 'Empty CSV', description: 'Please paste CSV content first.' });
      return;
    }

    const rows = parseSimpleCSV(csvText);
    const valid: { name: string; rollNo: string; email: string; classId: string; className: string }[] = [];
    const invalid: { row: number; data: string[]; reason: string }[] = [];

    // Format: name, rollNo, email, classId
    rows.forEach((row, idx) => {
      // Skip header row if it contains 'name' or 'email'
      if (idx === 0 && (row[0].toLowerCase().includes('name') || row[2].toLowerCase().includes('email'))) {
        return;
      }

      if (row.length < 4) {
        invalid.push({ row: idx + 1, data: row, reason: 'Row contains less than 4 columns (Name, RollNo, Email, ClassId).' });
        return;
      }

      const [name, rollNo, email, classId] = row;
      const targetClass = classes.find((c) => c.id === classId || c.name.toLowerCase() === classId.toLowerCase());

      if (!name || !rollNo || !email || !classId) {
        invalid.push({ row: idx + 1, data: row, reason: 'One or more required fields are empty.' });
        return;
      }

      if (!email.includes('@')) {
        invalid.push({ row: idx + 1, data: row, reason: 'Invalid email address format.' });
        return;
      }

      if (!targetClass) {
        invalid.push({ row: idx + 1, data: row, reason: `Class code/ID "${classId}" not found in current classes.` });
        return;
      }

      valid.push({
        name,
        rollNo,
        email,
        classId: targetClass.id,
        className: targetClass.name,
      });
    });

    setImportSummary({ valid, invalid });
  };

  const handleImportValid = () => {
    if (!importSummary || importSummary.valid.length === 0) return;

    importSummary.valid.forEach((row) => {
      const studentRecord: Student = {
        id: `s_${Date.now()}_${Math.random().toString().slice(-4)}`,
        name: row.name,
        rollNo: row.rollNo,
        email: row.email,
        classId: row.classId,
        className: row.className,
        avatarColor: 'bg-indigo-600',
        status: 'active',
        attendancePct: 100,
      };
      studentService.save(studentRecord);
    });

    toast({
      type: 'success',
      title: 'Import completed',
      description: `Successfully imported ${importSummary.valid.length} students into roster.`,
    });
    setCsvText('');
    setImportSummary(null);
    setCsvModalOpen(false);
    loadStudents();
  };

  const filtered = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.className.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

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
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search students…"
              className="input pl-9"
            />
          </div>
          <button onClick={() => setCsvModalOpen(true)} className="btn-outline">
            <Upload className="h-4 w-4" /> Import CSV
          </button>
          <button onClick={handleOpenAdd} className="btn-navy">
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
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-ink-muted text-sm">No students found.</td>
            </tr>
          ) : (
            paged.map((s) => (
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
                    <ProgressBar value={s.attendancePct} className="w-14" />
                    <span className="text-xs font-semibold text-ink">{s.attendancePct}%</span>
                  </div>
                </Td>
                <Td>
                  <Badge variant={s.status === 'active' ? 'success' : 'gray'}>{s.status}</Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="rounded-lg p-1.5 text-ink-muted hover:bg-navy-50 hover:text-navy-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(s)}
                      className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-50 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </TableContainer>
      <div className="px-4">
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editStudentId ? 'Edit Student' : 'Add New Student'}>
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Aarav Sharma"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Roll Number</label>
              <input
                className="input"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="CS-A001"
              />
            </div>
            <div>
              <label className="label">Class</label>
              <select
                className="input"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@university.edu"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={formData.status}
              onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSave} className="btn-navy">
              Save Student
            </button>
          </div>
        </div>
      </Modal>

      {/* CSV Import Modal */}
      <Modal open={csvModalOpen} onClose={() => setCsvModalOpen(false)} title="Import Students List via CSV" size="lg">
        <div className="space-y-4">
          <p className="text-xs text-ink-muted">
            Format your CSV as follows: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Name, RollNo, Email, ClassID</code>. You can paste raw CSV data below.
          </p>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={5}
            placeholder="Aarav Sharma,CS-A101,aarav@univ.edu,c1&#10;Vihaan Reddy,CS-A102,vihaan@univ.edu,c2"
            className="input font-mono text-xs resize-none"
          />
          <div className="flex justify-between items-center">
            <button onClick={() => setImportSummary(null)} className="btn-ghost text-xs">Clear Results</button>
            <button onClick={handleParseCSV} className="btn-navy py-1.5 text-xs">Parse CSV</button>
          </div>

          {importSummary && (
            <div className="mt-4 border-t border-border pt-4 space-y-3">
              <h3 className="font-semibold text-sm text-navy-800">CSV Parsing Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                    <CheckCircle className="h-4 w-4" /> Valid Rows ({importSummary.valid.length})
                  </div>
                  <ul className="mt-1 text-[11px] text-emerald-700 max-h-36 overflow-y-auto space-y-1">
                    {importSummary.valid.map((r, i) => (
                      <li key={i}>{r.name} ({r.rollNo}) - Class: {r.className}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                  <div className="flex items-center gap-1.5 text-rose-800 font-semibold text-xs">
                    <AlertTriangle className="h-4 w-4" /> Invalid Rows ({importSummary.invalid.length})
                  </div>
                  <ul className="mt-1 text-[11px] text-rose-700 max-h-36 overflow-y-auto space-y-1.5">
                    {importSummary.invalid.map((r, i) => (
                      <li key={i}>
                        <span className="font-semibold">Row {r.row}:</span> {r.reason}
                        <div className="text-[10px] text-rose-500/80 truncate">Data: [{r.data.join(', ')}]</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {importSummary.valid.length > 0 && (
                <div className="flex justify-end pt-2 border-t border-border">
                  <button onClick={handleImportValid} className="btn-navy py-2 px-4 text-xs font-semibold">
                    Import {importSummary.valid.length} Valid Records
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Student Record?"
        description={`Are you sure you want to delete the record for ${studentToDelete?.name}? This action is irreversible.`}
      />
    </Card>
  );
}

// -------- Teacher Management --------
export function AdminTeachers() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalTeacherId, setAssignModalTeacherId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: demoData.subjects[0].name,
  });

  const loadData = () => {
    setTeachers(teacherService.getAll());
    setClasses(classService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      subject: demoData.subjects[0].name,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ type: 'warning', title: 'Missing fields', description: 'Name and email are required.' });
      return;
    }

    const newT: Teacher = {
      id: `t_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      assignedClassIds: [],
      avatarColor: 'bg-emerald-600',
      studentsCount: 0,
    };

    teacherService.save(newT);
    setModalOpen(false);
    loadData();
    toast({ type: 'success', title: 'Teacher onboarded', description: `${formData.name} was added.` });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove faculty member ${name}?`)) {
      teacherService.delete(id);
      loadData();
      toast({ type: 'info', title: 'Removed', description: 'Teacher record deleted.' });
    }
  };

  const handleAssignClass = (classId: string) => {
    if (assignModalTeacherId) {
      const teacher = teacherService.getById(assignModalTeacherId);
      const targetClass = classService.getById(classId);

      if (teacher && targetClass) {
        // Toggle assignment
        if (teacher.assignedClassIds.includes(classId)) {
          teacher.assignedClassIds = teacher.assignedClassIds.filter((id) => id !== classId);
        } else {
          teacher.assignedClassIds.push(classId);
        }

        // Save class assignment
        targetClass.teacherId = teacher.id;
        targetClass.teacherName = teacher.name;
        classService.save(targetClass);

        // Compute studentsCount
        const classList = classService.getAll();
        teacher.studentsCount = teacher.assignedClassIds.reduce(
          (acc, cid) => acc + (classList.find((c) => c.id === cid)?.studentsCount ?? 0),
          0
        );

        teacherService.save(teacher);
        setAssignModalTeacherId(null);
        loadData();
        toast({
          type: 'success',
          title: 'Class Assigned',
          description: `Class ${targetClass.name} assigned to ${teacher.name}.`,
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="font-display text-base font-bold text-navy-800">Teacher Management</h2>
          <p className="text-xs text-ink-muted">{teachers.length} faculty members</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-navy">
          <UserPlus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => {
          const assigned = classes.filter((c) => t.assignedClassIds.includes(c.id));
          return (
            <div key={t.id} className="rounded-xl border border-border p-4 transition hover:border-navy-200 hover:shadow-soft bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} color={t.avatarColor} size="md" />
                  <div>
                    <p className="font-semibold text-navy-800">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.subject}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(t.id, t.name)} className="rounded-lg p-1.5 text-ink-muted hover:bg-rose-50 hover:text-danger">
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
                  {assigned.length === 0 ? (
                    <span className="text-xs text-ink-muted italic">No classes assigned</span>
                  ) : (
                    assigned.map((c) => (<Badge key={c.id} variant="navy">{c.name}</Badge>))
                  )}
                </div>
                <button onClick={() => setAssignModalTeacherId(t.id)} className="btn-ghost mt-2 w-full text-xs">
                  <Building2 className="h-3.5 w-3.5" /> Assign Class
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Teacher Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Teacher">
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Anil Sharma"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="faculty@university.edu"
            />
          </div>
          <div>
            <label className="label">Primary Subject</label>
            <select
              className="input"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              {demoData.subjects.map((s) => (<option key={s.code} value={s.name}>{s.name}</option>))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSave} className="btn-navy">
              Add Teacher
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Class Modal */}
      <Modal open={!!assignModalTeacherId} onClose={() => setAssignModalTeacherId(null)} title="Assign Class To Faculty">
        <div className="space-y-2">
          {classes.map((c) => {
            const currentTeacher = teachers.find(t => t.id === assignModalTeacherId);
            const isAssigned = currentTeacher?.assignedClassIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleAssignClass(c.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                  isAssigned ? 'border-navy-600 bg-navy-50/50' : 'border-border bg-white hover:border-navy-200 hover:bg-navy-50/20'
                }`}
              >
                <div>
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.studentsCount} students · Room {c.room}</p>
                </div>
                {isAssigned ? (
                  <Badge variant="success">Assigned</Badge>
                ) : (
                  <Building2 className="h-4 w-4 text-ink-muted" />
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </Card>
  );
}

// -------- Classes --------
export function AdminClasses() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('');

  const loadClasses = () => {
    setClasses(classService.getAll());
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSaveClass = () => {
    if (!newClassName.trim() || !newClassRoom.trim()) return;
    const newC: ClassRoom = {
      id: `c_${Date.now()}`,
      name: newClassName,
      grade: newClassName.split(' ')[0] || 'CSE',
      section: newClassName.split(' ').pop() || 'A',
      studentsCount: 0,
      teacherId: '',
      teacherName: 'Unassigned',
      room: newClassRoom,
    };
    classService.save(newC);
    setNewClassName('');
    setNewClassRoom('');
    setModalOpen(false);
    loadClasses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeader title="Institution Classrooms" description={`${classes.length} classroom profiles`} />
        <button onClick={() => setModalOpen(true)} className="btn-navy py-2 text-xs font-semibold">
          Add Classroom
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <Card key={c.id} hover className="p-5 bg-white">
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
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Class/Section">
        <div className="space-y-4">
          <div>
            <label className="label">Class Name</label>
            <input
              className="input"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g. CSE - 2nd Year A"
            />
          </div>
          <div>
            <label className="label">Room Code</label>
            <input
              className="input"
              value={newClassRoom}
              onChange={(e) => setNewClassRoom(e.target.value)}
              placeholder="e.g. B-105"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleSaveClass} className="btn-navy">
              Add Class
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// -------- Reports --------
export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Avg Attendance" value="87%" icon={TrendingUp} accent="success" />
        <StatCard label="Resource Downloads" value="2.4k" icon={FolderOpen} accent="yellow" />
        <StatCard label="Announcement Reach" value="4.8k" icon={Users} accent="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Attendance Analytics" description="Class-wise attendance %" />
          <ClassPerformanceChart data={demoData.classPerformance} />
        </Card>

        <Card className="p-5">
          <SectionHeader title="Resource Usage" description="Uploads & downloads over time" />
          <ResourceUsageChart data={demoData.resourceUsage} />
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Announcement Engagement" description="Views vs actions per announcement" />
        <AnnouncementEngagementChart data={demoData.announcementEngagement} />
      </Card>
    </div>
  );
}
