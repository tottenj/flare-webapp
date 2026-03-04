import { formatDateTime } from '@/lib/utils/ui/formatDateTime/formatDateTime';
import { expect } from '@jest/globals';

describe('formatDateTime', () => {
  it('formats ISO date correctly', () => {
    const result = formatDateTime('2026-03-10T20:30:00Z');
    expect(result.dateLabel).toMatch(/Mar/);
    expect(result.timeLabel).toMatch(/:30/);
    expect(result.timezoneLabel).toBe('Local Time');
  });

  it('formats zoned datetime correctly', () => {
    const result = formatDateTime('2026-03-10T15:30[America/Toronto]');
    expect(result.dateLabel).toMatch(/Mar/);
    expect(result.timeLabel).toMatch(/:30/);
    expect(result.timezoneLabel).toBe('America/Toronto');
  });

  it('returns expected shape', () => {
    const result = formatDateTime('2026-03-10T20:30:00Z');
    expect(result).toHaveProperty('dateLabel');
    expect(result).toHaveProperty('timeLabel');
    expect(result).toHaveProperty('timezoneLabel');
  });
});
