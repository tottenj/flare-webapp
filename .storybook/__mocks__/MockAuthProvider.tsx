// .storybook/MockAuthProvider.tsx

import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { ReactNode } from 'react';
import React from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 👇 Must match the real app context path
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function MockAuthProvider({
  children,
  mockUser = {
    uid: 'mock-user',
    email: 'mockuser@example.com',
  } as User,
  loading = false,
}: {
  children: ReactNode;
  mockUser?: User | null;
  loading?: boolean;
}) {
  return (
    <AuthContext.Provider value={{ user: mockUser, loading }}>{children}</AuthContext.Provider>
  );
}

// Optional: expose useAuth if needed in stories
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
}
