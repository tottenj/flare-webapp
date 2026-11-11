import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import PageHeading from './PageHeading';

describe('PageHeading', () => {
  it('renders the default heading and optional supporting text', () => {
    render(
      <PageHeading accentText="Your Flare" subText="Your saved plans, all in one place.">
        Good to see you.
      </PageHeading>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Good to see you.' })).toHaveClass(
      'text-4xl',
      'sm:text-5xl'
    );
    expect(screen.getByText('Your Flare').tagName).toBe('P');
    expect(screen.getByText('Your saved plans, all in one place.').tagName).toBe('P');
  });

  it('allows the heading level and size to be set independently', () => {
    const { container } = render(
      <PageHeading headingLevel={2} headingSize="sm">
        Events
      </PageHeading>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Events' })).toHaveClass('text-xl');
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('can render an extra-small paragraph instead of a heading', () => {
    render(
      <PageHeading headingLevel="p" headingSize="xs">
        Account settings
      </PageHeading>
    );

    expect(screen.getByText('Account settings')).toHaveClass('text-lg');
    expect(screen.getByText('Account settings').tagName).toBe('P');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
