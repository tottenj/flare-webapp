import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EventCategory } from '@/lib/types/EventCategory';
import { PriceTypeValue } from '@/lib/types/PriceType';

export type EventFormMode = 'create' | 'edit';

export interface EventFormInitialData {
  eventName: string;
  eventDescription: string;
  category: EventCategory;
  location: LocationInput | null;
  tags: string[];
  startDateTime: string;
  endDateTime?: string | null;
  ageRestriction: AgeRangeValue;
  priceType: PriceTypeValue;
  minPrice?: number | null;
  maxPrice?: number | null;
}
