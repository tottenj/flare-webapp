import AuthGateway from "@/lib/auth/authGateway";
import getAuthenticatedUser from "@/lib/auth/utils/getAuthenticatedUser"
import { cookies } from "next/headers";
import {expect} from "@jest/globals"
import { logger } from "@/lib/logger";


jest.mock('@/lib/auth/authGateway', () => ({
    __esModule:true,
    default:{
        verifySession: jest.fn()
    }
}));

describe('getAuthenticatedUser', () => {

    it('succcessfullly returns user info', async () => {
        (AuthGateway.verifySession as jest.Mock).mockResolvedValueOnce({
            uid: "uid123",
            email: "example@gmail.com",
            emailVerified: true
        });
        (cookies as jest.Mock).mockResolvedValueOnce({
          get: () => ({ value: 'session' }),
        });
        await expect(getAuthenticatedUser()).resolves.toMatchObject({
            uid: "uid123",
            email: "example@gmail.com",
            emailVerified: true
        })        
    })


    it('returns null if no session', async () => {
        (cookies as jest.Mock).mockResolvedValueOnce({
          get: jest.fn(),
        });
        await expect(getAuthenticatedUser()).resolves.toBeNull()
        expect (AuthGateway.verifySession).not.toHaveBeenCalled()
    })

    it('returns null on auth gateway throw', async () => {
         (AuthGateway.verifySession as jest.Mock).mockRejectedValueOnce(new Error("ERROR"));
         (cookies as jest.Mock).mockResolvedValueOnce({
           get: () => ({ value: 'session' }),
         });

         await expect(getAuthenticatedUser()).resolves.toBeNull();
         expect(logger.error).toHaveBeenCalled()
    })
})