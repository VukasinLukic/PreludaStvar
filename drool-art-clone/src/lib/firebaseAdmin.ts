import admin from 'firebase-admin';

// Check if the SDK has already been initialized
if (!admin.apps.length) {
  try {
    // Attempt to initialize using environment variables (ideal for production)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), // Reads GOOGLE_APPLICATION_CREDENTIALS env var
    });
    console.log('Firebase Admin SDK initialized using Application Default Credentials.');
  } catch (e1: any) {
    console.warn('Could not initialize Firebase Admin with ADC, trying serviceAccountKey.json...', e1.message);
    try {
      // Fallback to service account key file (useful for local dev)
      const serviceAccount = require('../../serviceAccountKey.json'); // Path relative to lib folder
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized using serviceAccountKey.json.');
    } catch (e2: any) {
      console.error('Failed to initialize Firebase Admin SDK with both ADC and service account key:', e2);
      // Optional: re-throw or handle error appropriately for your app
    }
  }
}

const firestoreAdmin = admin.firestore();
const authAdmin = admin.auth();
const storageAdmin = admin.storage(); // Although we use Supabase for images, might be useful later

export { firestoreAdmin, authAdmin, storageAdmin, admin as adminInstance }; 