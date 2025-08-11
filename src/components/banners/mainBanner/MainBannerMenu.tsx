'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import useUnifiedUser from '@/lib/hooks/useUnifiedUser';

export default function MainBannerMenu({ children }: { children: React.ReactNode, isSignedIn?:boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {user} = useUnifiedUser()

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

  let menuItems = [{title: "Sign Up", href:"/signup"}, {title: "Sign In", href:"/signin"}]
  if(user) menuItems = [{ title: 'View Profile', href: '/dashboard' }];





  return (
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
                  <Link href={href}>{title}</Link>
                </li>
              ))}
              {user && (
              <li className="w-full px-4 py-2 hover:bg-gray-100">
                <form action={signOutUser}>
                  <button type="submit">Sign Out</button>
                </form>
              </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
