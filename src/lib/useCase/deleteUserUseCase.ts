import 'server-only';
import AuthGateway from '@/lib/auth/authGateway';
import AccountService from '@/lib/services/accountService/AccountService';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';

export default async function deleteUserUseCase({
  authenticatedUser,
  firebaseUid,
}: {
  authenticatedUser: AuthenticatedUser;
  firebaseUid: string;
}) {
  await AccountService.deleteAccount({
    authenticatedUser: {
      userId: authenticatedUser.userId,
      firebaseUid: authenticatedUser.firebaseUid,
    },
    idTokenUID: firebaseUid,
  });
  await AuthGateway.deleteUser(firebaseUid);
}
