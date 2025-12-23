// src/dal/errors.ts
export class UniqueConstraintError extends Error {
  constructor(message = 'Unique constraint violation') {
    super(message);
    this.name = 'UniqueConstraintError';
  }
}
