import 'server-only';
import { AuthErrors } from '../errors/authError';
import { HTTP_METHOD } from '../types/Method';

export default class AuthGateway {
  static async verifyIdToken(idToken: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/verifyIdToken`, {
      signal: controller.signal,
      method: HTTP_METHOD.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    clearTimeout(timeout);

    if (res.status === 401) throw AuthErrors.InvalidToken();
    if (!res.ok) throw AuthErrors.SignupFailed(await res.text());

    return res.json() as Promise<{
      uid: string;
      email: string;
      emailVerified: boolean;
    }>;
  }

  static async verifySession(sessionCookie: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/verifySession`, {
      signal: controller.signal,
      method: HTTP_METHOD.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionCookie }),
    });

    clearTimeout(timeout);

    if (res.status === 401) throw AuthErrors.InvalidSession();
    if (!res.ok) throw AuthErrors.SigninFailed();

    return res.json() as Promise<{
      uid: string;
      email: string;
      emailVerified: boolean;
      role?: string;
    }>;
  }

  static async createSession(idToken: string): Promise<{sessionCookie: string, uid: string}> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/createSession`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    clearTimeout(timeout);

    if (res.status === 401) throw AuthErrors.InvalidToken();
    if (res.status === 403) throw AuthErrors.EmailUnverified();
    if (!res.ok) throw AuthErrors.SigninFailed();

    const { sessionCookie, uid } = await res.json();
    if (!sessionCookie || !uid) throw AuthErrors.SigninFailed();

    return {sessionCookie, uid};
  }

  static async deleteUser(uid: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/deleteUser`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Failed to delete Firebase user: ${res.status}`);
    }
  }
}
