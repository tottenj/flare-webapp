// functions/src/bootstrap/admin.ts
import * as admin from 'firebase-admin';

if (process.env.FUNCTIONS_EMULATOR) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

if (!admin.apps.length) {
  admin.initializeApp();
}

export const auth = admin.auth();
export const storage = admin.storage();
export const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });


export { admin };
