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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/promote-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Promote a user to admin role' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user from database only' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Delete(':id/complete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Completely delete a user from both database and Firebase',
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
  async deleteUser(
    @Param('id') id: string,
  ): Promise<{
    message: string;
    deletedFromDb: boolean;
    deletedFromFirebase: boolean;
  }> {
    return this.usersService.deleteUser(id);
  }

  @Post('delete-all')
  @ApiBearerAuth()
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
  @ApiResponse({ status: 403, description: 'Invalid confirmation code' })
  async deleteAllUsers(
    @Body('confirmationCode') confirmationCode: string,
  ): Promise<{
    message: string;
    totalUsers: number;
    deletedFromDb: number;
    deletedFromFirebase: number;
    firebaseErrors: number;
  }> {
    return this.usersService.deleteAllUsers(confirmationCode);
  }
}
