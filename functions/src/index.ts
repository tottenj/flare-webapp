import { onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';
import Collections from '../../enums/Collections';
const { logger } = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';
import { CallableRequest, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import FlareOrg, { orgConverter } from '../classes/FlareOrg';
import FlareUser, { userConverter } from '../classes/FlareUser';
import flareLocation from '../classes/flareLocation';

initializeApp();
const auth = getAuth();
const firestore = getFirestore();
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

exports.seedDb = onCall(async (request: CallableRequest) => {
  logger.log("HERE")
  if (process.env.FUNCTIONS_EMULATOR !== 'true') return { success: false };
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

  for (const credential of orgCreds) {
    const user = await auth.createUser({
      email: credential.email,
      password: credential.password,
    });
    await auth.setCustomUserClaims(user.uid, { organization: true });
    let flareUser;
    if (credential.email == 'verifiedOrg@gmail.com') {
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
  return {success: true}
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
