import Money from '@/lib/domain/money/Money';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { expect } from '@jest/globals';

describe('Money.fromCents', () => {
  it('successfully creates from cents', () => {
    const money = Money.fromCents(250);
    expect(money.cents).toBe(250);
    expect(money.toDollars()).toBe(2.5);
    expect(money.toDollarsString()).toBe('2.50');
  });

  it('Errors if money not an integer', () => {
    // @ts-expect-error testing invalid runtime input
    expect(() => Money.fromCents('250')).toThrow(MoneyError);
    //@ts-expect-error
    expect(() => Money.fromCents('250')).toThrow('Invalid Cents Amount');
  });

  it('throws if cents < 0', () => {
    expect(() => Money.fromCents(-40)).toThrow(MoneyError);
    expect(() => Money.fromCents(-40)).toThrow('Amount cannot be negative');
  });
});

describe('Money.fromDollars', () => {
  it('successfully creates from full dollars', () => {
    const money = Money.fromDollars(2.5);
    expect(money.cents).toBe(250);
    expect(money.toDollars()).toBe(2.5);
  });

  it('it successfully creates from decimal dollars', () => {
    const money = Money.fromDollars('20.56');
    expect(money.cents).toBe(2056);
    expect(money.toDollarsString()).toBe('20.56');
  });

  it('Rounds correctly when more than 2 decimal points', () => {
    const money = Money.fromDollars(20.345);
    expect(money.cents).toBe(2035);
    expect(money.toDollars()).toBe(20.35);
  });

  it('throws if emtpy string passed', () => {
    expect(() => Money.fromDollars('')).toThrow(MoneyError);
    expect(() => Money.fromDollars('')).toThrow('Amount is required');
  });

  it('throws if string has invalid format', () => {
    expect(() => Money.fromDollars('12.999')).toThrow(MoneyError);
    expect(() => Money.fromDollars('abc')).toThrow(MoneyError);
    expect(() => Money.fromDollars('12..3')).toThrow(MoneyError);
    expect(() => Money.fromDollars('12.3.4')).toThrow(MoneyError);
  });

  it('throws if parsed number is not finite', () => {
    expect(() => Money.fromDollars(NaN)).toThrow(MoneyError);
    expect(() => Money.fromDollars(Infinity)).toThrow(MoneyError);
  });

  it('throws if amount is negative', () => {
    expect(() => Money.fromDollars(-5)).toThrow(MoneyError);
    expect(() => Money.fromDollars('-5')).toThrow(MoneyError);
    expect(() => Money.fromDollars(-5)).toThrow('Amount cannot be negative');
  });

  it('creates from integer number dollars', () => {
    const money = Money.fromDollars(20);
    expect(money.cents).toBe(2000);
  });

  it('creates from integer string dollars', () => {
    const money = Money.fromDollars('20');
    expect(money.cents).toBe(2000);
  });

  it('trims whitespace in string input', () => {
    const money = Money.fromDollars(' 20.50 ');
    expect(money.cents).toBe(2050);
  });
});

describe('Money formatting + helpers', () => {
  it('formats correctly as CAD currency', () => {
    const money = Money.fromCents(1234);

    expect(money.format()).toContain('$');
    expect(money.format()).toContain('12.34');
  });

  it('supports other locales/currencies', () => {
    const money = Money.fromCents(500);

    const formatted = money.format('en-US', 'USD');

    expect(formatted).toContain('$');
  });
});
