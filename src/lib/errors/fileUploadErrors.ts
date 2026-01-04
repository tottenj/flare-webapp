import { AppError } from '@/lib/errors/AppError';

export const FileUploadErrors = {
  InvalidMetadata: () =>
    new AppError({
      code: 'FILE_UPLOAD_INVALID_INPUT',
      clientMessage: 'Invalid Input Please Enter A Valid File',
      status: 400,
    }),
};
