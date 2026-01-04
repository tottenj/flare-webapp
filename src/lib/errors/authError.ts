// src/lib/errors/authErrors.ts
import { AppError } from './AppError';

export const AuthErrors = {
  Unauthorized: () => 
    new AppError({
      code: "AUTH_UNAUTHORIZED",
      clientMessage: "Sorry you are not authorized to complete this action",
      status: 401
    }),


  InvalidInput: () =>
    new AppError({
      code: 'AUTH_INVALID_INPUT',
      clientMessage: 'Invalid signup information.',
      status: 400,
    }),

  InvalidToken: () =>
    new AppError({
      code: 'AUTH_INVALID_TOKEN',
      clientMessage: 'Your session has expired. Please try again.',
      status: 401,
    }),


  InvalidSession: () => 
    new AppError({
      code: "INVALID_SESSION",
      clientMessage: "Invalid Session"
    }),

  UserAlreadyExists: () =>
    new AppError({
      code: 'AUTH_USER_EXISTS',
      clientMessage: 'A User Already Exists With These Credentials',
      status: 400,
    }),

  EmailRequired: () =>
    new AppError({
      code: 'AUTH_EMAIL_REQUIRED',
      clientMessage: 'An email address is required to continue.',
      status: 400,
    }),

  EmailUnverified: () =>
    new AppError({
      code: 'UNVERIFIED_EMAIL',
      clientMessage: 'Email Address Is Unverified, Please Check Your Email For Verification Instructions',
      status: 403,
    }),

  SignupFailed: (cause?: unknown) =>
    new AppError({
      code: 'AUTH_SIGNUP_FAILED',
      clientMessage: 'Unable to complete signup. Please try again.',
      status: 500,
      cause,
    }),

  SigninFailed: (cause?: unknown) =>
    new AppError({
      code: 'AUTH_SIGNIN_FAILED',
      clientMessage: 'Unable to complete login. Please try again.',
      status: 500,
      cause,
    }),
};
