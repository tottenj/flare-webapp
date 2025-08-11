'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PrimaryLinkProps {
  link: string;
  linkText: string;
  center?: boolean;
}

export default function GradientLink({ link, linkText }: PrimaryLinkProps) {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 1.03 },
  };

  const gradientVariants = {
    initial: { scaleX: 0 },
    hover: { scaleX: 1 },
  };

  return (
    <Link className="block w-full text-center" href={link}>
      <motion.a
        className="font-nunito bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 relative block w-full cursor-pointer overflow-hidden rounded-full px-6 py-2 font-bold text-white"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        {linkText}
      </motion.a>
    </Link>
  );
}
