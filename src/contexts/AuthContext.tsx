// SYNCCRM/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Portal = 'admin' | 'partner' | 'manager' | 'rep' | null;

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'partner' | 'manager' | 'rep';
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  portal: Exclude<Portal, 'manager' | 'rep'> | null; // for routing (admin/partner)
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// -------- Demo users fallback (only used if Supabase sign-in fails) --------
const demoUsers: Record<'admin' | 'partner', User> = {
  admin: {
    id: 'demo-admin',
    email: 'admin@test.com',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['manage_integrations', 'view_analytics', 'manage_users', 'system_settings'],
    lastLogin: new Date().toISOString(),
  },
  partner: {
    id: 'demo-partner',
    email: 'partner@test.com',
    firstName: 'Demo',
    lastName: 'Partner',
    role: 'partner',
    avatar:
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['view_opportunities', 'manage_campaigns', 'view_reports'],
    lastLogin: new Date().toISOString(),
  },
};

function supabaseUserToAppUser(
  s: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>['user'],
  portal: Exclude<Portal, null> // expect admin/partner from profiles
): User {
  const meta = (s?.user_metadata ?? {}) as Record<string, any>;
  return {
    id: s.id,
    email: s.email ?? '',
    firstName: meta.first_name || meta.given_name,
    lastName: meta.last_name || meta.family_name,
    role: portal,
    avatar: meta.avatar_url,
    permissions:
      portal === 'admin'
        ? ['manage_integrations', 'view_analytics', 'manage_users', 'system_settings']
        : ['view_opportunities', 'manage_campaigns', 'view_reports'],
    lastLogin: new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [portal, setPortal] = useState<Exclude<Portal, 'manager' | 'rep'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromSession = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const s = data.session;
      if (!s?.user) {
        setUser(null);
        setPortal(null);
        return;
      }
      // fetch portal from profiles
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('portal')
        .eq('id', s.user.id)
        .single();

      if (error || !prof?.portal || !['admin', 'partner'].includes(prof.portal)) {
        setUser(null);
        setPortal(null);
        return;
      }

      const appUser = supabaseUserToAppUser(s.user, prof.portal as 'admin' | 'partner');
      setUser(appUser);
      setPortal(prof.portal as 'admin' | 'partner');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFromSession();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, _session) => {
      loadFromSession();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Preferred path: sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        await loadFromSession();
        return true;
      }

      // Fallback: allow legacy demo credentials (no Supabase)
      if (email === 'admin@test.com' && password === 'demo123') {
        setUser(demoUsers.admin);
        setPortal('admin');
        return true;
      }
      if (email === 'partner@test.com' && password === 'demo123') {
        setUser(demoUsers.partner);
        setPortal('partner');
        return true;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // sign out of Supabase (safe even if demo user)
    await supabase.auth.signOut();
    setUser(null);
    setPortal(null);
  };

  const refreshProfile = async () => {
    await loadFromSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, portal, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
