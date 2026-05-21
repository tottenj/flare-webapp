import { AppError } from "@/lib/errors/AppError";

export class MoneyError extends AppError {
  constructor(message: string) {
    super({
      code: 'MONEY_ERROR',
      clientMessage: message,
    });
  }
}
