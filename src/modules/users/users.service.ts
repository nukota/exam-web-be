import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async promoteToAdmin(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.role = 'admin' as any;
    return await this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Only allow updating non-Firebase fields (dob, class_name, school_name)
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Completely delete a user from both database and Firebase
   * @param id - User ID (UUID)
   * @returns Object with deletion status
   */
  async deleteUser(
    id: string,
  ): Promise<{
    message: string;
    deletedFromDb: boolean;
    deletedFromFirebase: boolean;
  }> {
    // Find user in database
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let deletedFromFirebase = false;
    let firebaseError: string | null = null;

    // Delete from Firebase using email
    if (user.email) {
      try {
        // Get Firebase user by email
        const firebaseUser = await admin.auth().getUserByEmail(user.email);
        await admin.auth().deleteUser(firebaseUser.uid);
        deletedFromFirebase = true;
      } catch (error) {
        // If user not found in Firebase, continue with DB deletion
        if (error.code === 'auth/user-not-found') {
          console.warn(
            `Firebase user with email ${user.email} not found, continuing with DB deletion`,
          );
          deletedFromFirebase = true; // Consider it deleted if not found
        } else {
          firebaseError = error.message;
          console.error(
            `Failed to delete user from Firebase: ${error.message}`,
          );
          // Don't throw error, continue with database deletion
        }
      }
    } else {
      // No email, skip Firebase deletion
      deletedFromFirebase = true;
    }

    // Delete from database
    await this.userRepository.delete(id);

    return {
      message: firebaseError
        ? `User deleted from database, but Firebase deletion failed: ${firebaseError}`
        : 'User deleted successfully from both database and Firebase',
      deletedFromDb: true,
      deletedFromFirebase,
    };
  }

  /**
   * Delete all users from both database and Firebase
   * WARNING: This is a destructive operation!
   * @param confirmationCode - Must pass 'DELETE_ALL_USERS' to execute
   * @returns Object with deletion statistics
   */
  async deleteAllUsers(confirmationCode: string): Promise<{
    message: string;
    totalUsers: number;
    deletedFromDb: number;
    deletedFromFirebase: number;
    firebaseErrors: number;
  }> {
    if (confirmationCode !== 'DELETE_ALL_USERS') {
      throw new InternalServerErrorException(
        'Invalid confirmation code. Operation cancelled.',
      );
    }

    // Get all users
    const users = await this.userRepository.find();
    const totalUsers = users.length;
    let deletedFromFirebase = 0;
    let firebaseErrors = 0;

    // Delete each user from Firebase using email
    for (const user of users) {
      if (user.email) {
        try {
          // Get Firebase user by email then delete
          const firebaseUser = await admin.auth().getUserByEmail(user.email);
          await admin.auth().deleteUser(firebaseUser.uid);
          deletedFromFirebase++;
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            console.warn(`Firebase user with email ${user.email} not found`);
            deletedFromFirebase++; // Consider it deleted if not found
          } else {
            firebaseErrors++;
            console.error(
              `Failed to delete Firebase user ${user.email}: ${error.message}`,
            );
          }
        }
      } else {
        deletedFromFirebase++; // No email, count as \"deleted\"
      }
    }

    // Delete all users from database
    await this.userRepository.delete({});

    return {
      message:
        firebaseErrors > 0
          ? `Deleted ${totalUsers} users from database, but ${firebaseErrors} Firebase deletion(s) failed`
          : `Successfully deleted all ${totalUsers} users from both database and Firebase`,
      totalUsers,
      deletedFromDb: totalUsers,
      deletedFromFirebase,
      firebaseErrors,
    };
  }
}
