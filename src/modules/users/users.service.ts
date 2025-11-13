import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // TODO: Replace with actual database connection (e.g., TypeORM, Prisma, or pg client)
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    // TODO: Hash password before storing
    // TODO: Insert into database
    const newUser: User = {
      user_id: this.generateUUID(),
      ...createUserDto,
      created_at: new Date(),
    };
    this.users.push(newUser);
    return this.excludePassword(newUser);
  }

  async findAll(): Promise<User[]> {
    // TODO: Query from database
    return this.users.map(user => this.excludePassword(user));
  }

  async findOne(id: string): Promise<User> {
    // TODO: Query from database
    const user = this.users.find(u => u.user_id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.excludePassword(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    // TODO: Query from database
    const user = this.users.find(u => u.username === username);
    return user ? this.excludePassword(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    // TODO: Query from database
    const user = this.users.find(u => u.email === email);
    return user ? this.excludePassword(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // TODO: Update in database
    const userIndex = this.users.findIndex(u => u.user_id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // TODO: Hash password if it's being updated
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };
    
    return this.excludePassword(this.users[userIndex]);
  }

  async remove(id: string): Promise<void> {
    // TODO: Delete from database
    const userIndex = this.users.findIndex(u => u.user_id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }

  private excludePassword(user: User): User {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
