import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps, ReactNode } from 'react';

import HeroProgressBar from './HeroProgressBar';

jest.mock('@heroui/react', () => {
  const ProgressBar = Object.assign(
    ({
      children,
      value,
      minValue,
      maxValue,
      isIndeterminate,
      ...props
    }: {
      children: ReactNode;
      value?: number;
      minValue?: number;
      maxValue?: number;
      isIndeterminate?: boolean;
      'aria-label'?: string;
    }) => (
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        {...props}
      >
        {children}
      </div>
    ),
    {
      Output: () => <span data-testid="output" />,
      Track: (props: ComponentProps<'div'>) => <div {...props} />,
      Fill: () => <div data-testid="fill" />,
    }
  );

  return {
    Label: (props: ComponentProps<'span'>) => <span {...props} />,
    ProgressBar,
  };
});

describe('HeroProgressBar', () => {
  it('renders a label, output, track, and fill', () => {
    render(<HeroProgressBar aria-label="Uploading" label="Uploading" value={25} showValue />);

    const progress = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(progress).toHaveAttribute('aria-valuenow', '25');
    expect(progress).toHaveTextContent('Uploading');
    expect(screen.getByTestId('output')).toBeInTheDocument();
    expect(screen.getByTestId('fill')).toBeInTheDocument();
  });

  it('supports indeterminate progress and an accessible name', () => {
    render(<HeroProgressBar aria-label="Loading" isIndeterminate showValue />);

    const progress = screen.getByRole('progressbar', { name: 'Loading' });
    expect(progress).not.toHaveAttribute('aria-valuenow');
    expect(screen.queryByTestId('output')).not.toBeInTheDocument();
  });

  it('supports custom compound children and value ranges', () => {
    render(
      <HeroProgressBar aria-label="Steps" minValue={1} maxValue={5} value={3}>
        <HeroProgressBar.Track data-testid="track">
          <HeroProgressBar.Fill />
        </HeroProgressBar.Track>
      </HeroProgressBar>
    );

    const progress = screen.getByRole('progressbar', { name: 'Steps' });
    expect(progress).toHaveAttribute('aria-valuemin', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '5');
    expect(progress).toHaveAttribute('aria-valuenow', '3');
    expect(screen.getByTestId('track')).toBeInTheDocument();
  });
});
