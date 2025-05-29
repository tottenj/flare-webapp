if (process.env.MODE === 'test') {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
  console.log('Running in TEST mode with emulators.');
}


import { onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';
import Collections from '../../enums/Collections';
const { logger } = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';
const { initializeApp } = require('firebase-admin/app');

initializeApp();
const auth = getAuth();

exports.createOrganization = onDocumentCreatedWithAuthContext(
  `${Collections.Organizations}/{orgId}`,
  async (event) => {
    if (!event.authId || event.authId == undefined) return { message: 'No Auth Id' };

    try {
      logger.log('HELLO');
      logger.log(event.authId);
      await auth.setCustomUserClaims(event.authId!, { organization: true });
      return { message: 'Succesfully Added Claim' };
    } catch (error) {
      logger.log('Failed to add claim');
      return { message: 'Failed to add claim' };
    }
  }
);
