export type Role = 'student' | 'teacher' | 'admin';

export type ExamType = 'internal' | 'midsem' | 'endsem';

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

export interface Resource {
  id: string;
  title: string;
  subject: string;
  uploadedBy: string;
  uploadedDate: string;
  size: string;
  downloads: number;
  className: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  teacher: string;
  category: 'general' | 'exam' | 'event' | 'urgent';
  read: boolean;
}

export interface MarksEntry {
  subject: string;
  internal: number;
  midsem: number;
  endsem: number;
  maxInternal: number;
  maxMidsem: number;
  maxEndsem: number;
}

export interface AttendanceSubject {
  subject: string;
  code: string;
  attended: number;
  total: number;
  teacher: string;
}
