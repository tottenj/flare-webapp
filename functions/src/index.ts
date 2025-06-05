import { onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';
import Collections from '../../enums/Collections';
const { logger } = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';
const { initializeApp } = require('firebase-admin/app');
const {onCall} = require("firebase-functions/v2/https");
import { CallableRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';



initializeApp();
const auth = getAuth();
const firestore = getFirestore()

exports.createOrganization = onDocumentCreatedWithAuthContext(
  `${Collections.Organizations}/{orgId}`,
  async (event) => {
    const id = event.data?.id
    if(!id) return "Error"
    try {
      await auth.setCustomUserClaims(id, { organization: true });
      logger.log("Success")
      return { message: 'Succesfully Added Claim' };
    } catch (error) {
      logger.log('Failed to add claim');
      return { message: 'Failed to add claim' };
    }
  }
);

exports.verify = onCall(async (request:CallableRequest) => {
  if(!request.auth || request.auth.token.admin !== true || !request.data || request.data.orgId) return {message: "error"}
  const orgId = request.data.orgId
  const writer = firestore.batch();

  try{
  await auth.setCustomUserClaims(orgId, {verified: true})
  const events = await firestore.collection("Events").where("flareId", "==", orgId).get()
   events.docs.forEach((doc) => {
    writer.update(doc.ref, {verified: true})
   })
   await writer.commit();
   return {message: "success"}
  }catch(error){
    logger.log("Error")
    return {message: "error"}
  }
})


exports.addMyself = onCall((request:any) => {
    auth.getUserByEmail("josh.totten8@gmail.com").then((val) => {
      auth.setCustomUserClaims(val.uid, {"admin":true})
    })
})