'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onIdTokenChanged, getAuth } from 'firebase/auth';
import { setCookie, deleteCookie } from 'cookies-next'; // this works in the browser
import { auth } from '@/lib/firebase/auth/configs/clientApp';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        setCookie('__session', token, {
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60, // 1 hour
        });
        setUser(firebaseUser);
        if (!localStorage.getItem('reloadedAfterLogin')) {
          localStorage.setItem('reloadedAfterLogin', 'true');
          window.location.reload();
        }
      } else {
        deleteCookie('__session');
        setUser(null);
        if (localStorage.getItem('reloadedAfterLogin')) {
          window.location.reload();
        }
        localStorage.removeItem('reloadedAfterLogin'); // Reset flag on logout
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
