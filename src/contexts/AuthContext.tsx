import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  role: 'client' | 'affiliate' | 'admin' | null;
  dashboardPath: string;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  signOut: () => Promise<void>;
};

const REMEMBER_ME_KEY = 'auth.remember_me';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'client' | 'affiliate' | 'admin' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(REMEMBER_ME_KEY);
    return savedValue !== 'false';
  });

  const setRememberMe = (value: boolean) => {
    setRememberMeState(value);
    localStorage.setItem(REMEMBER_ME_KEY, String(value));
  };

  useEffect(() => {
    const resolveRoleForUser = async (nextSession: Session | null) => {
      if (!nextSession?.user) {
        setRole(null);
        return;
      }

      const authUserId = nextSession.user.id;
      const userEmail = nextSession.user.email ?? '';

      const { data: userById } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUserId)
        .maybeSingle();

      if (userById?.role === 'client' || userById?.role === 'affiliate' || userById?.role === 'admin') {
        setRole(userById.role);
        return;
      }

      if (userEmail) {
        const { data: userByEmail } = await supabase
          .from('users')
          .select('role')
          .eq('email', userEmail)
          .maybeSingle();

        if (userByEmail?.role === 'client' || userByEmail?.role === 'affiliate' || userByEmail?.role === 'admin') {
          setRole(userByEmail.role);
          return;
        }
      }

      setRole('client');
    };

    const bootstrapSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!rememberMe && data.session) {
        await supabase.auth.signOut();
        setSession(null);
        setRole(null);
      } else {
        const nextSession = data.session ?? null;
        setSession(nextSession);
        await resolveRoleForUser(nextSession);
      }

      setIsAuthLoading(false);
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void resolveRoleForUser(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [rememberMe]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const dashboardPath = role === 'admin' ? '/admin' : '/affiliate';

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      role,
      dashboardPath,
      isAuthenticated: Boolean(session?.user),
      isAuthLoading,
      rememberMe,
      setRememberMe,
      signOut,
    }),
    [dashboardPath, isAuthLoading, rememberMe, role, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
