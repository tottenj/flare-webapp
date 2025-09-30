'use client';

import { forceAuth } from '@/lib/firebase/auth/forceAuth';
import { useEffect } from 'react';

export default function ForceAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MODE === 'test') {
      (window as any).forceAuth = forceAuth;
    }
  }, []);

  return <>{children}</>;
}
