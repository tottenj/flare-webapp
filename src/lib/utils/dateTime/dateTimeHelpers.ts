import { parseZonedDateTime } from '@internationalized/date';

export function parseZonedToUTC(input: string): { utcDate: Date; timeZone: string } {
  const zdt = parseZonedDateTime(input);
  return {
    utcDate: zdt.toDate(),
    timeZone: zdt.timeZone,
  };
}

export function parseZonedToISO(
  input: string,
  locale: Intl.LocalesArgument = 'en-CA'
): { isoDate: string; timeString: string; timeZone: string } {
  const dt = parseZonedDateTime(input);
  const jsDate = dt.toDate();

  return {
    isoDate: jsDate.toISOString(),
    timeZone: dt.timeZone,
    timeString: jsDate.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: dt.timeZone,
    }),
  };
}