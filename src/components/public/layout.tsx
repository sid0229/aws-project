import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '../shared/Logo';
import ThemeToggle from '../shared/ThemeToggle';

export { Logo }; // Re-export the new shared Logo component for back compatibility if needed

export function PublicNavbar({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo variant="full" size="sm" />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-ink-muted transition hover:text-navy-800 dark:text-slate-400 dark:hover:text-white">
            Features
          </a>
          <a href="#stats" className="text-sm font-medium text-ink-muted transition hover:text-navy-800 dark:text-slate-400 dark:hover:text-white">
            Stats
          </a>
          <a href="#about" className="text-sm font-medium text-ink-muted transition hover:text-navy-800 dark:text-slate-400 dark:hover:text-white">
            About
          </a>
          <a href="#contact" className="text-sm font-medium text-ink-muted transition hover:text-navy-800 dark:text-slate-400 dark:hover:text-white">
            Contact
          </a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button onClick={onLogin} className="btn-ghost">
            Login
          </button>
          <button onClick={onGetStarted} className="btn-navy">
            Get Started
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-navy-800 dark:text-slate-100"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="animate-fade-in-fast border-t border-border bg-white dark:bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <a href="#features" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50 dark:text-slate-400 dark:hover:bg-slate-900">
              Features
            </a>
            <a href="#stats" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50 dark:text-slate-400 dark:hover:bg-slate-900">
              Stats
            </a>
            <a href="#about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50 dark:text-slate-400 dark:hover:bg-slate-900">
              About
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50 dark:text-slate-400 dark:hover:bg-slate-900">
              Contact
            </a>
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border dark:border-slate-800">
              <button onClick={onLogin} className="btn-outline w-full">Login</button>
              <button onClick={onGetStarted} className="btn-navy w-full">Get Started</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  return (
    <footer id="contact" className="bg-navy-800 dark:bg-slate-950 text-white border-t border-border dark:border-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo variant="compact" size="sm" />
              <span className="font-display text-xl font-bold">ClassPulse</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-navy-200 dark:text-slate-400">
              The modern attendance & academic management platform built for universities, colleges, and forward-thinking institutions.
            </p>
            <div className="flex gap-3">
              <button onClick={onGetStarted} className="btn-yellow">Get Started</button>
              <button onClick={onLogin} className="btn border border-white/20 dark:border-slate-800 text-white hover:bg-white/10 px-4 py-2.5 text-sm rounded-xl">
                Login
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200 dark:text-slate-400">
              <li><a href="#features" className="hover:text-yellow-pastel transition">Features</a></li>
              <li><a href="#stats" className="hover:text-yellow-pastel transition">Statistics</a></li>
              <li><button onClick={onGetStarted} className="hover:text-yellow-pastel transition">Pricing</button></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200 dark:text-slate-400">
              <li><a href="#about" className="hover:text-yellow-pastel transition">About</a></li>
              <li><a href="#contact" className="hover:text-yellow-pastel transition">Contact</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200 dark:text-slate-400">
              <li><a href="#" className="hover:text-yellow-pastel transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 dark:border-slate-900 pt-6 text-center text-sm text-navy-300 dark:text-slate-500">
          © 2026 ClassPulse. Crafted for modern education. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
