'use client';

import { motion } from 'framer-motion';
import GeneralLoader from '@/components/loading/GeneralLoader';

export interface primaryButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  styleOver?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large' | 'full';
  action?: string | ((formData: FormData) => void | Promise<void>);
  click?: (e: any) => void | Promise<void>;
  form?: string;
  datacy?: string;
  state?: 'initial' | 'hover' | 'tap';
}

export default function PrimaryButton({
  text = 'Submit',
  disabled = false,
  type = 'button',
  styleOver,
  size = 'full',
  action,
  click,
  form,
  datacy,
  state
}: primaryButtonProps) {
  const sizeClass = {
    full: 'w-full',
    large: 'w-3/4',
    medium: 'w-1/2',
    small: 'w-1/4',
  }[size];



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
    <motion.button
      onClick={click}
      animate={state}
      formAction={action}
      style={styleOver}
      type={type}
      disabled={disabled}
      className={`relative overflow-hidden ${sizeClass} font-nunito bg-primary mt-4 cursor-pointer rounded-full px-6 py-3 font-bold text-white max-w-11/12`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      form={form}
      data-cy={datacy}
    >
      <motion.span
        variants={gradientVariants}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 pointer-events-none"
        style={{ transformOrigin: 'left', zIndex: 20 }}
      />
      <span className="relative z-30">{disabled ? <GeneralLoader color='white' size="30px" /> : text}</span>
    </motion.button>
  );
}
