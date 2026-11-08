import { expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps } from 'react';

import HeroForm from './HeroForm';

jest.mock('@heroui/react', () => ({
  Form: ({
    validationErrors,
    ...props
  }: ComponentProps<'form'> & { validationErrors?: object }) => (
    <form {...props} data-validation-errors={JSON.stringify(validationErrors)} />
  ),
}));

describe('HeroForm', () => {
  it('forwards form props, validation errors, children, and submission events', () => {
    const onSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());

    render(
      <HeroForm
        aria-label="Account"
        className="account-form"
        validationErrors={{ email: 'Invalid email' }}
        onSubmit={onSubmit}
      >
        <button type="submit">Submit</button>
      </HeroForm>
    );

    const form = screen.getByRole('form', { name: 'Account' });
    expect(form).toHaveClass('account-form');
    expect(form).toHaveAttribute(
      'data-validation-errors',
      JSON.stringify({ email: 'Invalid email' })
    );
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
