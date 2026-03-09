import { Button, ButtonProps } from '@heroui/react';

interface HeroButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function HeroButton({ children, className, ...props }: HeroButtonProps) {
  return (
    <Button className={`transition-transform hover:scale-105 ${className ?? ''}`} {...props}>
      {children}
    </Button>
  );
}
