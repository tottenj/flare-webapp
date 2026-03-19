import { ZonedDateTime } from '@internationalized/date';

export type EventFormMode = 'create' | 'edit';

export interface EventFormInitialData {
  startDateTime: ZonedDateTime,
  endDateTime?: ZonedDateTime,
  eventName: string;
  eventDescription: string;
  imageDetails?: {
    url?: string;
    storagePath?: string;
  };
}
