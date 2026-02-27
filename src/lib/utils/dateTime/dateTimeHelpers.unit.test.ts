import { parseZonedToISO, parseZonedToUTC } from '@/lib/utils/dateTime/dateTimeHelpers';
import {expect} from "@jest/globals"

describe('parseZonedToUTC', () => {
  it('correctly converts America/Toronto time to UTC', () => {
    const input = '2026-02-26T18:00[America/Toronto]';
    const result = parseZonedToUTC(input);
    const expected = new Date('2026-02-26T23:00:00.000Z');
    expect(result.utcDate).toEqual(expected);
  });

  it('handles DST boundary transition correctly', () => {
    const before = parseZonedToUTC('2026-03-08T01:00[America/Toronto]');
    const after = parseZonedToUTC('2026-03-08T03:00[America/Toronto]');

    expect(before.utcDate.toISOString()).toBe('2026-03-08T06:00:00.000Z'); // UTC-5
    expect(after.utcDate.toISOString()).toBe('2026-03-08T07:00:00.000Z'); // UTC-4
  });
});


describe('parseZonedToISO', () => {
  it('returns correct ISO string and formatted time', () => {
    const input = '2026-02-26T18:00[America/Toronto]';

    const result = parseZonedToISO(input, );

    expect(result.isoDate).toBe('2026-02-26T23:00:00.000Z');
    expect(result.timeZone).toBe('America/Toronto');
    expect(result.timeString).toBe('06:00 p.m.');
  });
});