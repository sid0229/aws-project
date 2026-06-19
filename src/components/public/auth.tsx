import { GraduationCap, Mail, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, BookOpen, Users, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../../lib/types';
import { useToast } from '../ui/toast';

const ROLE_OPTIONS: { value: Role; label: string; icon: typeof User; desc: string }[] = [
  { value: 'student', label: 'Student', icon: Users, desc: 'View your academic info' },
  { value: 'teacher', label: 'Teacher', icon: BookOpen, desc: 'Manage classes & resources' },
  { value: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Oversee the institution' },
];

function IllustrationPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-navy-800 lg:flex lg:flex-col lg:justify-between lg:p-10">
      <div className="absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-pastel/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-navy-600/40 blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <GraduationCap className="h-5 w-5 text-yellow-pastel" />
          </div>
          <span className="font-display text-xl font-bold text-white">ClassPulse</span>
        </div>
      </div>
      <div className="relative">
        <h2 className="font-display text-3xl font-bold leading-tight text-white">
          The pulse of your classroom, in one elegant place.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-navy-200">
          Sign in to access attendance, resources, announcements, and marks — tailored to your role.
        </p>
        <div className="mt-8 space-y-3">
          {['Role-based dashboards', 'Real-time attendance tracking', 'Instant resource downloads'].map((p) => (
            <div key={p} className="flex items-center gap-3 text-sm text-navy-100">
              <CheckCircle2 className="h-5 w-5 text-yellow-pastel" />
              {p}
            </div>
          ))}
        </div>
      </div>
      <p className="relative text-xs text-navy-300">© 2024 ClassPulse. All rights reserved.</p>
    </div>
  );
}

export function LoginPage({
  onLogin,
  onBack,
  onSignup,
}: {
  onLogin: (role: Role) => void;
  onBack: () => void;
  onSignup: () => void;
}) {
  const { toast } = useToast();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Logged in successfully',
      description: `Welcome back to ClassPulse as ${role}.`,
    });
    onLogin(role);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <IllustrationPanel />
      <div className="flex flex-col bg-bg">
        <div className="flex items-center justify-between p-6">
          <button onClick={onBack} className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="animate-slide-up w-full max-w-md">
            <h1 className="font-display text-3xl font-bold text-navy-800">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-muted">Sign in to access your dashboard.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="label">I am a</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const active = role === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setRole(opt.value)}
                        className={`rounded-xl border p-3 text-center transition-all ${
                          active
                            ? 'border-navy-700 bg-navy-50 ring-2 ring-navy-200'
                            : 'border-border bg-white hover:border-navy-200'
                        }`}
                      >
                        <opt.icon className={`mx-auto h-5 w-5 ${active ? 'text-navy-800' : 'text-ink-muted'}`} />
                        <p className={`mt-1.5 text-xs font-semibold ${active ? 'text-navy-800' : 'text-ink'}`}>{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="input pl-9"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label">Password</label>
                  <button type="button" onClick={() => toast({ type: 'info', title: 'Password reset link sent', description: 'Check your email inbox.' })} className="text-xs font-medium text-navy-600 hover:text-navy-800">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-9 pr-9"
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-navy w-full py-3 text-base">
                Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Don't have an account?{' '}
              <button onClick={onSignup} className="font-semibold text-navy-700 hover:text-navy-800">
                Sign up
              </button>
            </p>
            <div className="mt-4 rounded-xl bg-yellow-light px-4 py-3 text-center text-xs text-navy-800">
              <span className="font-semibold">Demo tip:</span> Pick a role and click Login — we'll load realistic demo data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage({
  onSignup,
  onBack,
  onLogin,
}: {
  onSignup: (role: Role) => void;
  onBack: () => void;
  onLogin: () => void;
}) {
  const { toast } = useToast();
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Account created',
      description: `Welcome to ClassPulse, ${name || 'there'}!`,
    });
    onSignup(role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="animate-slide-up w-full max-w-lg">
        <button onClick={onBack} className="btn-ghost mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>
        <div className="card overflow-hidden">
          <div className="bg-navy-800 px-6 py-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap className="h-6 w-6 text-yellow-pastel" />
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-navy-200">Join ClassPulse in under a minute.</p>
          </div>
          <form onSubmit={submit} className="space-y-5 p-6">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" className="input pl-9" />
              </div>
            </div>
            <div>
              <label htmlFor="s-email" className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input id="s-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className="input pl-9" />
              </div>
            </div>
            <div>
              <label htmlFor="s-password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input id="s-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const active = role === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        active
                          ? 'border-navy-700 bg-navy-50 ring-2 ring-navy-200'
                          : 'border-border bg-white hover:border-navy-200'
                      }`}
                    >
                      <opt.icon className={`mx-auto h-5 w-5 ${active ? 'text-navy-800' : 'text-ink-muted'}`} />
                      <p className={`mt-1.5 text-xs font-semibold ${active ? 'text-navy-800' : 'text-ink'}`}>{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" className="btn-navy w-full py-3 text-base">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <button type="button" onClick={onLogin} className="font-semibold text-navy-700 hover:text-navy-800">
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
