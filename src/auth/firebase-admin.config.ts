import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebaseAdmin = (configService: ConfigService) => {
  if (!firebaseApp) {
    const serviceAccount = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    
    if (serviceAccount) {
      // Initialize with service account file
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Initialize with environment variables (project ID, client email, private key)
      const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
      
      if (projectId && clientEmail && privateKey) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } else {
        throw new Error('Firebase Admin SDK configuration is missing. Please provide either FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
      }
    }
  }
  
  return firebaseApp;
};

export const getFirebaseAdmin = (): admin.app.App => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin SDK is not initialized. Call initializeFirebaseAdmin first.');
  }
  return firebaseApp;
};
