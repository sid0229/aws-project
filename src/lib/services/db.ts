import { demoData } from '../demo-data';
import type { Student, Teacher, ClassRoom, Resource, Announcement, AttendanceRecord, Exam } from '../../types';

const KEYS = {
  USERS: 'cp_users',
  STUDENTS: 'cp_students',
  TEACHERS: 'cp_teachers',
  CLASSES: 'cp_classes',
  RESOURCES: 'cp_resources',
  ANNOUNCEMENTS: 'cp_announcements',
  ATTENDANCE: 'cp_attendance',
  EXAMS: 'cp_exams',
  SESSION: 'cp_session',
};

// Safe storage wrapper to handle exceptions and corruption
const safeGet = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return defaultValue;
    return JSON.parse(val) as T;
  } catch (e) {
    console.error(`Failed to read key ${key} from local storage:`, e);
    // Reset corrupted slice
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const safeSet = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to write key ${key} to local storage:`, e);
  }
};

export const db = {
  init() {
    // Populate database if empty
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      safeSet(KEYS.STUDENTS, demoData.students);
    }
    if (!localStorage.getItem(KEYS.TEACHERS)) {
      safeSet(KEYS.TEACHERS, demoData.teachers);
    }
    if (!localStorage.getItem(KEYS.CLASSES)) {
      safeSet(KEYS.CLASSES, demoData.classes);
    }
    if (!localStorage.getItem(KEYS.RESOURCES)) {
      safeSet(KEYS.RESOURCES, demoData.resources);
    }
    if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
      safeSet(KEYS.ANNOUNCEMENTS, demoData.announcements);
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      // Empty array of AttendanceRecord[]
      safeSet(KEYS.ATTENDANCE, [] as AttendanceRecord[]);
    }
    if (!localStorage.getItem(KEYS.EXAMS)) {
      // Create initial exams mock structure using subjects & marksData
      const initialExams: Exam[] = [];
      // Midsem and Endsem exams
      demoData.classes.forEach((c) => {
        demoData.subjects.forEach((subj) => {
          ['midsem', 'endsem', 'internal'].forEach((type) => {
            const classStudents = demoData.students.filter((s) => s.classId === c.id);
            initialExams.push({
              id: `${c.id}_${subj.name.replace(/\s+/g, '')}_${type}`,
              classId: c.id,
              subject: subj.name,
              examType: type as any,
              maxMarks: type === 'endsem' ? 50 : type === 'midsem' ? 30 : 20,
              status: 'published',
              entries: classStudents.map((stud) => {
                // Find index or use random
                const markVal = type === 'endsem' ? 35 : type === 'midsem' ? 22 : 15;
                return {
                  studentId: stud.id,
                  studentName: stud.name,
                  rollNo: stud.rollNo,
                  marks: {
                    [type]: markVal,
                  },
                };
              }),
            });
          });
        });
      });
      safeSet(KEYS.EXAMS, initialExams);
    }
    // Set default credentials list
    if (!localStorage.getItem(KEYS.USERS)) {
      const defaultUsers = [
        { id: 's1', name: 'Aarav Sharma', email: 'aarav.sharma1@university.edu', role: 'student', avatarColor: 'bg-navy-700', password: 'password123' },
        { id: 't1', name: 'Dr. Anil Sharma', email: 'anil.sharma@university.edu', role: 'teacher', avatarColor: 'bg-emerald-600', password: 'password123' },
        { id: 'admin1', name: 'Dr. Priya Nair', email: 'priya.nair@university.edu', role: 'admin', avatarColor: 'bg-blue-600', password: 'password123' },
      ];
      safeSet(KEYS.USERS, defaultUsers);
    }
  },

  getStudents: () => safeGet<Student[]>(KEYS.STUDENTS, []),
  setStudents: (s: Student[]) => safeSet(KEYS.STUDENTS, s),

  getTeachers: () => safeGet<Teacher[]>(KEYS.TEACHERS, []),
  setTeachers: (t: Teacher[]) => safeSet(KEYS.TEACHERS, t),

  getClasses: () => safeGet<ClassRoom[]>(KEYS.CLASSES, []),
  setClasses: (c: ClassRoom[]) => safeSet(KEYS.CLASSES, c),

  getResources: () => safeGet<Resource[]>(KEYS.RESOURCES, []),
  setResources: (r: Resource[]) => safeSet(KEYS.RESOURCES, r),

  getAnnouncements: () => safeGet<Announcement[]>(KEYS.ANNOUNCEMENTS, []),
  setAnnouncements: (a: Announcement[]) => safeSet(KEYS.ANNOUNCEMENTS, a),

  getAttendance: () => safeGet<AttendanceRecord[]>(KEYS.ATTENDANCE, []),
  setAttendance: (a: AttendanceRecord[]) => safeSet(KEYS.ATTENDANCE, a),

  getExams: () => safeGet<Exam[]>(KEYS.EXAMS, []),
  setExams: (e: Exam[]) => safeSet(KEYS.EXAMS, e),

  getUsers: () => safeGet<any[]>(KEYS.USERS, []),
  setUsers: (u: any[]) => safeSet(KEYS.USERS, u),

  getSession: () => safeGet<any | null>(KEYS.SESSION, null),
  setSession: (s: any | null) => safeSet(KEYS.SESSION, s),
};
