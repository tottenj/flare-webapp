import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { EventDto } from '@/lib/types/dto/EventDto';
import { ZonedDateTime } from '@internationalized/date';

export type EventFormMode = 'create' | 'edit';

export interface EventFormInitialData {
  event: EventDto;
  location?: LocationInput;
  startDateTime: ZonedDateTime;
  endDateTime?: ZonedDateTime;
  imageDetails?: {
    url?: string;
    metaData?: ImageMetadata;
  };
}
