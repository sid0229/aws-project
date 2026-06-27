import { db } from './db';
import type { Student, Teacher, ClassRoom, Resource, Announcement, AttendanceRecord, Exam, Role } from '../../types';

// Call DB init to populate default values
db.init();

export const authService = {
  login(email: string, password?: string, selectedRole?: Role): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = db.getUsers();
        // If password is not provided, we match by email/role for demo simplicity, but require credentials
        const match = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            (selectedRole ? u.role === selectedRole : true) &&
            (password ? u.password === password : true)
        );

        if (match) {
          const sessionUser = {
            id: match.id,
            name: match.name,
            email: match.email,
            role: match.role,
            avatarColor: match.avatarColor || 'bg-navy-700',
          };
          db.setSession(sessionUser);
          resolve(sessionUser);
        } else {
          // Fallback check against students & teachers
          const students = db.getStudents();
          const stud = students.find(s => s.email.toLowerCase() === email.toLowerCase());
          if (stud && (!selectedRole || selectedRole === 'student')) {
            const sessionUser = { id: stud.id, name: stud.name, email: stud.email, role: 'student' as Role, avatarColor: stud.avatarColor };
            db.setSession(sessionUser);
            return resolve(sessionUser);
          }

          const teachers = db.getTeachers();
          const teach = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
          if (teach && (!selectedRole || selectedRole === 'teacher')) {
            const sessionUser = { id: teach.id, name: teach.name, email: teach.email, role: 'teacher' as Role, avatarColor: teach.avatarColor };
            db.setSession(sessionUser);
            return resolve(sessionUser);
          }

          reject(new Error('Invalid email or password.'));
        }
      }, 500);
    });
  },

  signup(name: string, email: string, role: Role, password?: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = db.getUsers();
        const newUser = {
          id: `${role === 'student' ? 's' : role === 'teacher' ? 't' : 'admin'}${Date.now()}`,
          name,
          email,
          role,
          avatarColor: 'bg-indigo-600',
          password: password || 'password123',
        };
        users.push(newUser);
        db.setUsers(users);

        // If role is student, create a student entry
        if (role === 'student') {
          const students = db.getStudents();
          students.push({
            id: newUser.id,
            name: newUser.name,
            rollNo: `ST${Date.now().toString().slice(-6)}`,
            email: newUser.email,
            classId: 'c1', // default class
            className: 'CSE - 3rd Year A',
            avatarColor: newUser.avatarColor,
            status: 'active',
            attendancePct: 100,
          });
          db.setStudents(students);
        } else if (role === 'teacher') {
          const teachers = db.getTeachers();
          teachers.push({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            subject: 'Data Structures & Algorithms',
            assignedClassIds: ['c1'],
            avatarColor: newUser.avatarColor,
            studentsCount: 22,
          });
          db.setTeachers(teachers);
        }

        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatarColor: newUser.avatarColor,
        };
        db.setSession(sessionUser);
        resolve(sessionUser);
      }, 500);
    });
  },

  logout(): void {
    db.setSession(null);
  },

  getCurrentUser() {
    return db.getSession();
  },
};

export const studentService = {
  getAll: () => db.getStudents(),
  getById: (id: string) => db.getStudents().find((s) => s.id === id),
  save: (student: Student) => {
    const students = db.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    db.setStudents(students);
  },
  delete: (id: string) => {
    const students = db.getStudents().filter((s) => s.id !== id);
    db.setStudents(students);
  },
};

export const teacherService = {
  getAll: () => db.getTeachers(),
  getById: (id: string) => db.getTeachers().find((t) => t.id === id),
  save: (teacher: Teacher) => {
    const teachers = db.getTeachers();
    const idx = teachers.findIndex((t) => t.id === teacher.id);
    if (idx !== -1) {
      teachers[idx] = teacher;
    } else {
      teachers.push(teacher);
    }
    db.setTeachers(teachers);
  },
  delete: (id: string) => {
    const teachers = db.getTeachers().filter((t) => t.id !== id);
    db.setTeachers(teachers);
  },
};

export const classService = {
  getAll: () => db.getClasses(),
  getById: (id: string) => db.getClasses().find((c) => c.id === id),
  save: (cls: ClassRoom) => {
    const classes = db.getClasses();
    const idx = classes.findIndex((c) => c.id === cls.id);
    if (idx !== -1) {
      classes[idx] = cls;
    } else {
      classes.push(cls);
    }
    db.setClasses(classes);
  },
  delete: (id: string) => {
    const classes = db.getClasses().filter((c) => c.id !== id);
    db.setClasses(classes);
  },
};

export const attendanceService = {
  getByClassAndDate: (classId: string, subject: string, date: string) => {
    return db.getAttendance().find(
      (a) => a.classId === classId && a.subject === subject && a.date === date
    );
  },
  submit: (record: AttendanceRecord) => {
    const list = db.getAttendance();
    const idx = list.findIndex(
      (a) => a.classId === record.classId && a.subject === record.subject && a.date === record.date
    );
    if (idx !== -1) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    db.setAttendance(list);

    // Update students' overall attendancePct in db.
    if (record.submitted) {
      const students = db.getStudents();
      const classStudents = students.filter((s) => s.classId === record.classId);
      classStudents.forEach((stud) => {
        // Calculate new attendance percentage
        const classRecords = list.filter((a) => a.classId === record.classId && a.submitted);
        let attended = 0;
        classRecords.forEach((rec) => {
          if (rec.presentStudentIds.includes(stud.id)) {
            attended += 1;
          }
        });
        const total = classRecords.length || 1;
        stud.attendancePct = Math.round((attended / total) * 100);
        
        const mainIdx = students.findIndex((s) => s.id === stud.id);
        if (mainIdx !== -1) {
          students[mainIdx] = stud;
        }
      });
      db.setStudents(students);
    }
  },
};

export const resourceService = {
  getAll: () => db.getResources(),
  save: (res: Resource) => {
    const list = db.getResources();
    const idx = list.findIndex((r) => r.id === res.id);
    if (idx !== -1) {
      list[idx] = res;
    } else {
      list.push(res);
    }
    db.setResources(list);
  },
  delete: (id: string) => {
    const list = db.getResources().filter((r) => r.id !== id);
    db.setResources(list);
  },
  incrementDownloads: (id: string) => {
    const list = db.getResources();
    const res = list.find((r) => r.id === id);
    if (res) {
      res.downloads += 1;
      db.setResources(list);
    }
  },
};

export const announcementService = {
  getAll: () => db.getAnnouncements(),
  save: (ann: Announcement) => {
    const list = db.getAnnouncements();
    const idx = list.findIndex((a) => a.id === ann.id);
    if (idx !== -1) {
      list[idx] = ann;
    } else {
      list.push(ann);
    }
    db.setAnnouncements(list);
  },
  delete: (id: string) => {
    const list = db.getAnnouncements().filter((a) => a.id !== id);
    db.setAnnouncements(list);
  },
  toggleReadState: (id: string, read: boolean) => {
    const list = db.getAnnouncements();
    const ann = list.find((a) => a.id === id);
    if (ann) {
      ann.read = read;
      db.setAnnouncements(list);
    }
  },
};

export const marksService = {
  getExams: () => db.getExams(),
  saveExam: (exam: Exam) => {
    const list = db.getExams();
    const idx = list.findIndex((e) => e.id === exam.id);
    if (idx !== -1) {
      list[idx] = exam;
    } else {
      list.push(exam);
    }
    db.setExams(list);
  },
  getExamById: (id: string) => db.getExams().find((e) => e.id === id),
};
