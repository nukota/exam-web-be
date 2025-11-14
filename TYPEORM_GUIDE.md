# TypeORM Integration Guide

This document explains the TypeORM setup and how to update the remaining services to use the database.

## ✅ What's Been Done

1. **Installed TypeORM dependencies**:
   - `@nestjs/typeorm`
   - `typeorm`
   - `pg` (PostgreSQL driver)

2. **Created TypeORM entities** for all 8 tables:
   - All entities now use TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`, etc.)
   - Added proper relationships (`@ManyToOne`, `@OneToMany`)
   - Configured foreign keys with `@JoinColumn`

3. **Configured TypeORM** in `app.module.ts`:
   - Auto-synchronization enabled in development (creates tables automatically)
   - Logging enabled in development
   - Entity auto-discovery configured

4. **Registered repositories** in all module files

5. **Updated UsersService** as an example of how to use TypeORM Repository

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE examweb;

# Exit
\q
```

### 2. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=examweb
NODE_ENV=development
```

### 3. Start the Application

When you run the application in development mode, TypeORM will automatically create all tables based on the entities:

```bash
npm run start:dev
```

The tables will be created with:
- Proper column types
- Primary keys (UUID)
- Foreign keys
- Constraints
- Indexes

## 📝 How to Update Services

I've updated the `UsersService` as an example. Follow this pattern for the other services:

### Example: ExamsService

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create(createExamDto);
    return await this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find();
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({ 
      where: { exam_id: id } 
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async findByTeacherId(teacherId: string): Promise<Exam[]> {
    return await this.examRepository.find({ 
      where: { teacher_id: teacherId } 
    });
  }

  async findByAccessCode(accessCode: string): Promise<Exam | null> {
    return await this.examRepository.findOne({ 
      where: { access_code: accessCode } 
    });
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return await this.examRepository.save(exam);
  }

  async remove(id: string): Promise<void> {
    const result = await this.examRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
  }
}
```

## 🔄 Pattern to Follow

For each service:

1. **Import TypeORM decorators**:
   ```typescript
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   ```

2. **Inject the repository in constructor**:
   ```typescript
   constructor(
     @InjectRepository(EntityName)
     private readonly entityRepository: Repository<EntityName>,
   ) {}
   ```

3. **Replace in-memory operations with repository methods**:
   - `create()` → `repository.create()` + `repository.save()`
   - `findAll()` → `repository.find()`
   - `findOne()` → `repository.findOne({ where: { id } })`
   - `update()` → `repository.save()` after modifying entity
   - `delete()` → `repository.delete(id)`

4. **Remove**:
   - In-memory arrays (`private items: Item[] = []`)
   - `generateUUID()` method (TypeORM handles this)

## 🔍 Advanced Queries

### Finding with Relations

```typescript
async findOne(id: string): Promise<Exam> {
  return await this.examRepository.findOne({
    where: { exam_id: id },
    relations: ['questions', 'teacher', 'submissions'],
  });
}
```

### Finding with Multiple Conditions

```typescript
async findByFilters(teacherId: string, type: string): Promise<Exam[]> {
  return await this.examRepository.find({
    where: { 
      teacher_id: teacherId,
      type: type 
    },
  });
}
```

### Using Query Builder

```typescript
async findActiveExams(): Promise<Exam[]> {
  return await this.examRepository
    .createQueryBuilder('exam')
    .where('exam.start_at <= :now', { now: new Date() })
    .andWhere('exam.end_at >= :now', { now: new Date() })
    .getMany();
}
```

## 🔒 Security Considerations

### Password Hashing

Install bcrypt:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

Update UsersService:
```typescript
import * as bcrypt from 'bcrypt';

async create(createUserDto: CreateUserDto): Promise<User> {
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  const user = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });
  const savedUser = await this.userRepository.save(user);
  return this.excludePassword(savedUser);
}
```

## 📊 Migration (Optional)

For production, you should use migrations instead of auto-sync:

1. **Disable synchronize** in production:
   ```typescript
   synchronize: false, // Never use in production
   ```

2. **Generate migrations**:
   ```bash
   npm run typeorm migration:generate -- -n InitialSchema
   ```

3. **Run migrations**:
   ```bash
   npm run typeorm migration:run
   ```

## 🧪 Testing

After updating a service, test it:

```bash
# Start the server
npm run start:dev

# Visit Swagger UI
http://localhost:3000/api

# Test CRUD operations through Swagger
```

## 📝 Services to Update

- [x] UsersService (✅ Done as example)
- [ ] ExamsService
- [ ] QuestionsService
- [ ] ChoicesService
- [ ] CodingTestCasesService
- [ ] SubmissionsService
- [ ] AnswersService
- [ ] FlagsService

Follow the same pattern as UsersService for each one!

## 🎯 Next Steps

1. Update all remaining services to use TypeORM repositories
2. Install and implement bcrypt for password hashing
3. Test all endpoints via Swagger UI
4. Add validation and business logic as needed
5. Implement Firebase authentication
6. Set up migrations for production
