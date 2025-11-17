import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeFirebaseAdmin } from './firebase-admin.config';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../modules/users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    initializeFirebaseAdmin(this.configService);
  }
}
