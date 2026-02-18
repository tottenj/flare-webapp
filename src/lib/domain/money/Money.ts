import { MoneyError } from '@/lib/errors/moneyError/MoneyError';

export default class Money {
  private constructor(public readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) throw new MoneyError('Invalid Cents Amount');
    if (cents < 0) throw new MoneyError('Amount cannot be negative');
    return new Money(cents);
  }

  static fromDollars(amount: string | number): Money {
    if (typeof amount === 'string') {
      if (amount.trim() === '') {
        throw new MoneyError('Amount is required');
      }
      if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
        throw new MoneyError('Invalid dollar format');
      }
    }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed)) {
      throw new MoneyError('Invalid dollar amount');
    }
    if (parsed < 0) {
      throw new MoneyError('Amount cannot be negative');
    }
    return new Money(Math.round(parsed * 100));
  }

  toDollars(): number {
    return this.cents / 100;
  }

  toDollarsString(): string {
    return (this.cents / 100).toFixed(2);
  }

  format(locale = 'en-CA', currency = 'CAD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(this.toDollars());
  }
}
