'use client';

import GeneralLoader from '@/components/loading/GeneralLoader';

export interface primaryButtonProps {
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  styleOver?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large' | 'full';
  action?: string | ((formData: FormData) => void | Promise<void>);
  click?: () => void | Promise<void>;
}

export default function PrimaryButton({
  text = 'Submit',
  disabled = false,
  type = 'button',
  styleOver,
  size = 'full',
  action,
  click,
}: primaryButtonProps) {
  const sizeClass = {
    full: 'w-full',
    large: 'w-3/4',
    medium: 'w-1/2',
    small: 'w-1/4',
  }[size];

  return (
    <button
      onClick={click}
      formAction={action}
      style={styleOver}
      type={type}
      disabled={disabled}
      className={`${sizeClass} bg-primary hover: font-nunito mt-4 cursor-pointer rounded-2xl p-2 font-bold text-white transition duration-300 ease-in-out hover:scale-[1.015] hover:brightness-120`}
    >
      {disabled ? <GeneralLoader size="40px" /> : text}
    </button>
  );
}
