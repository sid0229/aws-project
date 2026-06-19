import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role } from '../lib/types';

interface User {
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

interface AuthCtx {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const ROLE_USERS: Record<Role, User> = {
  student: {
    name: 'Aarav Sharma',
    email: 'aarav.sharma1@university.edu',
    role: 'student',
    avatarColor: 'bg-navy-700',
  },
  teacher: {
    name: 'Dr. Anil Sharma',
    email: 'anil.sharma@university.edu',
    role: 'teacher',
    avatarColor: 'bg-emerald-600',
  },
  admin: {
    name: 'Dr. Priya Nair',
    email: 'priya.nair@university.edu',
    role: 'admin',
    avatarColor: 'bg-blue-600',
  },
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => setUser(ROLE_USERS[role]);
  const logout = () => setUser(null);

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
