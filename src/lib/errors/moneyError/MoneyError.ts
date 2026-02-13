export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MONEY_ERROR';
  }
}
