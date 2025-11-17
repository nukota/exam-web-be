# Firebase Admin SDK Setup

This project uses Firebase Admin SDK for authentication token verification.

## Configuration Options

You have two options to configure Firebase Admin SDK:

### Option 1: Service Account JSON File (Recommended for Development)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" to download the service account JSON file
3. Save the file as `firebase-service-account.json` in the project root
4. Add to `.env`:
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   ```
5. Add `firebase-service-account.json` to `.gitignore` (security!)

### Option 2: Environment Variables (Recommended for Production)

1. Extract the following from your service account JSON:
   - `project_id`
   - `client_email`
   - `private_key`
2. Add to `.env`:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

## Usage

### Protecting Routes

Add the `@UseGuards(FirebaseAuthGuard)` decorator to any controller or route:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { GetUser } from './auth/get-user.decorator';

@Controller('protected')
@UseGuards(FirebaseAuthGuard)
export class ProtectedController {
  @Get()
  getProtectedData(@GetUser() user: any) {
    return { message: 'Protected data', user };
  }

  @Get('uid')
  getUserId(@GetUser('uid') uid: string) {
    return { uid };
  }
}
```

### Frontend Integration

Send the Firebase ID token in the Authorization header:

```javascript
const idToken = await user.getIdToken();
const response = await fetch('http://localhost:3000/api/protected', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

## Authentication Flow

1. User signs in with Firebase on the frontend
2. Frontend receives Firebase ID token
3. Frontend sends token in Authorization header to backend
4. Backend verifies token with Firebase Admin SDK
5. If valid, request proceeds; if invalid, returns 401 Unauthorized

## Auth Endpoints

- `POST /auth/register` - Register a new user after Firebase authentication
- `POST /auth/sync` - Sync or create user from Firebase authentication (auto-creates if doesn't exist)
