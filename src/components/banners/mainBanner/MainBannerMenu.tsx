'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';

export default function MainBannerMenu({
  children,
  isSignedIn,
}: {
  children: React.ReactNode;
  isSignedIn?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = isSignedIn
    ? [
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
      ]
    : [
        { title: 'Sign In', href: '/signin' },
        { title: 'Sign Up', href: '/signup' },
      ];

  async function handleSignOut() {
    setOpen(false);

    // Clear server session so SSR auth checks stay in sync with Firebase client auth.
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Failed to clear server session', error);
    }

    try {
      await signOut(auth);
      router.push('/signin');
      router.refresh();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  }

  return (
    <div className="flex">
      {process.env.NEXT_PUBLIC_ENABLE_BETA_BANNER === 'true' && (
        <div className="mr-4 flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
          <span>Beta</span>
          <Link
            href="https://forms.gle/47WoTiZHKnywogfd8"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-yellow-700 underline-offset-2 hover:text-yellow-900"
          >
            Feedback Form
          </Link>
        </div>
      )}
      <div ref={menuRef} className="relative flex flex-col items-end">
        <motion.div
          className="z-10 cursor-pointer"
          onTap={() => setOpen((prev) => !prev)}
          whileTap={{ scale: 0.95 }}
        >
          {children}
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 z-20 w-40 flex-col rounded-md bg-white shadow-lg ring-1 ring-black/5"
            >
              <ul className="py-1 text-sm text-gray-700">
                {menuItems.map(({ title, href }) => (
                  <li key={title} className="w-full px-4 py-2 hover:bg-gray-100">
                    <Link onClick={() => setOpen(false)} href={href}>
                      {title}
                    </Link>
                  </li>
                ))}

                {isSignedIn && (
                  <li className="w-full px-4 py-2 hover:bg-gray-100">
                    <button onClick={() => void handleSignOut()}>Sign Out</button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
