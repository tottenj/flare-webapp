import Collections from '../../enums/Collections';
import { logger } from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { GeoPoint, getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import FlareOrg, { orgConverter } from '../classes/FlareOrg';
import FlareUser, { userConverter } from '../classes/FlareUser';
import flareLocation from '../classes/flareLocation';
import Event, { eventConverter } from '../classes/Event';
import eventType from '../../enums/EventType';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import cookie from 'cookie';

initializeApp();
const auth = getAuth();
const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });

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

const corsHandler = cors({ origin: true, credentials: true }); // Allow all origins or specify your domain

export const addOrgClaim = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
      const sessionCookie = cookies.session;
      if (!sessionCookie) {
        return res.status(400).json({ error: 'Missing session cookie' });
      }
      const decoded = await auth.verifySessionCookie(sessionCookie, true);
    
      await auth.setCustomUserClaims(decoded.uid, { org: true });
      return res.status(200)
    } catch (error) {
      console.error('Verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired session cookie.' });
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

      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
      const sessionCookie = cookies.session;

      if (!sessionCookie) {
        return res.status(400).json({ error: 'Missing session cookie' });
      }

      // 4️⃣ Verify the cookie
      const decoded = await auth.verifySessionCookie(sessionCookie, true);

      return res.status(200).json({
        uid: decoded.uid,
        claims: {
          admin: decoded.admin ?? null,
          org: decoded.organization ?? null,
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
