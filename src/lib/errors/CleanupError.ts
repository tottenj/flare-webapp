export class RequiresCleanupError extends Error {
  readonly firebaseUid: string;

  constructor(message: string, firebaseUid: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RequiresCleanupError';
    this.firebaseUid = firebaseUid;
  }
}
