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
    if (!event.authId || event.authId != undefined) logger.log('No auth id');
    try {
      await auth.setCustomUserClaims(event.authId!, { organization: true });
      return { message: 'Succesfully Added Claim' };
    } catch (error) {
      logger.log("Failed to add claim")
      return {message: "Failed to add claim"}
    }
  }
);
