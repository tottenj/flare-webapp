// src/lib/errors/AppError.ts
export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly clientMessage: string;

  constructor(opts: { code: string; clientMessage: string; status?: number; cause?: unknown }) {
    super(opts.code);
    this.code = opts.code;
    this.clientMessage = opts.clientMessage;
    this.status = opts.status ?? 400;

    if (opts.cause) {
      console.error('AppError cause:', opts.cause);
    }
  }
}
