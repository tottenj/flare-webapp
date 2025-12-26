import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';

export const seedAuthEmulator = onRequest(async (req: any, res: any) => {
  try {
    if (process.env.FUNCTIONS_EMULATOR !== 'true') {
      return res.status(403).send('Forbidden outside emulator');
    }

    const listUsersResult = await auth.listUsers();
    const uids = listUsersResult.users.map((u) => u.uid);
    if (uids.length) await auth.deleteUsers(uids);

    const usersToCreate = [
      { uid: 'user1', email: 'user@gmail.com', password: 'password123', emailVerified:true },
      { uid: 'org1', email: 'unverifiedOrg@gmail.com', password: 'password123' },
      { uid: 'org2', email: 'verifiedOrg@gmail.com', password: 'password123' },
    ];

    const createdUsers = await Promise.all(usersToCreate.map((u) => auth.createUser(u)));

    await auth.setCustomUserClaims('org1', { org: true, verified: false });
    await auth.setCustomUserClaims('org2', { org: true, verified: true });
    res.json({ success: true, createdUsers });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
