import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EventCategory } from '@/lib/types/EventCategory';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { ZonedDateTime } from '@internationalized/date';

export type EventFormMode = 'create' | 'edit';

export interface EventFormInitialData {
  eventName: string;
  eventDescription: string;
  category: EventCategory;
  ageRestriction: AgeRangeValue;
  priceType: PriceTypeValue;
  location?: LocationInput;
  startDateTime: ZonedDateTime;
  endDateTime?: ZonedDateTime;
  minPrice?: number;
  maxPrice?: number;
  tags: string[];
  imageDetails?: {
    url?: string;
    metaData?: ImageMetadata;
  };
  ticketLink?: string;
}
