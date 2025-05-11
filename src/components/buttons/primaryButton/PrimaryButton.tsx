'use client';

interface primaryButtonProps {
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
      className={`border-primary font-nunito hover:text-primary bg-primary mt-4 ${sizeClass} cursor-pointer rounded-xl border-2 p-2 font-bold text-white transition-all duration-300 ease-in-out hover:bg-white`}
    >
      {text}
    </button>
  );
}
