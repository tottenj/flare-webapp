'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PrimaryLinkProps {
  link: string;
  linkText: string;
  center?: boolean;
}

const MotionLink = motion.create(Link);

export default function PrimaryLink({ link, linkText, center = false }: PrimaryLinkProps) {
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
    <MotionLink
      href={link}
      className={`font-nunito bg-primary relative mt-4 inline-block w-full cursor-pointer overflow-hidden rounded-full px-6 py-3 font-bold text-white ${
        center ? 'text-center' : ''
      }`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span
        variants={gradientVariants}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-pink-500 via-red-500 to-orange-500"
        style={{ transformOrigin: 'left', zIndex: 20 }}
      />
      <span className="relative z-30">{linkText}</span>
    </MotionLink>
  );
}
