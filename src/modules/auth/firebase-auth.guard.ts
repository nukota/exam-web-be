import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getFirebaseAdmin } from './firebase-admin.config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const auth = getFirebaseAdmin().auth();
      const decodedToken = await auth.verifyIdToken(token);
      const userRecord = await auth.getUser(decodedToken.uid);
      const displayName = userRecord.displayName;
      const photoUrl = userRecord.photoURL;
      // Find user in database by email
      const email = decodedToken.email;
      if (!email) {
        throw new UnauthorizedException('No email in token');
      }

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        if (request.route?.path === '/auth/sync') {
          request.user = {
            email,
            full_name: displayName,
            photo_url: photoUrl ?? undefined,
            firebaseUid: decodedToken.uid,
            firebase: decodedToken,
          };
          return true;
        }
        throw new UnauthorizedException('User not found in database');
      }

      // Attach user_id, email, and role to request
      request.user = {
        user_id: user.user_id,
        email: user.email,
        full_name: displayName ?? user.full_name,
        photo_url: photoUrl ?? user.photo_url,
        role: user.role,
        firebaseUid: decodedToken.uid,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
