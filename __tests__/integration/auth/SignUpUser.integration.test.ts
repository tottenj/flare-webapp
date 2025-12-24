import AuthGateway from "@/lib/auth/authGateway";
import { AuthService } from "@/lib/services/authService/AuthService";
import {prisma} from "../../../prisma/prismaClient"
import {expect} from "@jest/globals"
import { AuthErrors } from "@/lib/errors/authError";

const mockVerify = AuthGateway.verifyIdToken as jest.Mock;

describe("AuthService.signUp (integration)", () => {
    it('creates a new pending user', async () => {
        mockVerify.mockResolvedValueOnce({
          uid: 'firebase-uid-123',
          email: 'test@example.com',
          emailVerified: false,
        });

        await AuthService.signUp({idToken: "fake-token"});

        const user = await prisma.user.findUnique({
            where: {firebaseUid: "firebase-uid-123"}
        })

        expect(user).toBeTruthy()
        expect(user?.email).toBe('test@example.com');
        expect(user?.status).toBe('PENDING');
        expect(user?.emailVerified).toBe(false);
    })


    it('throws on duplicate emails', async () => {
        mockVerify.mockResolvedValueOnce({
            uid: "uid1233",
            email: "user@gmail.com",
            emailVerified: false
        })
        await expect(AuthService.signUp({ idToken: 'fakeToken' })).rejects.toMatchObject({
          code: AuthErrors.UserAlreadyExists().code,
        });

    })
})