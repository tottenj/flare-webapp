import 'server-only';
import AuthGateway from '../../auth/authGateway';
import { userDal } from '../../dal/userDal/UserDal';
import { UserDomain } from '../../domain/UserDomain';
import { AuthErrors } from '../../errors/authError';
import { UniqueConstraintError } from '../../errors/DalErrors';
import { AuthTokenInput } from '@/lib/schemas/signUpSchema';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';

export class AuthService {
  static async signUp(input: AuthTokenInput) {
    const auth = await AuthGateway.verifyIdToken(input.idToken);
    if (!auth.email) throw AuthErrors.EmailRequired();
    const user = UserDomain.onSignUp({
      firebaseUid: auth.uid,
      email: auth.email,
      emailVerified: false,
    });
    try {
      await userDal.createIfNotExists(user.props);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw AuthErrors.UserAlreadyExists();
      }
      throw new RequiresCleanupError('User signup failed after Firebase user creation', auth.uid, {
        cause: e,
      });
    }
  }

  static async signIn(input: AuthTokenInput): Promise<{ sessionToken: string }> {
    const sessionToken = await AuthGateway.createSession(input.idToken);
    return { sessionToken };
  }
}
