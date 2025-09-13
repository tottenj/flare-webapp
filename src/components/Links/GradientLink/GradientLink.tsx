'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PrimaryLinkProps {
  link: string;
  linkText: string;
  center?: boolean;
}

const MotionLink = motion.create(Link);

export default function GradientLink({ link, linkText }: PrimaryLinkProps) {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 1.03 },
  };

  return (
    <MotionLink
      href={link}
      className="font-nunito relative block w-full cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 px-6 py-2 text-center font-bold text-white"
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {linkText}
    </MotionLink>
  );
}
