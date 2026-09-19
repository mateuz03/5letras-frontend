import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getToken, setToken } from '@/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  role?: string;
  favorites: string[];
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  toggleFavorite: (motelId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api<{ _id: string; name: string; email: string; points: number; role?: string; favorites?: string[] }>('/api/users/me');
      setUser({ id: me._id, name: me.name, email: me.email, points: me.points, role: me.role, favorites: me.favorites ?? [] });
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchMe();
  }, []);

  async function login(email: string, password: string) {
    const res = await api<{ token: string }>('/api/users/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    setToken(res.token);
    await fetchMe();
  }

  async function register(name: string, email: string, password: string) {
    await api('/api/users/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    });
    await login(email, password);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function refresh() {
    await fetchMe();
  }

  async function toggleFavorite(motelId: string) {
    const res = await api<{ favorited: boolean; favorites: string[] }>(`/api/users/favorites/${motelId}`, {
      method: 'POST',
    });
    setUser((prev) => (prev ? { ...prev, favorites: res.favorites } : prev));
    return res.favorited;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
