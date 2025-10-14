import { User } from "firebase/auth";

export function isUser(obj: any): obj is User {
  return typeof obj === 'object' && obj !== null && 'uid' in obj && 'email' in obj;
}