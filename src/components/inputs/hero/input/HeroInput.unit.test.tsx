import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps } from 'react';

import HeroInput from './HeroInput';

jest.mock('@heroui/react', () => ({
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

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('data-cy', 'email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Email address');
    expect(input).toHaveAttribute('data-variant', 'secondary');
    expect(input).toHaveAttribute('data-full-width', 'true');
    expect(input).toBeRequired();
  });

  it('preserves invalid state, error text, and the fallback selector', () => {
    render(<HeroInput label="Name" isInvalid errorMessage="Name is invalid" />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('data-cy', 'input-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Name is invalid')).toBeInTheDocument();
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
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('name', 'email');
  });
});
