// src/lib/errors/clientErrors.ts
import { ClientError } from './ClientError';

export const ClientErrors = {
  SessionExpired: () =>
    new ClientError('AUTH_INVALID_SESSION', 'Your session has expired. Please sign in again.'),

  UploadFailed: () =>
    new ClientError('FILE_UPLOAD_FAILED', 'Unable to upload file. Please try again.'),

  ServerRejected: (message: string, code = 'SERVER_REJECTED') => new ClientError(code, message),

  Network: () => new ClientError('NETWORK_ERROR', 'Network error. Please check your connection.'),
};
