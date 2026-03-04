import Money from '@/lib/domain/money/Money';
import formatEventPrice from '@/lib/utils/ui/formatEventPrice/formatEventPrice';
import { expect } from '@jest/globals';

describe('formatEventPrice', () => {
  it('Returns FREE label', () => {
    expect(formatEventPrice({ priceType: 'FREE' })).toBe('Free');
  });

  it('Returns PWYC Label', () => {
    expect(formatEventPrice({ priceType: 'PWYC' })).toBe('Pay What You Can');
  });

  it('Returns formatted min price on FIXED', () => {
    expect(formatEventPrice({ priceType: 'FIXED', minPrice: 1500 })).toBe('$15.00');
  });

  it('Retruns formatted RANGE price', () => {
    expect(formatEventPrice({ priceType: 'RANGE', minPrice: 1000, maxPrice: 2000 })).toBe(
      '$10.00 - $20.00'
    );
  });

  it('Returns TBD on default', () => {
    //@ts-expect-error
    expect(formatEventPrice({ priceType: 'Tester' })).toBe('Price TBD');
  });

  it('Returns TBD if no min price on FIXED', () => {
    expect(formatEventPrice({ priceType: 'FIXED' })).toBe('Price TBD');
  });

  it('Returns TBD if min or max price is null on RANGE', () => {
    expect(formatEventPrice({ priceType: 'RANGE', minPrice: 1000 })).toBe('Price TBD');
    expect(formatEventPrice({ priceType: 'RANGE', maxPrice: 1000 })).toBe('Price TBD');
  });

  it('Returns TBD if Money throws', () => {
    jest.spyOn(Money, 'fromCents').mockImplementation(() => {
      throw new Error('Money failure');
    });
    expect(formatEventPrice({ priceType: 'FIXED', minPrice: 1000 })).toBe('Price TBD');
  });
});
