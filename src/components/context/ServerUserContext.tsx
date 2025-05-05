'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ServerUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other fields if needed
}

const ServerUserContext = createContext<ServerUser | null>(null);

export function ServerUserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: ServerUser | null;
}) {
  return <ServerUserContext.Provider value={user}>{children}</ServerUserContext.Provider>;
}

export function useServerUser() {
  return useContext(ServerUserContext);
}
