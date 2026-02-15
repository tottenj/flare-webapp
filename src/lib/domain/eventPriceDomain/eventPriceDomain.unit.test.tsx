import { EventPriceDomain } from '@/lib/domain/eventPriceDomain/EventPriceDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { expect } from '@jest/globals';

describe('EveentPriceDomain.fromInput', () => {
  it('creates free price correctly', () => {
    const price = EventPriceDomain.fromInput('FREE');
    expect(price.type).toBe('FREE');
    expect(price.min).toBeNull();
    expect(price.max).toBeNull();
  });

  it('creates Pay what you can correctly', () => {
    const price = EventPriceDomain.fromInput('PWYC');
    expect(price.type).toBe('PWYC');
    expect(price.min).toBeNull();
    expect(price.max).toBeNull();
  });

  it('creates fixed price correctly', () => {
    const price = EventPriceDomain.fromInput('FIXED', 10);
    expect(price.type).toBe('FIXED');
    expect(price.min?.cents).toBe(1000);
    expect(price.max).toBeNull();
  });

  it('creates range price correctly', () => {
    const price = EventPriceDomain.fromInput('RANGE', 5, 15);
    expect(price.type).toBe('RANGE');
    expect(price.min?.cents).toBe(500);
    expect(price.max?.cents).toBe(1500);
  });

  it('throws if min price is missing for FIXED', () => {
    expect(() => EventPriceDomain.fromInput('FIXED')).toThrow();
  });

  it('throws if min or max price is missing for RANGE', () => {
    expect(() => EventPriceDomain.fromInput('RANGE', 5)).toThrow(EventErrors.MaxPriceRequired());
    expect(() => EventPriceDomain.fromInput('RANGE', undefined, 15)).toThrow(
      EventErrors.MinPriceRequired()
    );
  });

  it('throws if min price is greater than max price for RANGE', () => {
    expect(() => EventPriceDomain.fromInput('RANGE', 20, 10)).toThrow(
      EventErrors.InvalidPriceRange()
    );
  });
});
