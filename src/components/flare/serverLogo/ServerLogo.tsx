import Logo from '../logo/Logo';

interface LogoWithTextProps {
  size: 'small' | 'medium' | 'large' | "xLarge";
}

export default function ServerLogo({ size }: LogoWithTextProps) {
  // Map auxSizeMain to Tailwind text size classes
  const titleSizeClass = {
    small: 'text-xl',
    medium: 'text-3xl',
    large: 'text-5xl',
    xLarge: 'text-7xl'
  }[size];

  const subtitleSizeClass = {
    small: 'text-xs',
    medium: 'text-lg',
    large: 'text-2xl',
    xLarge: 'text-4xl'
  }[size];

  const logoSize = {
    small: 45,
    medium: 80,
    large: 125,
    xLarge: 200,
  }[size];

  return (
    <div
      className="flex w-fit cursor-pointer flex-row items-center gap-2"
    >
      <Logo size={logoSize} />
      <div className="font-nunito flex flex-col leading-none font-black">
        <p className={`hidden sm:block ${titleSizeClass} mb-0`}>Flare</p>
        <p className={`hidden sm:block text-orange ${subtitleSizeClass}`}>Ignite Community</p>
      </div>
    </div>
  );
}
