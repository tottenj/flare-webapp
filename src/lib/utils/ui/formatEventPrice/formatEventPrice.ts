import Money from '@/lib/domain/money/Money';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { logger } from '@/lib/logger';
import { PRICE_TYPE_LABEL, PriceTypeValue } from '@/lib/types/PriceType';

interface PriceFields {
  priceType: PriceTypeValue;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export default function formatEventPrice(priceFields: PriceFields): string {
  const { priceType, minPrice, maxPrice } = priceFields;

  try {
    switch (priceType) {
      case 'FREE':
        return PRICE_TYPE_LABEL['FREE'];

      case 'PWYC':
        return PRICE_TYPE_LABEL['PWYC'];

      case 'FIXED':
        if (minPrice == null) return 'Price TBD';
        return Money.fromCents(minPrice).format();

      case 'RANGE':
        if (minPrice == null || !maxPrice) return 'Price TBD';
        const min =  Money.fromCents(minPrice);
        const max =  Money.fromCents(maxPrice);
        return `${min.format()} - ${max.format()}`;

      default:
        return 'Price TBD';
    }
  } catch (error) {
    if (error instanceof MoneyError) {
      logger.warn(error.message);
      return 'Price TBD';
    } else {
      logger.warn('Unkown format event price error');
      return 'Price TBD';
    }
  }
}
