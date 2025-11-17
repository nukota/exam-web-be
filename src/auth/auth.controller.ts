import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../modules/users/users.service';
import { GetUser } from './get-user.decorator';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync or create user from Firebase authentication' })
  @ApiResponse({ status: 200, description: 'User synced successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid Firebase token' })
  async syncUser(@GetUser() firebaseUser: any) {
    const { email, name } = firebaseUser;
    
    // Check if user exists by email
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Create new user if not exists
      user = await this.usersService.create({
        username: email.split('@')[0], // Use email prefix as username
        email: email,
        full_name: name || email.split('@')[0],
        role: 'student' as any, // Default role
      });
    }

    return user;
  }
}
