import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IconButtonProps {
  icon: IconDefinition;
  size?: number;
  variant?: 'primary' | 'secondary' | 'gradient';
}

const baseStyles =
  'flex cursor-pointer items-center justify-center rounded-full transition duration-100 ease-in-out hover:scale-110';

const variantStyles = {
  primary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',

  secondary: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',

  gradient: 'gradient text-white',
};
export default function IconButton({ icon, size = 30, variant = 'primary' }: IconButtonProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: size * 0.5 }} />
    </div>
  );
}
