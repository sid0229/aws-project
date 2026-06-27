import { Mail, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, BookOpen, Users, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../../types';
import { useAuth } from '../../lib/auth';
import { useToast } from '../ui/toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Logo from '../shared/Logo';
import ThemeToggle from '../shared/ThemeToggle';

const ROLE_OPTIONS: { value: Role; label: string; icon: typeof User; desc: string }[] = [
  { value: 'student', label: 'Student', icon: Users, desc: 'View your academic info' },
  { value: 'teacher', label: 'Teacher', icon: BookOpen, desc: 'Manage classes & resources' },
  { value: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Oversee the institution' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function IllustrationPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-navy-800 lg:flex lg:flex-col lg:justify-between lg:p-10 dark:bg-slate-950 dark:border-r dark:border-slate-900">
      <div className="absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-pastel/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-navy-600/40 blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <Logo variant="compact" size="sm" />
          <span className="font-display text-xl font-bold text-white">ClassPulse</span>
        </div>
      </div>
      <div className="relative">
        <h2 className="font-display text-3xl font-bold leading-tight text-white">
          The pulse of your classroom, in one elegant place.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-navy-200 dark:text-slate-400">
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
      <p className="relative text-xs text-navy-300">© 2026 ClassPulse. All rights reserved.</p>
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
  const { login } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const u = await login(email, password, role);
      toast({
        type: 'success',
        title: 'Logged in successfully',
        description: `Welcome back to ClassPulse, ${u.name}.`,
      });
      onLogin(role);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Login failed',
        description: err.message || 'Check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <IllustrationPanel />
      <div className="flex flex-col bg-bg dark:bg-slate-950">
        <div className="flex items-center justify-between p-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="animate-slide-up w-full max-w-md">
            <h1 className="font-display text-3xl font-bold text-navy-800 dark:text-slate-100">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400">Sign in to access your dashboard.</p>

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
                            ? 'border-navy-700 bg-navy-50 dark:border-slate-700 dark:bg-slate-800 ring-2 ring-navy-200 dark:ring-slate-850'
                            : 'border-border bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-navy-200 dark:hover:border-slate-750'
                        }`}
                      >
                        <opt.icon className={`mx-auto h-5 w-5 ${active ? 'text-navy-800 dark:text-yellow-pastel' : 'text-ink-muted dark:text-slate-400'}`} />
                        <p className={`mt-1.5 text-xs font-semibold ${active ? 'text-navy-800 dark:text-white' : 'text-ink dark:text-slate-400'}`}>{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                icon={<Mail className="h-4 w-4" />}
                error={emailError}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
                  <button type="button" onClick={() => toast({ type: 'info', title: 'Password reset link sent', description: 'Check your email inbox.' })} className="text-xs font-medium text-navy-600 hover:text-navy-800 dark:text-indigo-400">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"><Lock className="h-4 w-4" /></span>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`input pl-9 pr-9 ${passwordError ? 'border-danger focus:ring-red-200' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-xs text-danger font-medium">{passwordError}</p>}
              </div>

              <Button type="submit" variant="navy" className="w-full py-3 text-base" loading={loading}>
                Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted dark:text-slate-400">
              Don't have an account?{' '}
              <button onClick={onSignup} className="font-semibold text-navy-700 hover:text-navy-800 dark:text-indigo-400">
                Sign up
              </button>
            </p>
            <div className="mt-4 rounded-xl bg-yellow-light dark:bg-slate-900/60 dark:border dark:border-slate-800 px-4 py-3 text-left text-xs text-navy-800 dark:text-slate-300 space-y-1">
              <span className="font-semibold block mb-0.5">Demo tip:</span>
              <p>• Student: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">aarav.sharma1@university.edu</code> (pwd: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">password123</code>)</p>
              <p>• Teacher: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">anil.sharma@university.edu</code> (pwd: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">password123</code>)</p>
              <p>• Admin: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">priya.nair@university.edu</code> (pwd: <code className="bg-white/60 dark:bg-slate-800 px-1 rounded font-mono">password123</code>)</p>
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
  const { signup } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!name.trim()) {
      setNameError('Full name is required');
      hasError = true;
    }
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const u = await signup(name, email, role, password);
      toast({
        type: 'success',
        title: 'Account created',
        description: `Welcome to ClassPulse, ${u.name}!`,
      });
      onSignup(role);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Signup failed',
        description: err.message || 'Please check the details.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg dark:bg-slate-950 px-4 py-10">
      <div className="animate-slide-up w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
          <ThemeToggle />
        </div>
        <div className="card overflow-hidden">
          <div className="bg-navy-800 dark:bg-slate-900 px-6 py-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 dark:bg-slate-800">
              <Logo variant="compact" size="sm" />
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-navy-200 dark:text-slate-400 font-medium">Join ClassPulse in under a minute.</p>
          </div>
          <form onSubmit={submit} className="space-y-5 p-6 bg-white dark:bg-slate-900">
            <Input
              label="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              icon={<User className="h-4 w-4" />}
              error={nameError}
            />

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              icon={<Mail className="h-4 w-4" />}
              error={emailError}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              icon={<Lock className="h-4 w-4" />}
              error={passwordError}
            />

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
                          ? 'border-navy-700 bg-navy-50 dark:border-slate-700 dark:bg-slate-800 ring-2 ring-navy-200 dark:ring-slate-850'
                          : 'border-border bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-navy-200 dark:hover:border-slate-750'
                      }`}
                    >
                      <opt.icon className={`mx-auto h-5 w-5 ${active ? 'text-navy-800 dark:text-yellow-pastel' : 'text-ink-muted dark:text-slate-400'}`} />
                      <p className={`mt-1.5 text-xs font-semibold ${active ? 'text-navy-800 dark:text-white' : 'text-ink dark:text-slate-400'}`}>{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <Button type="submit" variant="navy" className="w-full py-3 text-base" loading={loading}>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-sm text-ink-muted dark:text-slate-400">
              Already have an account?{' '}
              <button type="button" onClick={onLogin} className="font-semibold text-navy-700 hover:text-navy-800 dark:text-indigo-400">
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
