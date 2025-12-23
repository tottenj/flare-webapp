import { AuthErrors } from '../errors/authError';
import { HTTP_METHOD } from '../types/Method';

export default class AuthGateway {
  static async verifyIdToken(idToken: string) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);


    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/verifyIdToken`, {
      signal: controller.signal,
      method: HTTP_METHOD.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (res.status === 401) throw AuthErrors.InvalidToken();
    if (!res.ok) throw AuthErrors.SignupFailed(await res.text());

    return res.json() as Promise<{
      uid: string;
      email: string;
      emailVerified: boolean;
    }>;
  }

  static async createSession(idToken: string) {
    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/createSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) throw new Error('Session creation failed');
    return res.json();
  }
}
