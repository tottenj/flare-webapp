import { logger } from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import * as cookie from 'cookie';

initializeApp();
const auth = getAuth();
const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });
console.log('🔥 Loaded addOrgClaim at', new Date().toISOString());

exports.signToken = onRequest(async (req: any, res: any) => {
  const token = req.body?.idToken;
  if (!token) return res.status(400).json({ error: 'Missing ID token.' });

  try {
    await auth.verifyIdToken(token);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });
    return res.status(200).json({ sessionCookie, expiresIn });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to create session cookie.' });
  }
});

const corsHandler = cors({ origin: true, credentials: false }); // Allow all origins or specify your domain

export const addOrgClaim = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    console.log({
      headers: req.headers,
      body: req.body,
    });
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing Authorization header' });

      const apiKey = authHeader.split('Bearer ')[1];
      if (apiKey !== process.env.INTERNAL_API_KEY)
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });

      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: 'Missing idToken in request body' });

      const decoded = await auth.verifyIdToken(idToken, true);
      await auth.setCustomUserClaims(decoded.uid, { org: true });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired ID token.' });
    }
  });
});

export const verifySessionCookie = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // 1️⃣ Check method
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
      }

      const apiKey = authHeader.split(' ')[1];
      if (apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ error: 'Unauthorized: invalid API key' });
      }

      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
      console.log(cookies);
      const sessionCookie = cookies.__session;

      if (!sessionCookie) {
        return res.status(400).json({ error: 'Missing session cookie' });
      }

      // 4️⃣ Verify the cookie
      const decoded = await auth.verifySessionCookie(sessionCookie, true);

      return res.status(200).json({
        uid: decoded.uid,
        claims: {
          admin: decoded.admin ?? null,
          org: decoded.org ?? null,
          verified: decoded.verified ?? null,
          emailVerified: decoded.email_verified ?? false,
        },
      });
    } catch (error) {
      console.error('Verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired session cookie.' });
    }
  });
});

exports.verify = onCall(async (request: CallableRequest) => {
  if (!request.auth || request.auth.token.admin !== true || !request.data || !request.data.orgId)
    return { message: 'error' };
  const orgId = request.data.orgId;
  const writer = firestore.batch();

  try {
    const usr = await auth.getUser(orgId);
    const claims = usr.customClaims || {};
    await auth.setCustomUserClaims(orgId, { ...claims, verified: true });
    const orgDoc = await firestore.collection('Organizations').doc(orgId).get();
    writer.update(orgDoc.ref, { verified: true });
    const events = await firestore.collection('Events').where('flareId', '==', orgId).get();
    events.docs.forEach((doc) => {
      writer.update(doc.ref, { verified: true });
    });
    await writer.commit();
    return { message: 'success' };
  } catch (error) {
    logger.log('Error');
    return { message: 'error' };
  }
});

exports.addMyself = onCall((request: any) => {
  auth.getUserByEmail('josh.totten8@gmail.com').then((val) => {
    auth.setCustomUserClaims(val.uid, { admin: true });
  });
});

export const seedAuthEmulator = onRequest(async (req:any, res:any) => {
  try {
    if (process.env.FUNCTIONS_EMULATOR !== 'true') {
      return res.status(403).send('Forbidden outside emulator');
    }

    const listUsersResult = await auth.listUsers();
    const uids = listUsersResult.users.map((u) => u.uid);
    if (uids.length) await auth.deleteUsers(uids);

    const usersToCreate = [
      { uid: 'user1', email: 'user1@test.com', password: 'password123' },
      { uid: 'org1', email: 'org1@test.com', password: 'password123' },
      {uid: 'verifiedOrg', email: "verified@test.com", password: "password123"}
    ];

    const createdUsers = await Promise.all(usersToCreate.map((u) => auth.createUser(u)));

    await auth.setCustomUserClaims('org1', {org: true, verified: false});
    await auth.setCustomUserClaims('verifiedOrg', { org: true, verified: true });
    res.json({ success: true, createdUsers });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});