import {
  CalendarCheck,
  FolderOpen,
  Megaphone,
  Award,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Play,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { PublicNavbar, Footer } from './layout';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Attendance Management',
    description: 'Mark attendance in seconds with bulk actions, search, and day-by-day tracking per class and subject.',
  },
  {
    icon: FolderOpen,
    title: 'Resource Sharing',
    description: 'Upload PDFs, notes, and slides in a beautiful drag-and-drop library. Students download instantly.',
  },
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Publish time-stamped announcements that reach the right audience with an elegant timeline view.',
  },
  {
    icon: Award,
    title: 'Marks Publishing',
    description: 'Publish internal, mid-sem, and end-sem marks. Save drafts, then release results with one click.',
  },
];

const STATS = [
  { label: 'Students', value: 1200, suffix: '+' },
  { label: 'Faculty', value: 120, suffix: '+' },
  { label: 'Attendance Accuracy', value: 95, suffix: '%' },
  { label: 'Resources Shared', value: 500, suffix: '+' },
];

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ stat, visible }: { stat: (typeof STATS)[0]; visible: boolean }) {
  const value = useCountUp(stat.value, 1600, visible);
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-bold text-navy-800 sm:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="mt-1.5 text-sm font-medium text-ink-muted">{stat.label}</p>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      {/* Main card mockup */}
      <div className="animate-slide-up relative rounded-3xl bg-white p-5 shadow-lift ring-1 ring-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-ink-muted">Teacher Dashboard</p>
            <p className="font-display text-lg font-bold text-navy-800">Welcome, Dr. Anil</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Today', value: '4 Classes', color: 'bg-navy-800' },
            { label: 'Resources', value: '24', color: 'bg-emerald-600' },
            { label: 'Avg Attend', value: '87%', color: 'bg-amber-500' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{s.label}</p>
              <p className="mt-0.5 font-display text-base font-bold text-navy-800">{s.value}</p>
              <div className={`mt-2 h-1.5 w-full rounded-full ${s.color}`} />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border p-3">
          <p className="text-xs font-semibold text-ink">Attendance — This Week</p>
          <div className="mt-2 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { d: 'M', v: 82 },
                { d: 'T', v: 95 },
                { d: 'W', v: 78 },
                { d: 'T', v: 88 },
                { d: 'F', v: 92 },
                { d: 'S', v: 70 },
              ]}>
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Bar dataKey="v" fill="#FFE88A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource card floating */}
        <div className="animate-fade-in absolute -bottom-6 -left-6 hidden w-48 rotate-[-3deg] rounded-xl border border-border bg-white p-3 shadow-card sm:block">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
              <FolderOpen className="h-4 w-4 text-rose-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink">Graph Notes.pdf</p>
              <p className="text-[10px] text-ink-muted">2.4 MB · 84 downloads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating announcement chip */}
      <div className="animate-fade-in absolute -right-3 -top-4 hidden rotate-[4deg] rounded-xl border border-border bg-yellow-light p-3 shadow-card sm:block">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-navy-800" />
          <p className="text-xs font-semibold text-navy-800">Mid-sem schedule out!</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({
  onGetStarted,
  onLogin,
}: {
  onGetStarted: () => void;
  onLogin: () => void;
}) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStatsVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <PublicNavbar onGetStarted={onGetStarted} onLogin={onLogin} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-yellow-light/60 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-navy-50/80 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-light px-3 py-1.5 text-xs font-semibold text-navy-800">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
              New • Academic Year 2024-25
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl">
              Manage Attendance, Resources & Academic Progress in One Place
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              ClassPulse simplifies attendance tracking, resource sharing, announcements, and marks management for educational institutions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={onGetStarted} className="btn-navy px-6 py-3 text-base">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={onLogin} className="btn-outline px-6 py-3 text-base">
                <Play className="h-4 w-4" />
                Demo Login
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
              {['No credit card required', 'Role-based access', 'Built for institutions'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="animate-fade-in lg:pl-8">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-navy-500">Features</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
            Everything your institution needs, in one dashboard
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            From daily attendance to publishing final marks, ClassPulse brings the entire academic workflow together with a clean, modern interface.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group animate-slide-up card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 transition-colors group-hover:bg-yellow-light">
                <f.icon className="h-6 w-6 text-navy-700" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-navy-800 py-20">
        <div ref={statsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-yellow-pastel">
              <TrendingUp className="h-3.5 w-3.5" />
              Trusted by institutions
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Numbers that speak for themselves
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <StatCounter key={s.label} stat={s} visible={statsVisible} />
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-navy-200">
            <Users className="h-4 w-4" />
            Powering 50+ departments across 12 campuses
          </div>
        </div>
      </section>

      {/* About/CTA */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-navy-500">About</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
              Built for educators, loved by students
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              ClassPulse was designed from the ground up to reduce administrative overhead. Teachers spend less time on paperwork and more time teaching. Students always know where they stand — attendance, marks, and resources, all in one elegant place.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Role-based dashboards for students, teachers, and admins',
                'Real-time attendance percentage with color-coded warnings',
                'Centralized resource library with instant downloads',
                'Audit-ready reports and analytics for every department',
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  {p}
                </li>
              ))}
            </ul>
            <button onClick={onGetStarted} className="btn-navy mt-8 px-6 py-3 text-base">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Time saved per week', value: '8 hrs', icon: '⏱' },
              { label: 'Reduction in paperwork', value: '60%', icon: '📄' },
              { label: 'Avg attendance improvement', value: '12%', icon: '📈' },
              { label: 'Student satisfaction', value: '4.8/5', icon: '⭐' },
            ].map((c) => (
              <div key={c.label} className="card p-5">
                <p className="text-2xl">{c.icon}</p>
                <p className="mt-2 font-display text-2xl font-bold text-navy-800">{c.value}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onGetStarted={onGetStarted} onLogin={onLogin} />
    </div>
  );
}
