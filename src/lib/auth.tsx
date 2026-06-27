import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role, User } from '../types';
import { authService } from './services';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string, role?: Role) => Promise<User>;
  signup: (name: string, email: string, role: Role, password?: string) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep logged in on refresh by checking current session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string, role?: Role) => {
    setLoading(true);
    try {
      const u = await authService.login(email, password, role);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, role: Role, password?: string) => {
    setLoading(true);
    try {
      const u = await authService.signup(name, email, role, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
