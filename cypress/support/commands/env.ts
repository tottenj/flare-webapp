export const apiKey = Cypress.env('FIREBASE_API_KEY');
export const projectId = Cypress.env('FIREBASE_PROJECT_ID');
export const AUTH_EMULATOR = 'http://localhost:9099/identitytoolkit.googleapis.com/v1';
export const AUTH_ADMIN = `http://localhost:9099/emulator/v1/projects/${projectId}`;
export const FIRESTORE_ADMIN = 'http://localhost:8080';
export const storageBucket = 'flare-7091a.firebasestorage.app';
export const STORAGE_EMULATOR = `http://127.0.0.1:9199/v0/b/${storageBucket}/o`;
export const storageEms = `http://127.0.0.1:9199/v0/b/${storageBucket}/o`;