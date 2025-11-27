import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { GetUser } from './decorators/get-user.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user details' })
  @ApiResponse({
    status: 200,
    description: 'Current user details retrieved successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getMe(@CurrentUser('user_id') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync or create user from Firebase authentication' })
  @ApiResponse({ status: 200, description: 'User synced successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid Firebase token',
  })
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
