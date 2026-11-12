import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps } from 'react';

import HeroInput from './HeroInput';

jest.mock('@heroui/react', () => ({
  TextField: ({
    children,
    name,
    type,
    isRequired,
    isInvalid,
  }: {
    children: React.ReactNode;
    name?: string;
    type?: string;
    isRequired?: boolean;
    isInvalid?: boolean;
  }) => (
    <div
      data-testid="text-field"
      data-name={name}
      data-type={type}
      data-required={isRequired}
      data-invalid={isInvalid}
    >
      {children}
    </div>
  ),
  Input: ({
    variant,
    fullWidth,
    ...props
  }: ComponentProps<'input'> & { variant?: string; fullWidth?: boolean }) => (
    <input {...props} data-variant={variant} data-full-width={fullWidth} />
  ),
  Label: ({ isRequired, ...props }: ComponentProps<'label'> & { isRequired?: boolean }) => (
    <label {...props} data-required={isRequired} />
  ),
  Description: ({ children, ...props }: ComponentProps<'p'>) => <p {...props}>{children}</p>,
  FieldError: ({ children, ...props }: ComponentProps<'p'>) => <p {...props}>{children}</p>,
}));

describe('HeroInput', () => {
  it('forwards HeroUI and native input props and derives the selector from the name', () => {
    render(
      <HeroInput
        label="Email"
        name="email"
        type="email"
        placeholder="Email address"
        variant="secondary"
        isRequired
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-cy', 'email-input');
    expect(input).toHaveAttribute('placeholder', 'Email address');
    expect(input).toHaveAttribute('data-variant', 'secondary');
    expect(input).toHaveAttribute('data-full-width', 'true');
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-name', 'email');
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-type', 'email');
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-required', 'true');
  });

  it('preserves invalid state, error text, and the fallback selector', () => {
    render(<HeroInput label="Name" isInvalid errorMessage="Name is invalid" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-cy', 'input-input');
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByText('Name is invalid')).toBeInTheDocument();
  });

  it('renders a muted description below the input', () => {
    render(<HeroInput label="Organization Name" description="Use the name people know you by." />);

    const description = screen.getByText('Use the name people know you by.');
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('text-sm', 'text-muted');
  });

  it('forwards label props to the HeroUI label', () => {
    render(
      <HeroInput
        name="email"
        label="Email"
        labelProps={{ className: 'custom-label', title: 'Email label', isRequired: true }}
      />
    );

    const label = screen.getByTitle('Email label');
    expect(label).toHaveClass('custom-label');
    expect(label).toHaveAttribute('data-required', 'true');
    expect(screen.getByTestId('text-field')).toHaveAttribute('data-name', 'email');
  });
});
