import Money from '@/lib/domain/money/Money';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { PriceTypeValue } from '@/lib/types/PriceType';

export class EventPriceDomain {
  private constructor(
    public readonly type: PriceTypeValue,
    public readonly min: Money | null,
    public readonly max: Money | null
  ) {}

  static fromInput(
    type: PriceTypeValue,
    minRaw?: number | string | null,
    maxRaw?: number | string | null
  ) {
    if (type === 'FREE' || type === 'PWYC') {
      return new EventPriceDomain(type, null, null);
    }
    if (type === 'FIXED') {
      if (!minRaw) throw EventErrors.MinPriceRequired();
      return new EventPriceDomain(type, Money.fromDollars(minRaw), null);
    }
    if (type === 'RANGE') {
      if (!minRaw || minRaw === '') throw EventErrors.MinPriceRequired();
      if (!maxRaw || maxRaw === '') throw EventErrors.MaxPriceRequired();
      const min = Money.fromDollars(minRaw);
      const max = Money.fromDollars(maxRaw);
      if (min.cents <= max.cents) throw EventErrors.InvalidPriceRange();
      return new EventPriceDomain(type, min, max);
    }
    return new EventPriceDomain(type, null, null);
  }
}
