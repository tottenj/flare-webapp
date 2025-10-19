'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onIdTokenChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { auth} from '@/lib/firebase/auth/configs/clientApp';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    sessionStorage.removeItem('manualLoginInProgress');
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      const isManualLogin = sessionStorage.getItem('manualLoginInProgress');
      if (isManualLogin) return;

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);

        if (firebaseUser.emailVerified == false) {
          toast.error(`Please Verify Email Verification email sent to: ${firebaseUser.email}`);
          await sendEmailVerification(firebaseUser);
          await signOut(auth);
          return;
        }

        await fetch('/api/loginToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: token,
          }),
        });

        setUser(firebaseUser);
      } else {
        await fetch('/api/loginToken', { method: 'DELETE' });
        setUser(null);
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
