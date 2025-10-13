'use client';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

interface eventsList {
  children: React.ReactNode;
}
export default function EventsList({ children }: eventsList) {
  const listContainer = {
    hidden: {},
    visible: {
      transition: {
        staggeerChildren: 0.08,
      },
    },
  };
  const listItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <>
      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-2"
      >
        <AnimatePresence>
          {Array.isArray(children)
            ? children.map((child, i) => (
                <motion.div
                  key={i}
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-[95%]"
                >
                  {child}
                </motion.div>
              ))
            : children}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
