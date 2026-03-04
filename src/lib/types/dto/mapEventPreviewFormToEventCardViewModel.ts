import { EventCardViewModel } from "@/components/events/EventCard/EventCardPresentational";
import { CreateEventPreviewForm } from "@/lib/schemas/event/createEventPreviewFormSchema";
import formatAgeRange from "@/lib/utils/ui/formatAgeRange/formatAgeRange";
import { formatDateTime } from "@/lib/utils/ui/formatDateTime/formatDateTime";
import formatEventPrice from "@/lib/utils/ui/formatEventPrice/formatEventPrice";

export default function mapEventPreviewFormToEventCardViewModel(
  event: CreateEventPreviewForm,
  orgName?: string,
  imgUrl?: string | null
): EventCardViewModel{
  const startLabels = formatDateTime(event.startDateTime);
  const endLabels = event.endDateTime ? formatDateTime(event.endDateTime) : undefined;
  return {
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

    priceLabel: formatEventPrice({
      priceType: event.priceType,
      minPrice: event.minPrice,
      maxPrice: event.maxPrice,
    }),

    ageRestrictionLabel: formatAgeRange(event.ageRestriction),

    description: event.eventDescription,
  };
}
