export type Role = 'student' | 'teacher' | 'admin';

export type ExamType = 'internal' | 'midsem' | 'endsem';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  password?: string; // used for simulated auth checking
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  classId: string;
  className: string;
  avatarColor: string;
  status: 'active' | 'inactive';
  attendancePct: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  assignedClassIds: string[];
  avatarColor: string;
  studentsCount: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  section: string;
  studentsCount: number;
  teacherId: string;
  teacherName: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  className: string;
  subject: string;
  date: string; // YYYY-MM-DD
  presentStudentIds: string[];
  totalStudents: number;
  submitted: boolean; // false if draft, true if submitted
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  uploadedBy: string;
  uploadedDate: string;
  size: string;
  downloads: number;
  className: string;
  description?: string;
  fileUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  teacher: string;
  category: 'general' | 'exam' | 'event' | 'urgent';
  read: boolean;
  status: 'draft' | 'published';
  audience: string; // class name or 'all'
}

export interface MarkEntry {
  studentId: string;
  studentName: string;
  rollNo: string;
  marks: {
    internal?: number;
    midsem?: number;
    endsem?: number;
  };
}

export interface Exam {
  id: string;
  classId: string;
  subject: string;
  examType: ExamType;
  maxMarks: number;
  status: 'draft' | 'published';
  entries: MarkEntry[];
}

export interface DashboardStats {
  studentsCount: number;
  teachersCount: number;
  classesCount: number;
  averageAttendance: number;
}
