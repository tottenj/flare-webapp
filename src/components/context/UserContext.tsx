"use client";
import useUserSession from "@/lib/hooks/useUser";
import React, { ReactNode } from "react";

interface userContextProps {
  initialUser: any;
  children: ReactNode;
}

export default function UserContext({ children, initialUser }: userContextProps) {
  const user = useUserSession(initialUser);

  return <>{children}</>;
}
