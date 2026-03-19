import { EventDto } from '@/lib/types/dto/EventDto';
import { EventFormInitialData } from '@/lib/types/EventForm/EventForm';
import { parseISOToZoned } from '@/lib/utils/dateTime/dateTimeHelpers';

export default function mapEventDtoToInitialFormData(event: EventDto, imageUrl?: string): EventFormInitialData {
  const defaultStartDate = parseISOToZoned(event.startsAt, event.timezone);
  const defaultEndDate = event.endsAt ? parseISOToZoned(event.endsAt, event.timezone) : undefined;
  

  return {
    eventName: event.title,
    startDateTime: defaultStartDate,
    endDateTime: defaultEndDate,
    eventDescription: event.description,
    imageDetails: {
      url: imageUrl,
      storagePath: event.imagePath ?? undefined
    }
  };
}
