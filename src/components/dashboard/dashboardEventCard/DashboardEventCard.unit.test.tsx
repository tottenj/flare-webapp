import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps } from 'react';
import DashboardEventCard, { type DashboardEvent } from './DashboardEventCard';

jest.mock('@heroui/react', () => ({
  Card: Object.assign(
    ({ variant, ...props }: ComponentProps<'div'> & { variant?: string }) => (
      <div {...props} data-variant={variant} />
    ),
    { Header: 'div', Title: 'div', Description: 'div', Content: 'div', Footer: 'div' }
  ),
}));

const event: DashboardEvent = {
  id: 'event-1',
  title: 'Community gathering',
  startDateLabel: 'June 12',
  startTimeLabel: '6 PM',
  monthLabel: 'Jun',
  dayLabel: '12',
  locationLabel: 'Portland',
  priceLabel: 'Free',
  organizerName: 'Community group',
};

describe('DashboardEventCard', () => {
  it('keeps the event details and date fallback inside a horizontal card link', () => {
    render(<DashboardEventCard event={event} />);

    const link = screen.getByRole('link', { name: /Community gathering/ });
    expect(link).toHaveAttribute('href', '/events/event-1');
    expect(link.firstElementChild).toHaveAttribute('data-variant', 'transparent');
    expect(link.firstElementChild).toHaveClass('flex-row');
    expect(link).toHaveTextContent('Jun');
    expect(link).toHaveTextContent('12');
    expect(link).toHaveTextContent('Portland');
    expect(link).toHaveTextContent('Free');
    expect(link).toHaveTextContent('Community group');
  });

  it('renders the featured event poster with its responsive sizes', () => {
    const { container } = render(
      <DashboardEventCard event={{ ...event, imageUrl: '/poster.jpg' }} featured />
    );

    expect(container.querySelector('img')).toHaveAttribute(
      'sizes',
      '(min-width: 1024px) 208px, (min-width: 768px) 160px, (min-width: 640px) 176px, 112px'
    );
    expect(screen.getByRole('heading', { name: event.title })).toHaveClass('sm:text-2xl');
  });
});
