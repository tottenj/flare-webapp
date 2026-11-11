import FeaturedEventGrid from '@/components/dashboard/featuredEventGrid/FeaturedEventGrid';
import type { DashboardEvent } from '@/components/dashboard/dashboardEventCard/DashboardEventCard';
import PageHeading from '@/components/ui/PageHeading/PageHeading';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

const events: DashboardEvent[] = [
  {
    id: 'fixture-1',
    title: 'Queer Arts Social',
    imageUrl: '/stockEvent.jpg',
    startDateLabel: 'Fri, Nov 13',
    startTimeLabel: '6 PM',
    monthLabel: 'Nov',
    dayLabel: '13',
    locationLabel: 'West Queen West',
    priceLabel: 'Free',
    organizerName: 'Community Arts Collective',
  },
  {
    id: 'fixture-2',
    title: 'An Evening of Art, Music, Conversation, and Community Across the City',
    imageUrl: '/sampleEvent2.jpg',
    startDateLabel: 'Sat, Nov 14',
    startTimeLabel: '7 PM',
    monthLabel: 'Nov',
    dayLabel: '14',
    locationLabel: 'Downtown',
    priceLabel: '$15',
  },
  {
    id: 'fixture-3',
    title: 'Sunday Social',
    startDateLabel: 'Sun, Nov 15',
    startTimeLabel: '2 PM',
    monthLabel: 'Nov',
    dayLabel: '15',
    locationLabel: 'The Junction',
    priceLabel: 'Free',
  },
  {
    id: 'fixture-4',
    title: 'Community Film Night',
    imageUrl: '/sampleEvent2.jpg',
    startDateLabel: 'Fri, Nov 20',
    startTimeLabel: '6 PM',
    monthLabel: 'Nov',
    dayLabel: '20',
    locationLabel: 'Parkdale',
    priceLabel: '$20',
    organizerName: 'Community Arts Collective',
  },
  {
    id: 'fixture-5',
    title: 'Neighborhood Meetup',
    imageUrl: '/stockEvent.jpg',
    startDateLabel: 'Sat, Nov 21',
    startTimeLabel: '4 PM',
    monthLabel: 'Nov',
    dayLabel: '21',
    locationLabel: 'Roncesvalles',
    priceLabel: 'Free',
  },
  {
    id: 'fixture-6',
    title: 'Creative Community Night',
    imageUrl: '/sampleEvent2.jpg',
    startDateLabel: 'Sun, Nov 22',
    startTimeLabel: '7 PM',
    monthLabel: 'Nov',
    dayLabel: '22',
    locationLabel: 'Downtown',
    priceLabel: '$10',
  },
];

export default async function UserDashboardShell() {
  await UserContextService.requireUser();

  return (
    <div className="flex flex-col gap-8">
      <PageHeading accentText="Your Flare" subText="Your saved plans, all in one place.">
        Good to see you.
      </PageHeading>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-heading text-3xl font-bold">Next Up</h2>
        <p className="text-accent">{events.length} saved events</p>
      </div>
      <FeaturedEventGrid events={events} />
    </div>
  );
}
