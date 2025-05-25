"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.MODE === 'test') {
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    process.env.STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
    console.log('Running in TEST mode with emulators.');
}
const firestore_1 = require("firebase-functions/v2/firestore");
const Collections_1 = __importDefault(require("../../enums/Collections"));
const { logger } = require('firebase-functions');
const auth_1 = require("firebase-admin/auth");
const { initializeApp } = require('firebase-admin/app');
initializeApp();
const auth = (0, auth_1.getAuth)();
exports.createOrganization = (0, firestore_1.onDocumentCreatedWithAuthContext)(`${Collections_1.default.Organizations}/{orgId}`, async (event) => {
    if (!event.authId || event.authId == undefined)
        return { message: 'No Auth Id' };
    try {
        logger.log('HELLO');
        logger.log(event.authId);
        await auth.setCustomUserClaims(event.authId, { organization: true });
        return { message: 'Succesfully Added Claim' };
    }
    catch (error) {
        logger.log('Failed to add claim');
        return { message: 'Failed to add claim' };
    }
});
//# sourceMappingURL=index.js.map