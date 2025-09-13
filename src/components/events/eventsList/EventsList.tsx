'use client';
import EventCard from '@/components/cards/EventCard/EventCard';
import Logo from '@/components/flare/logo/Logo';
import PrimaryLink from '@/components/Links/PrimaryLink/PrimaryLink';
import Event, { PlainEvent } from '@/lib/classes/event/Event';
import { motion, AnimatePresence } from 'motion/react';

interface eventsList {
  plainQueriedEvents?: PlainEvent[];
}
export default function EventsList({ plainQueriedEvents }: eventsList) {


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
      {plainQueriedEvents && plainQueriedEvents.length > 0 ? (
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-2"
        >
          <AnimatePresence>
            {plainQueriedEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-[95%]"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center text-[#b3b3b3]">
          <Logo size={100} />
          <p className="text-lg">No events found.</p>
          <p>
            Part of a queer organization? Become a part of the FLARE community and help fill out our
            calendar!
          </p>
          <div className="w-11/12">
            <PrimaryLink link="/flare-signup" linkText="Organization Sign Up" />
          </div>
        </div>
      )}
    </>
  );
}
