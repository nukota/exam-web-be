import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    // TODO: Hash password before storing (use bcrypt)
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    return this.excludePassword(savedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.excludePassword(user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.excludePassword(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ? this.excludePassword(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? this.excludePassword(user) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // TODO: Hash password if it's being updated
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    
    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private excludePassword(user: User): User {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}
