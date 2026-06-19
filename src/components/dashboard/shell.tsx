import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderOpen,
  Megaphone,
  Award,
  User as UserIcon,
  Users,
  GraduationCap,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BookCopy,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Avatar } from '../ui/primitives';
import { Logo } from '../public/layout';

export type NavKey =
  | 'dashboard'
  | 'attendance'
  | 'resources'
  | 'announcements'
  | 'marks'
  | 'profile'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'reports';

const STUDENT_NAV: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'resources', label: 'Resources', icon: FolderOpen },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'marks', label: 'Marks', icon: Award },
  { key: 'profile', label: 'Profile', icon: UserIcon },
];

const TEACHER_NAV: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'resources', label: 'Resources', icon: FolderOpen },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'marks', label: 'Marks', icon: Award },
  { key: 'students', label: 'Students', icon: Users },
];

const ADMIN_NAV: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'teachers', label: 'Teachers', icon: GraduationCap },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'classes', label: 'Classes', icon: BookCopy },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

function navFor(role: string) {
  if (role === 'teacher') return TEACHER_NAV;
  if (role === 'admin') return ADMIN_NAV;
  return STUDENT_NAV;
}

export function DashboardShell({
  active,
  onNavigate,
  children,
  title,
  subtitle,
  actions,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navFor(user!.role);

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-navy-50 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-3 mb-3 rounded-xl bg-navy-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Signed in as</p>
        <div className="mt-1 flex items-center gap-2">
          <Avatar name={user!.name} color={user!.avatarColor} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-800">{user!.name}</p>
            <p className="truncate text-xs capitalize text-ink-muted">{user!.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setMobileOpen(false);
              }}
              className={`sidebar-link w-full ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button onClick={logout} className="sidebar-link w-full text-danger hover:bg-rose-50 hover:text-danger">
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-white lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="animate-fade-in-fast absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="animate-slide-up absolute inset-y-0 left-0 w-64 bg-white shadow-lift">
            {SidebarBody}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-navy-800 hover:bg-navy-50 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-lg font-bold text-navy-800 sm:text-xl">{title}</h1>
                {subtitle && <p className="hidden text-xs text-ink-muted sm:block">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  placeholder="Search…"
                  className="h-9 w-48 rounded-xl border border-border bg-white pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200"
                />
              </div>
              <button className="relative rounded-xl border border-border bg-white p-2 text-ink-muted transition hover:bg-navy-50 hover:text-navy-800">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
              </button>
              <Avatar name={user!.name} color={user!.avatarColor} size="sm" />
            </div>
          </div>
        </header>

        <main className="page-enter mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
