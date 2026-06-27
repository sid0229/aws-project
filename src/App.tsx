import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider } from './components/ui/toast';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/public/landing';
import { LoginPage, SignupPage } from './components/public/auth';
import { DashboardShell, type NavKey } from './components/dashboard/shell';
import { StudentOverview, StudentAttendance, StudentResources, StudentAnnouncements, StudentMarks, StudentProfile } from './components/dashboard/student';
import { TeacherOverview, TeacherAttendance, TeacherResources, TeacherAnnouncements, TeacherMarks, TeacherStudents } from './components/dashboard/teacher';
import { AdminOverview, AdminStudents, AdminTeachers, AdminClasses, AdminReports } from './components/dashboard/admin';

type Route = 'landing' | 'login' | 'signup';

function Shell() {
  const { user } = useAuth();
  const [route, setRoute] = useState<Route>('landing');
  const [nav, setNav] = useState<NavKey>('dashboard');

  if (user) {
    return <RoleDashboard nav={nav} setNav={setNav} />;
  }

  if (route === 'login') {
    return (
      <LoginPage
        onLogin={() => setNav('dashboard')}
        onBack={() => setRoute('landing')}
        onSignup={() => setRoute('signup')}
      />
    );
  }
  if (route === 'signup') {
    return (
      <SignupPage
        onSignup={() => setNav('dashboard')}
        onBack={() => setRoute('landing')}
        onLogin={() => setRoute('login')}
      />
    );
  }
  return <LandingPage onGetStarted={() => setRoute('signup')} onLogin={() => setRoute('login')} />;
}

function RoleDashboard({ nav, setNav }: { nav: NavKey; setNav: (k: NavKey) => void }) {
  const { user } = useAuth();
  const role = user!.role;

  const titles: Record<string, Partial<Record<NavKey, { title: string; subtitle: string }>>> = {
    student: {
      dashboard: { title: 'Dashboard', subtitle: 'Your academic overview' },
      attendance: { title: 'Attendance', subtitle: 'Track your class attendance' },
      resources: { title: 'Resources', subtitle: 'Download course materials' },
      announcements: { title: 'Announcements', subtitle: 'Latest updates from faculty' },
      marks: { title: 'Marks', subtitle: 'Your exam results' },
      profile: { title: 'Profile', subtitle: 'Manage your account' },
    },
    teacher: {
      dashboard: { title: 'Dashboard', subtitle: 'Your teaching overview' },
      attendance: { title: 'Attendance', subtitle: 'Mark attendance for your classes' },
      resources: { title: 'Resources', subtitle: 'Upload & manage materials' },
      announcements: { title: 'Announcements', subtitle: 'Publish announcements' },
      marks: { title: 'Marks', subtitle: 'Enter & publish marks' },
      students: { title: 'Students', subtitle: 'Students across your classes' },
    },
    admin: {
      dashboard: { title: 'Dashboard', subtitle: 'Institution overview' },
      teachers: { title: 'Teachers', subtitle: 'Manage faculty' },
      students: { title: 'Students', subtitle: 'Manage student records' },
      classes: { title: 'Classes', subtitle: 'All classes & sections' },
      reports: { title: 'Reports', subtitle: 'Analytics & insights' },
    },
  };

  const t = titles[role][nav] ?? { title: 'Dashboard', subtitle: '' };

  const render = () => {
    if (role === 'student') {
      switch (nav) {
        case 'dashboard': return <StudentOverview onNavigate={setNav} />;
        case 'attendance': return <StudentAttendance />;
        case 'resources': return <StudentResources />;
        case 'announcements': return <StudentAnnouncements />;
        case 'marks': return <StudentMarks />;
        case 'profile': return <StudentProfile />;
      }
    }
    if (role === 'teacher') {
      switch (nav) {
        case 'dashboard': return <TeacherOverview />;
        case 'attendance': return <TeacherAttendance />;
        case 'resources': return <TeacherResources />;
        case 'announcements': return <TeacherAnnouncements />;
        case 'marks': return <TeacherMarks />;
        case 'students': return <TeacherStudents />;
      }
    }
    if (role === 'admin') {
      switch (nav) {
        case 'dashboard': return <AdminOverview />;
        case 'students': return <AdminStudents />;
        case 'teachers': return <AdminTeachers />;
        case 'classes': return <AdminClasses />;
        case 'reports': return <AdminReports />;
      }
    }
    return null;
  };

  return (
    <DashboardShell active={nav} onNavigate={setNav} title={t.title} subtitle={t.subtitle}>
      {render()}
    </DashboardShell>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
