import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeFirebaseAdmin } from './firebase-admin.config';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Global()
@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard, TypeOrmModule],
})
export class AuthModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    initializeFirebaseAdmin(this.configService);
  }
}
