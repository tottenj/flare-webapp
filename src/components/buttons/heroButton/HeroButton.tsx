import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface HeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  color?: string;
  onPress?: () => void;
}

export default function HeroButton({
  children,
  className,
  isLoading,
  isDisabled,
  color,
  onPress,
  ...props
}: HeroButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      disabled={isDisabled || isLoading || props.disabled}
      onClick={(event) => {
        props.onClick?.(event);
        onPress?.();
      }}
      className={`rounded-xl px-4 py-2 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 ${color === 'danger' ? 'text-red-700' : ''} ${className ?? ''}`}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  );
}
