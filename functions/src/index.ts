import {
  onDocumentCreatedWithAuthContext,
  onDocumentDeletedWithAuthContext,
} from 'firebase-functions/v2/firestore';
import Collections from '../../enums/Collections';
const { logger } = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
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


initializeApp();
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();
firestore.settings({ ignoreUndefinedProperties: true });

exports.createOrganization = onDocumentCreatedWithAuthContext(
  `${Collections.Organizations}/{orgId}`,
  async (event) => {
    const id = event.data?.id;
    if (!id) return 'Error';
    try {
      await auth.setCustomUserClaims(id, { organization: true });
      logger.log('Success');
      return { message: 'Succesfully Added Claim' };
    } catch (error) {
      logger.log('Failed to add claim');
      return { message: 'Failed to add claim' };
    }
  }
);

exports.deleteOrganization = onDocumentDeletedWithAuthContext(
  `${Collections.Organizations}/{orgId}`,
  async (event) => {
    const orgId = event.params.orgId;
    if (!orgId) return 'Error: Missing orgId';

    const writer = firestore.bulkWriter();
    const bucket = storage.bucket();

    try {
      const eventsSnap = await firestore.collection('Events').where('flareId', '==', orgId).get();

      for (const doc of eventsSnap.docs) {
        writer.delete(doc.ref);
      }

      // Delete all savedEvents under the organization
      const savedSnap = await firestore
        .collection(`${Collections.Organizations}/${orgId}/savedEvents`)
        .get();

      for (const doc of savedSnap.docs) {
        writer.delete(doc.ref);
      }

      // Delete all files under Organizations/orgId/
      const [orgFiles] = await bucket.getFiles({
        prefix: `Organizations/${orgId}/`,
      });

      if (orgFiles.length > 0) {
        await Promise.all(orgFiles.map((f) => f.delete()));
        console.log(`Deleted ${orgFiles.length} files under Organizations/${orgId}/`);
      }

      await writer.close();

      console.log(
        `Deleted org ${orgId} with ${eventsSnap.size} events and ${savedSnap.size} savedEvents`
      );

      return `Deleted org ${orgId}, ${eventsSnap.size} events, ${savedSnap.size} savedEvents.`;
    } catch (error) {
      console.error('Error deleting org data:', error);
      throw new Error('Failed to delete organization data');
    }
  }
);

exports.deleteEvent = onDocumentDeletedWithAuthContext(
  `${Collections.Events}/{eventId}`,
  async (event) => {
    const eventId = event.params.eventId;
    if (!eventId) return 'Error: Missing eventId';

    const bucket = storage.bucket();

    try {
      const [eventFiles] = await bucket.getFiles({
        prefix: `Events/${eventId}/`,
      });

      if (eventFiles.length > 0) {
        await Promise.all(eventFiles.map((f) => f.delete()));
        console.log(`Deleted ${eventFiles.length} files under Events/${eventId}/`);
      } else {
        console.log(`No files found for event ${eventId}`);
      }

      return `Deleted storage for event ${eventId}`;
    } catch (error) {
      console.error('Error deleting event storage:', error);
      throw new Error('Failed to delete event storage files');
    }
  }
);

exports.signToken = onRequest(async (req:any, res:any) => {
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


const corsHandler = cors({ origin: true }); // Allow all origins or specify your domain

export const verifySessionCookie = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // 1️⃣ Check method
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }


      // 3️⃣ Validate body
      const sessionCookie = req.body?.data?.sessionCookie;
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

exports.seedDb = onCall(async (request: CallableRequest) => {
  const isEmulator =
    process.env.FUNCTIONS_EMULATOR === 'true' || process.env.FIREBASE_AUTH_EMULATOR_HOST;
  if (!isEmulator) return { success: false };
  let orgs: FlareOrg[] = [];
  const userCreds = [
    { email: 'userOne@gmail.com', password: 'password' },
    { email: 'userTwo@gmail.com', password: 'password' },
    { email: 'userThree@gmail.com', password: 'password' },
  ];
  const orgCreds = [
    {
      email: 'orgOne@gmail.com',
      password: 'password',
      name: 'Org One',
      location: {
        coordinates: {
          latitude: 43.65348,
          longitude: -79.38393,
        },
        id: 'ChIJpTvG15DL1IkRd8S0KlBVNTI',
        name: 'CN Tower, Toronto',
      },
    },
    {
      email: 'orgTwo@gmail.com',
      password: 'password',
      name: 'Org Two',
      location: {
        coordinates: {
          latitude: 43.64257,
          longitude: -79.38706,
        },
        id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        name: 'Starbucks, Front St W',
      },
    },
    {
      email: 'verifiedOrg@gmail.com',
      password: 'password',
      name: 'Verified Organization',
      location: {
        coordinates: {
          latitude: 43.67772,
          longitude: -79.62482,
        },
        id: 'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
        name: 'Toronto Pearson International Airport',
      },
    },
  ];

  for (const credential of userCreds) {
    const user = await auth.createUser({ email: credential.email, password: credential.password });
    const flareUser = new FlareUser(user.uid, user.email!, user.displayName, user.photoURL);
    const ready = userConverter.toFirestore(flareUser);
    await firestore.collection(Collections.Users).doc(user.uid).set(ready);
  }

  let orgIds: string[] = [];
  let verifiedId: string = '';
  for (const credential of orgCreds) {
    const user = await auth.createUser({
      email: credential.email,
      password: credential.password,
    });
    orgIds.push(user.uid);
    await auth.setCustomUserClaims(user.uid, { organization: true });
    let flareUser;
    if (credential.email == 'verifiedOrg@gmail.com') {
      verifiedId = user.uid;
      flareUser = new FlareOrg(
        user.uid,
        credential.name,
        credential.email,
        user.photoURL,
        undefined,
        credential.location as flareLocation,
        true
      );
    } else {
      flareUser = new FlareOrg(
        user.uid,
        credential.name,
        credential.email,
        user.photoURL,
        undefined,
        credential.location as flareLocation,
        false
      );
    }
    const ready = orgConverter.toFirestore(flareUser);
    await firestore.collection(Collections.Organizations).doc(user.uid).set(ready);
    orgs.push(flareUser);
  }

  if (verifiedId) {
    const events = [
      new Event({
        flare_id: verifiedId,
        title: 'Community Gathering',
        description:
          'A celebration bringing the community together with music, food, and activities.',
        type: eventType['Casual Events'],
        startDate: new Date(2025, 4, 12, 18, 0), // May 12, 2025, 6PM
        endDate: new Date(2025, 4, 12, 22, 0),
        ageGroup: 'All Ages',
        location: {
          coordinates: new GeoPoint(43.5448, -80.24819),
          id: 'ChIJ0eWnj8ffK4gR7UFkQtgDPVU',
          name: 'Two Faces',
        },
        price: 10,
        createdAt: new Date(),
      }),

      new Event({
        flare_id: verifiedId,
        title: 'Art & Expression Night',
        description: 'An evening showcasing queer artists with live performances and open mic.',
        type: eventType['Special Events'],
        startDate: new Date(2025, 5, 3, 19, 0), // June 3, 2025, 7PM
        endDate: new Date(2025, 5, 3, 23, 0),
        ageGroup: 'Adults',
        location: {
          coordinates: new GeoPoint(43.5421, -80.2472),
          id: 'ChIJ3x8Pv8ffK4gRZPQFCtgDPVU',
          name: 'Guelph Arts Centre',
        },
        price: 0,
        createdAt: new Date(),
      }),

      new Event({
        flare_id: verifiedId,
        title: 'Pride Picnic',
        description:
          'Join us for a fun outdoor picnic celebrating Pride with games, music, and community.',
        type: eventType['Special Events'],
        startDate: new Date(2025, 6, 15, 12, 0), // July 15, 2025, noon
        endDate: new Date(2025, 6, 15, 16, 0),
        ageGroup: 'All Ages',
        location: {
          coordinates: new GeoPoint(43.5455, -80.255),
          id: 'ChIJ8y4zj8ffK4gRPtQzQtgDPVU',
          name: 'Riverside Park',
        },
        price: 5,
        createdAt: new Date(),
      }),
    ];

    for (const event of events) {
      const ready = eventConverter.toFirestore(event);
      await firestore.collection(Collections.Events).doc(event.id).set(ready);
    }
  }

  if (orgIds.length >= 1) {
    const event = new Event({
      flare_id: orgIds[0],
      title: 'Event One',
      description: 'Event One Description',
      type: eventType['Special Events'],
      startDate: new Date(2025, 3, 4),
      endDate: new Date(2025, 3, 4),
      ageGroup: 'Adults',
      location: {
        coordinates: new GeoPoint(43.5448, -80.24819),
        id: 'ChIJ0eWnj8ffK4gR7UFkQtgDPVU',
        name: 'Two Faces',
      },
      price: 0,
      createdAt: new Date(),
    });
    const ready = eventConverter.toFirestore(event);
    await firestore.collection(Collections.Events).doc(event.id).set(ready);
  }

  return { success: true };
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
