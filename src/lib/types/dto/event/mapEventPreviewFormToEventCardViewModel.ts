import { EventCardViewModel } from '@/components/events/EventCard/presentational/EventCardPresentational';
import { CreateEventPreviewForm } from '@/lib/schemas/event/createEventPreviewFormSchema';
import formatAgeRange from '@/lib/utils/ui/formatAgeRange/formatAgeRange';
import { formatDateTime } from '@/lib/utils/ui/formatDateTime/formatDateTime';

export default function mapEventPreviewFormToEventCardViewModel(
  event: CreateEventPreviewForm,
  orgName?: string,
  imgUrl?: string | null
): EventCardViewModel {
  const startLabels = formatDateTime(event.startDateTime);
  const endLabels = event.endDateTime ? formatDateTime(event.endDateTime) : undefined;
  return {
    id: 'preview-event',
    title: event.eventName,
    organizerName: orgName ?? 'Your Organization',
    imageUrl: imgUrl ?? null,
    tags: event.tags,

    startDateLabel: startLabels.dateLabel,
    startTimeLabel: startLabels.timeLabel,
    timezoneLabel: startLabels.timezoneLabel,

    endDateLabel: endLabels?.dateLabel,
    endTimeLabel: endLabels?.timeLabel,

    locationLabel: event.location?.address ?? null,

    priceLabel: `${event.minPrice}.00 ${event.maxPrice ? `- ${event.maxPrice}.00` : ''}`,

    ageRestrictionLabel: formatAgeRange(event.ageRestriction),

    description: event.eventDescription,
    canSave: false,
    isSaved: false,
  };
}
