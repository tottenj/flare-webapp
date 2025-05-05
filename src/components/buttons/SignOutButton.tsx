'use client';
import { signOut } from '@/lib/firebase/auth/auth';

export default function SignOutButton() {
  return <button onClick={signOut}>Sign Out</button>;
}
