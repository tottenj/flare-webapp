import { AuthError } from "firebase/auth";
import logErrors from "./logErrors";

export default function getAuthError(error: unknown) {
  console.log(error)
    if ((error as AuthError).code) {
      const errorCode = (error as AuthError).code;

      switch (errorCode) {
        case 'auth/user-not-found':
          return 'No user found with this email.';
        case 'auth/wrong-password':
          return 'Incorrect password.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later.';
        case 'auth/email-already-in-use':
          return "Email is already in use";
        default:
          return `An unknown error occurred`;
      }
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
}