import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 shadow-navy">
        <GraduationCap className="h-5 w-5 text-yellow-pastel" />
      </div>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-navy-800">
          Class<span className="text-navy-500">Pulse</span>
        </span>
      )}
    </div>
  );
}

export function PublicNavbar({ onGetStarted, onLogin }: { onGetStarted: () => void; onLogin: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-ink-muted transition hover:text-navy-800">
            Features
          </a>
          <a href="#stats" className="text-sm font-medium text-ink-muted transition hover:text-navy-800">
            Stats
          </a>
          <a href="#about" className="text-sm font-medium text-ink-muted transition hover:text-navy-800">
            About
          </a>
          <a href="#contact" className="text-sm font-medium text-ink-muted transition hover:text-navy-800">
            Contact
          </a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={onLogin} className="btn-ghost">
            Login
          </button>
          <button onClick={onGetStarted} className="btn-navy">
            Get Started
          </button>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-navy-800 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="animate-fade-in-fast border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <a href="#features" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50">
              Features
            </a>
            <a href="#stats" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50">
              Stats
            </a>
            <a href="#about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50">
              About
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-navy-50">
              Contact
            </a>
            <div className="mt-2 flex flex-col gap-2">
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
    <footer id="contact" className="bg-navy-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <GraduationCap className="h-5 w-5 text-yellow-pastel" />
              </div>
              <span className="font-display text-xl font-bold">ClassPulse</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
              The modern attendance & academic management platform built for universities, colleges, and forward-thinking institutions.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={onGetStarted} className="btn-yellow">Get Started</button>
              <button onClick={onLogin} className="btn border border-white/20 text-white hover:bg-white/10 px-4 py-2.5 text-sm">
                Login
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li><a href="#features" className="hover:text-yellow-pastel transition">Features</a></li>
              <li><a href="#stats" className="hover:text-yellow-pastel transition">Statistics</a></li>
              <li><button onClick={onGetStarted} className="hover:text-yellow-pastel transition">Pricing</button></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li><a href="#about" className="hover:text-yellow-pastel transition">About</a></li>
              <li><a href="#contact" className="hover:text-yellow-pastel transition">Contact</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li><a href="#" className="hover:text-yellow-pastel transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-pastel transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-navy-300">
          © 2024 ClassPulse. Crafted for modern education. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
