import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/promote-admin')
  @ApiOperation({ summary: 'Promote a user to admin role' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User promoted to admin successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async promoteToAdmin(@Param('id') id: string): Promise<User> {
    return this.usersService.promoteToAdmin(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('students')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all student users' })
  @ApiResponse({
    status: 200,
    description: 'List of all student users',
    type: [User],
  })
  async findAllStudents(): Promise<User[]> {
    return this.usersService.findAllStudents();
  }

  @Patch('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('user_id') currentUserId: string,
  ): Promise<User> {
    return this.usersService.update(currentUserId, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user from database only' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Delete(':id/complete')
  @ApiOperation({
    summary: 'Completely delete a user from both database and Firebase',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted from both database and Firebase',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedFromDb: { type: 'boolean' },
        deletedFromFirebase: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<{
    message: string;
    deletedFromDb: boolean;
    deletedFromFirebase: boolean;
  }> {
    return this.usersService.deleteUser(id);
  }

  @Post('delete-all')
  @ApiOperation({
    summary: 'Delete all users from both database and Firebase (DANGEROUS)',
  })
  @ApiResponse({
    status: 200,
    description: 'All users deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        totalUsers: { type: 'number' },
        deletedFromDb: { type: 'number' },
        deletedFromFirebase: { type: 'number' },
        firebaseErrors: { type: 'number' },
      },
    },
  })
  async deleteAllUsers(): Promise<{
    message: string;
    totalUsers: number;
    deletedFromDb: number;
    deletedFromFirebase: number;
    firebaseErrors: number;
  }> {
    return this.usersService.deleteAllUsers();
  }
}
