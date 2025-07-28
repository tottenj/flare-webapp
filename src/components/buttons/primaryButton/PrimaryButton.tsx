'use client';

import GeneralLoader from "@/components/loading/GeneralLoader";


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
      className={`${sizeClass}
      bg-primary
      
      p-2
      mt-4
      rounded-2xl
    text-white
    transition
    duration-300
    ease-in-out
    hover:brightness-120
    hover:scale-[1.015]
    hover:
    font-bold
    font-nunito
    cursor-pointer`}
    >
    
      {disabled ? <GeneralLoader size="40px"/> : text}
    </button>
  );
}
