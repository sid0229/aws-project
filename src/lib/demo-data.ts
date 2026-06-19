import type {
  Student,
  Teacher,
  ClassRoom,
  Resource,
  Announcement,
  MarksEntry,
  AttendanceSubject,
} from './types';

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Pari', 'Myra',
  'Riya', 'Anika', 'Navya', 'Kiara', 'Aryan', 'Kabir', 'Dhruv', 'Rohan',
  'Karan', 'Neha', 'Tara', 'Sara', 'Meera', 'Ira', 'Advik', 'Riyaan',
  'Rahul', 'Priya', 'Sneha', 'Amit', 'Pooja', 'Raj', 'Nisha', 'Vikram',
  'Ritu', 'Sanjay', 'Kavya', 'Manish', 'Divya', 'Ashok', 'Leena', 'Gaurav',
  'Pallavi', 'Nikhil',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Reddy', 'Nair', 'Patel', 'Singh', 'Mehta',
  'Kapoor', 'Joshi', 'Rao', 'Kumar', 'Iyer', 'Bose', 'Das', 'Malhotra',
  'Chopra', 'Banerjee', 'Pillai', 'Menon',
];

const SUBJECTS = [
  { name: 'Data Structures & Algorithms', code: 'CS301', teacher: 'Dr. Anil Sharma' },
  { name: 'Database Management Systems', code: 'CS302', teacher: 'Prof. Meera Nair' },
  { name: 'Operating Systems', code: 'CS303', teacher: 'Dr. Rajesh Kumar' },
  { name: 'Computer Networks', code: 'CS304', teacher: 'Prof. Sunita Rao' },
  { name: 'Software Engineering', code: 'CS305', teacher: 'Dr. Vikram Iyer' },
  { name: 'Machine Learning', code: 'CS306', teacher: 'Prof. Neha Gupta' },
];

const CLASSES: ClassRoom[] = [
  { id: 'c1', name: 'CSE - 3rd Year A', grade: 'CSE', section: 'A', studentsCount: 22, teacherId: 't1', teacherName: 'Dr. Anil Sharma', room: 'B-201' },
  { id: 'c2', name: 'CSE - 3rd Year B', grade: 'CSE', section: 'B', studentsCount: 20, teacherId: 't2', teacherName: 'Prof. Meera Nair', room: 'B-202' },
  { id: 'c3', name: 'IT - 3rd Year', grade: 'IT', section: 'A', studentsCount: 18, teacherId: 't3', teacherName: 'Dr. Rajesh Kumar', room: 'C-101' },
  { id: 'c4', name: 'ECE - 3rd Year', grade: 'ECE', section: 'A', studentsCount: 21, teacherId: 't4', teacherName: 'Prof. Sunita Rao', room: 'D-301' },
  { id: 'c5', name: 'CSE - 2nd Year', grade: 'CSE', section: 'A1', studentsCount: 19, teacherId: 't5', teacherName: 'Dr. Vikram Iyer', room: 'B-105' },
];

const AVATAR_COLORS = [
  'bg-navy-700', 'bg-navy-500', 'bg-emerald-600', 'bg-blue-600', 'bg-teal-600',
  'bg-cyan-700', 'bg-indigo-600', 'bg-sky-600', 'bg-rose-500', 'bg-amber-600',
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRand(42);

// 100 Students
const students: Student[] = Array.from({ length: 100 }, (_, i) => {
  const first = pick(FIRST_NAMES, i * 3 + 1);
  const last = pick(LAST_NAMES, i * 2 + 2);
  const cls = pick(CLASSES, i);
  const rollNumber = `${cls.grade.slice(0, 2)}${cls.section}${String(i + 1).padStart(3, '0')}`;
  const attendancePct = Math.round(55 + rand() * 45);
  return {
    id: `s${i + 1}`,
    name: `${first} ${last}`,
    rollNo: rollNumber,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@university.edu`,
    classId: cls.id,
    className: cls.name,
    avatarColor: pick(AVATAR_COLORS, i),
    status: rand() > 0.1 ? 'active' : 'inactive',
    attendancePct,
  };
});

// 10 Teachers
const TEACHER_NAMES = [
  'Dr. Anil Sharma', 'Prof. Meera Nair', 'Dr. Rajesh Kumar', 'Prof. Sunita Rao',
  'Dr. Vikram Iyer', 'Prof. Neha Gupta', 'Dr. Sandeep Verma', 'Prof. Anita Desai',
  'Dr. Manoj Pillai', 'Prof. Karuna Menon',
];

const teachers: Teacher[] = TEACHER_NAMES.map((name, i) => {
  const subj = pick(SUBJECTS, i);
  const assignedClasses = [CLASSES[i % CLASSES.length].id, CLASSES[(i + 2) % CLASSES.length].id];
  return {
    id: `t${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@university.edu`,
    subject: subj.name,
    assignedClassIds: assignedClasses,
    avatarColor: pick(AVATAR_COLORS, i),
    studentsCount: assignedClasses.reduce((acc, cid) => acc + (CLASSES.find((c) => c.id === cid)?.studentsCount ?? 0), 0),
  };
});

// Resources
const RESOURCE_TITLES = [
  'Graph Traversal Algorithms Notes',
  'Normalization in DBMS — Complete Guide',
  'Process Scheduling Cheatsheet',
  'TCP/IP Layered Model Slides',
  'Agile & Scrum Methodologies',
  'Supervised Learning Algorithms PDF',
  'Sorting Algorithms Visualization Deck',
  'ACID Properties & Transactions',
  'Deadlock Prevention Techniques',
  'Network Security Fundamentals',
  'Design Patterns Handbook',
  'Linear Regression Math Notes',
];

const resources: Resource[] = RESOURCE_TITLES.slice(0, 12).map((title, i) => {
  const subj = pick(SUBJECTS, i);
  const teacher = pick(TEACHER_NAMES, i);
  const date = new Date(2024, 0, 28 - i * 2);
  return {
    id: `r${i + 1}`,
    title,
    subject: subj.name,
    uploadedBy: teacher,
    uploadedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    size: `${(1 + rand() * 8).toFixed(1)} MB`,
    downloads: Math.floor(rand() * 200 + 30),
    className: pick(CLASSES, i).name,
  };
});

// Announcements
const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Mid Semester Examinations Schedule Released',
    message: 'The mid-semester examination timetable has been published on the portal. Exams begin March 18th. Please check your respective subject pages for room allocations and seating arrangements.',
    date: '2 hours ago',
    teacher: 'Dr. Anil Sharma',
    category: 'exam',
    read: false,
  },
  {
    id: 'a2',
    title: 'DSA Assignment 4 Deadline Extended',
    message: 'Considering multiple requests, the deadline for Assignment 4 (Dynamic Programming) has been extended to Friday, 11:59 PM. Late submissions will incur a 10% penalty per day.',
    date: '5 hours ago',
    teacher: 'Prof. Meera Nair',
    category: 'general',
    read: false,
  },
  {
    id: 'a3',
    title: 'Guest Lecture: Cloud Architecture at Scale',
    message: 'Join us this Thursday for a guest lecture by Principal Engineer Aisha Khan on distributed systems architecture. Auditorium B, 4 PM. Open to all CSE & IT students.',
    date: 'Yesterday',
    teacher: 'Dr. Vikram Iyer',
    category: 'event',
    read: false,
  },
  {
    id: 'a4',
    title: 'Library Resources Updated — New ML Dataset',
    message: 'A new dataset for the machine learning coursework has been added to the resource library. Please download it ahead of the next lab session.',
    date: '2 days ago',
    teacher: 'Prof. Neha Gupta',
    category: 'general',
    read: true,
  },
  {
    id: 'a5',
    title: 'Attendance Shortage Warning — Below 75%',
    message: 'Students with attendance below 75% in any subject must meet their respective faculty advisors this week. This is mandatory per university policy.',
    date: '3 days ago',
    teacher: 'Dr. Rajesh Kumar',
    category: 'urgent',
    read: true,
  },
  {
    id: 'a6',
    title: 'Hackathon Registration Open',
    message: 'The annual CodeFest hackathon is back. Register teams of up to 4 members before March 25th. Prize pool of Rs. 2,00,000. Visit the coding club desk for details.',
    date: '5 days ago',
    teacher: 'Prof. Sunita Rao',
    category: 'event',
    read: true,
  },
];

// Attendance subjects for the logged-in student
const attendanceSubjects: AttendanceSubject[] = SUBJECTS.map((s) => {
  const total = 30 + Math.floor(rand() * 20);
  const attendedRatio = 0.6 + rand() * 0.38;
  const attended = Math.min(total, Math.floor(total * attendedRatio));
  return {
    subject: s.name,
    code: s.code,
    attended,
    total,
    teacher: s.teacher,
  };
});

// Marks
const marksData: MarksEntry[] = SUBJECTS.map((s) => {
  const maxInternal = 20;
  const maxMidsem = 30;
  const maxEndsem = 50;
  return {
    subject: s.name,
    internal: Math.round(maxInternal * (0.7 + rand() * 0.3)),
    midsem: Math.round(maxMidsem * (0.65 + rand() * 0.35)),
    endsem: Math.round(maxEndsem * (0.6 + rand() * 0.4)),
    maxInternal,
    maxMidsem,
    maxEndsem,
  };
});

// Attendance trend (last 7 weeks)
const attendanceTrend = Array.from({ length: 7 }, (_, i) => ({
  week: `W${i + 1}`,
  attendance: Math.round(70 + rand() * 28),
  average: 82,
}));

// Class performance for admin reports
const classPerformance = CLASSES.map((c) => ({
  name: c.name.split(' - ')[0] + ' ' + c.section,
  attendance: Math.round(70 + rand() * 28),
  performance: Math.round(60 + rand() * 38),
}));

// Resource usage per week
const resourceUsage = Array.from({ length: 6 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
  uploads: Math.round(20 + rand() * 60),
  downloads: Math.round(200 + rand() * 500),
}));

// Announcement engagement
const announcementEngagement = announcements.slice(0, 5).map((a) => ({
  name: a.title.length > 22 ? a.title.slice(0, 22) + '…' : a.title,
  views: Math.round(200 + rand() * 800),
  actions: Math.round(50 + rand() * 300),
}));

// Teacher schedule (today's classes)
const teacherSchedule = [
  { time: '09:00 - 09:55', subject: 'Data Structures & Algorithms', class: 'CSE - 3rd Year A', room: 'B-201', students: 22 },
  { time: '10:00 - 10:55', subject: 'Data Structures & Algorithms', class: 'CSE - 3rd Year B', room: 'B-202', students: 20 },
  { time: '11:15 - 12:10', subject: 'DSA Lab', class: 'CSE - 3rd Year A', room: 'Lab 3', students: 22 },
  { time: '02:00 - 02:55', subject: 'Tutorial — Graphs', class: 'CSE - 3rd Year A', room: 'B-201', students: 22 },
];

export const demoData = {
  students,
  teachers,
  classes: CLASSES,
  resources,
  announcements,
  attendanceSubjects,
  marksData,
  attendanceTrend,
  classPerformance,
  resourceUsage,
  announcementEngagement,
  teacherSchedule,
  subjects: SUBJECTS,
};

export type DemoData = typeof demoData;
