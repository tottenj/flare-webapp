// src/lib/errors/authErrors.ts
import { AppError } from './AppError';

export const StorageErrors = {
  MissingPath: () =>
    new AppError({
      code: 'STORAGE_MISSING_PATH',
      clientMessage: "No File Exists",
      status: 400
    }),

 InvalidPath: () => 
    new AppError({
        code: "STORAGE_INVALID_PATH",
        clientMessage: "No File Exists",
        status: 400
    }),

  Timeout: () =>
    new AppError({
      code: "STORAGE_TIMEOUT",
      clientMessage: "Timed out trying to access storage",
      status: 400
    }),

  UnknownError: () => 
    new AppError({
      code: "STORAGE_UNKNOWN_ERROR",
      clientMessage: "Error fetching file please try again later",
      status: 400
    })
};