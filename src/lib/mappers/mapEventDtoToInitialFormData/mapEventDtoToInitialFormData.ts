import { EventPriceDomain } from '@/lib/domain/eventPriceDomain/EventPriceDomain';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { EventDto } from '@/lib/types/dto/EventDto';
import { EventFormInitialData } from '@/lib/types/EventForm/EventForm';
import { parseISOToZoned } from '@/lib/utils/dateTime/dateTimeHelpers';

export default function mapEventDtoToInitialFormData(
  event: EventDto,
  imageUrl?: string,
  imageMeta?: ImageMetadata,
  location?: LocationInput
): EventFormInitialData {
  const defaultStartDate = parseISOToZoned(event.startsAt, event.timezone);
  const defaultEndDate = event.endsAt ? parseISOToZoned(event.endsAt, event.timezone) : undefined;




  return {
    event: event,
    location: location,
    startDateTime: defaultStartDate,
    endDateTime: defaultEndDate,
    imageDetails:
      imageUrl || imageMeta
        ? {
            url: imageUrl,
            metaData: imageMeta,
          }
        : undefined,
  };
}
