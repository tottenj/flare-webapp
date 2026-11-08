import type { ComponentProps } from 'react';

type FlareLogoProps = Omit<ComponentProps<'div'>, 'children'> & {
  size?: number;
  showWordmark?: boolean;
  showTagline?: boolean;
};

export default function FlareLogo({
  size = 40,
  showWordmark = true,
  showTagline = false,
  className = '',
  ...props
}: FlareLogoProps) {
  const displayText = showWordmark || showTagline;

  return (
    <div
      {...props}
      className={`inline-flex items-center gap-2.5 ${className}`}
      role="img"
      aria-label="Flare — Ignite Community"
    >
      {/* SVG spark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-accent shrink-0 transition-colors duration-300 motion-reduce:transition-none"
      >
        <circle cx="64" cy="64" r="15.12" fill="currentColor" />

        <g fill="none" stroke="currentColor" strokeWidth="7.14" strokeLinecap="round">
          <path d="M87.520 64 L107.680 64" />
          <path d="M80.631 80.631 L94.886 94.886" />
          <path d="M64 87.520 L64 107.680" />
          <path d="M47.369 80.631 L33.114 94.886" />
          <path d="M40.480 64 L20.320 64" />
          <path d="M47.369 47.369 L33.114 33.114" />
          <path d="M64 40.480 L64 20.320" />
          <path d="M80.631 47.369 L94.886 33.114" />
        </g>
      </svg>

      {/* Wordmark and tagline */}
      {displayText && (
        <div className="flex flex-col justify-center">
          {showWordmark && (
            <span
              aria-hidden="true"
              className="font-heading text-foreground text-3xl leading-none font-bold tracking-tight transition-colors duration-300 motion-reduce:transition-none"
            >
              flare
            </span>
          )}

          {showTagline && (
            <span
              aria-hidden="true"
              className="text-muted mt-1 text-[10px] font-medium tracking-[0.12em] transition-colors duration-300 motion-reduce:transition-none"
            >
              Ignite Community
            </span>
          )}
        </div>
      )}
    </div>
  );
}
