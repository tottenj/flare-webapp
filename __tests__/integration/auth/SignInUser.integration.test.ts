
import AuthGateway from "@/lib/auth/authGateway";
import { AuthErrors } from "@/lib/errors/authError";
import { AuthService } from "@/lib/services/authService/AuthService";
import {expect} from "@jest/globals"


describe('AuthService.signIn (integration)', () => {
    it('returns session token on success', async () => {
      (AuthGateway.createSession as jest.Mock).mockResolvedValue('cookie');

      const result = await AuthService.signIn({ idToken: 'token' });

      expect(result).toEqual({ sessionToken: 'cookie' });
    });

    it('propagates EmailUnverified error', async () => {
      (AuthGateway.createSession as jest.Mock).mockRejectedValue(AuthErrors.EmailUnverified());

      await expect(AuthService.signIn({ idToken: 'token' })).rejects.toMatchObject({
        code: 'UNVERIFIED_EMAIL',
      });
    });


})