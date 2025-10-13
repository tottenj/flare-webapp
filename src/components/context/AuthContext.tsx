'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onIdTokenChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/auth/configs/clientApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Collections from '@/lib/enums/collections';
import FlareUserStart from '@/lib/types/FlareUserStart';
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
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);

        if (firebaseUser.emailVerified == false) {
          toast.error('Please Verify Email');
          toast.error(`Verification email sent to: ${firebaseUser.email}`);
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

        if (firebaseUser.providerData.some((provider) => provider.providerId === 'google.com')) {
          const docRef = doc(db, Collections.Users, firebaseUser.uid);
          const secondDocRef = doc(db, Collections.Organizations, firebaseUser.uid);
          const user = await getDoc(docRef);
          const userTwo = await getDoc(secondDocRef);
          if (!user.exists() && !userTwo.exists()) {
            const test: FlareUserStart = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              profilePic: firebaseUser.photoURL,
              name: firebaseUser.displayName,
            };
            await setDoc(docRef, test);
          }
        }

        if (!localStorage.getItem('reloadedAfterLogin')) {
          localStorage.setItem('reloadedAfterLogin', 'true');
          window.location.reload();
        }
      } else {
        await fetch('/api/loginToken', {method: "DELETE"})
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
