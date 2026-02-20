import { parseZonedDateTime } from '@internationalized/date';

export type EventDateTimeLabels = {
  dateLabel: string;
  timeLabel: string;
  timezoneLabel: string;
};

export function formatDateTime(input: string): EventDateTimeLabels {
  if (input.includes('[')) {
    const zoned = parseZonedDateTime(input);

    return {
      dateLabel: zoned.toDate().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      timeLabel: zoned.toDate().toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }),
      timezoneLabel: zoned.timeZone,
    };
  }

  // ISO string case: "2026-02-09T21:37:..."
  const date = new Date(input);

  return {
    dateLabel: date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    timeLabel: date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
    timezoneLabel: 'Local Time',
  };
}
