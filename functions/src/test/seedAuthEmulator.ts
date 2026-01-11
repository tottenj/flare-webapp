import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';
import { CreateRequest } from 'firebase-admin/auth';

export const seedAuthEmulator = onRequest(async (req: any, res: any) => {
  try {
    if (process.env.FUNCTIONS_EMULATOR !== 'true') {
      return res.status(403).send('Forbidden outside emulator');
    }

    const listUsersResult = await auth.listUsers();
    const uids = listUsersResult.users.map((u) => u.uid);
    if (uids.length) await auth.deleteUsers(uids);

    const usersToCreate: CreateRequest[] = [
      { uid: 'uid1', email: 'user@gmail.com', password: 'password123', emailVerified: true },
      {
        uid: 'uid1.5',
        email: 'userEmailVerified2@gmail.com',
        password: 'password123',
        emailVerified: true,
      },
      {
        uid: 'uid2',
        email: 'unverifiedUser@gmail.com',
        password: 'password123',
        emailVerified: false,
      },
      {
        uid: 'uid3',
        email: 'unverifiedOrg@gmail.com',
        password: 'password123',
        emailVerified: true,
      },
      { uid: 'uid4', email: 'verifiedOrg@gmail.com', password: 'password123', emailVerified: true },
    ];

    const createdUsers = await Promise.all(usersToCreate.map((u) => auth.createUser(u)));

    res.json({
      success: true,
      users: createdUsers.map((u) => ({
        uid: u.uid,
        email: u.email,
        emailVerified: u.emailVerified,
      })),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
