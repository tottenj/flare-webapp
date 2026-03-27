import Money from '@/lib/domain/money/Money';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { EventFormInitialData } from '@/lib/types/EventForm/EventForm';
import { parseISOToZoned } from '@/lib/utils/dateTime/dateTimeHelpers';

export default function mapEditEventDataToInitialFormData(
  editData: EditEventData
): EventFormInitialData {
  const { event, imageUrl, imageMetadata, location } = editData;
  const defaultStartDate = parseISOToZoned(event.startsAt, event.timezone);
  const defaultEndDate = event.endsAt ? parseISOToZoned(event.endsAt, event.timezone) : undefined;

  const minPrice =
    event.pricing.minCents === null
      ? undefined
      : Money.fromCents(event.pricing.minCents).toDollars();
  const maxPrice =
    event.pricing.maxCents === null
      ? undefined
      : Money.fromCents(event.pricing.maxCents).toDollars();

  return {
    eventName: event.title,
    eventDescription: event.description,
    category: event.category,
    ageRestriction: event.ageRestriction,
    priceType: event.pricing.type,
    location,
    startDateTime: defaultStartDate,
    endDateTime: defaultEndDate,
    minPrice,
    maxPrice,
    imageDetails:
      imageUrl || imageMetadata
        ? {
            url: imageUrl,
            metaData: imageMetadata,
          }
        : undefined,
  };
}
