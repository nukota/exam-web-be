# Migration Guide - From Supabase Template to ExamWeb

## Summary of Changes

This document outlines all the changes made to transform the NestJS Supabase template into the ExamWeb backend system.

## 1. Removed Supabase Dependencies

### Files Deleted:
- `src/config/supabase.config.ts` - Supabase client configuration
- `src/common/interfaces/supabase.interface.ts` - Supabase TypeScript interfaces
- `src/auth/` - Entire auth module (will be replaced with Firebase OAuth)
- `src/items/` - Example CRUD module

### Package Changes:
- **Removed**: `@supabase/supabase-js`
- **Added**: `pg` (PostgreSQL client - ready for database integration)
- **Updated**: Package name and description

## 2. Created Database Schema

### Location: `database/schema.sql`

Complete PostgreSQL schema with:
- 8 tables (users, exams, questions, choices, coding_test_cases, submissions, answers, flags)
- Foreign key relationships
- Check constraints for enums
- Indexes for performance
- Database comments

## 3. Created Module Structure

All modules follow NestJS best practices with:
- **Entity**: TypeScript class with Swagger decorators
- **DTOs**: Create and Update DTOs with validation
- **Service**: Business logic layer (currently in-memory, ready for DB integration)
- **Controller**: HTTP endpoints with Swagger documentation
- **Module**: NestJS module definition

### Created Modules:

#### `src/modules/users/`
- User management for students, teachers, and admins
- Role-based user model
- Support for student-specific fields (dob, class_name)

#### `src/modules/exams/`
- Exam creation and management
- Access code system
- Time-based exam scheduling
- Support for essay, multiple_choice, and coding exam types

#### `src/modules/questions/`
- Multiple question types (essay, single_choice, multiple_choice, short_answer, coding)
- Point allocation per question
- Image support for questions
- Correct answer storage for auto-grading

#### `src/modules/choices/`
- Multiple choice options
- Correct/incorrect marking
- Linked to questions

#### `src/modules/coding-test-cases/`
- Input/output test cases for coding questions
- Hidden test case support
- Automated testing capability

#### `src/modules/submissions/`
- Student exam submissions
- Cheating detection flag
- Status tracking (submitted, graded)
- Total score calculation

#### `src/modules/answers/`
- Student answers to questions
- Support for text answers and choice selections
- Grading information (score, graded_by, graded_at)

#### `src/modules/flags/`
- Question flagging during exams
- Optional notes from students
- Tracking of flagged questions per submission

## 4. Updated Core Files

### `src/app.module.ts`
- Removed AuthModule and ItemsModule
- Added all 8 new feature modules
- Retained ConfigModule for environment variables

### `src/main.ts`
- Updated Swagger title: "ExamWeb API"
- Updated description to reflect exam system functionality
- Changed JWT description to "Firebase JWT token"

### `package.json`
- Updated name: "examweb-backend"
- Updated description
- Removed Supabase dependency
- Added PostgreSQL client

### `README.md`
- Completely rewritten for ExamWeb
- Documented all endpoints
- Added database setup instructions
- Included Firebase integration guide
- Added next steps for database integration

## 5. Current State

### ✅ Completed:
- All 8 modules created with full CRUD operations
- Complete database schema
- Swagger documentation for all endpoints
- DTOs with validation decorators
- TypeScript entities with proper typing
- Module exports for inter-module dependencies

### ⚠️ TODO (Intentionally Left for Implementation):

#### Authentication:
- Firebase Admin SDK integration
- AuthGuard implementation
- JWT token validation
- User decorator for extracting current user
- Role-based guards (student, teacher, admin)

#### Database:
- Replace in-memory storage with actual PostgreSQL queries
- Consider using TypeORM or Prisma ORM
- Implement database migrations
- Add connection pooling
- Error handling for database operations

#### Business Logic:
- Password hashing for users
- Exam access code validation
- Auto-grading logic for multiple choice and coding questions
- Cheating detection algorithms
- Score calculation logic
- Time-based exam access control

## 6. API Endpoints Overview

All modules follow RESTful conventions:
- `GET /<resource>` - List all (with optional filters)
- `GET /<resource>/:id` - Get one by ID
- `POST /<resource>` - Create new
- `PATCH /<resource>/:id` - Update
- `DELETE /<resource>/:id` - Delete

**Total Endpoints**: 48 (6 per module × 8 modules)

## 7. Data Flow Example

### Creating an Exam with Questions:
1. Teacher creates exam via `POST /exams`
2. Teacher adds questions via `POST /questions` (with exam_id)
3. For multiple choice questions, add choices via `POST /choices`
4. For coding questions, add test cases via `POST /coding-test-cases`

### Student Taking an Exam:
1. Student joins exam using access code via `GET /exams/access-code/:code`
2. Student retrieves questions via `GET /questions?examId=<id>`
3. Student creates submission via `POST /submissions`
4. Student submits answers via `POST /answers` (with submission_id)
5. Student can flag questions via `POST /flags`

### Grading Process:
1. Teacher retrieves submissions via `GET /submissions?examId=<id>`
2. Teacher reviews answers via `GET /answers?submissionId=<id>`
3. Teacher grades answers via `PATCH /answers/:id` (add score, graded_by)
4. System updates submission total_score via `PATCH /submissions/:id`

## 8. Environment Variables

Required `.env` variables:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/examweb
CORS_ORIGIN=http://localhost:3000
```

Additional variables to add when implementing Firebase:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## 9. Next Implementation Steps

1. **Install dependencies**: `npm install`
2. **Set up PostgreSQL database**: Run `database/schema.sql`
3. **Implement Firebase Authentication**:
   - Install `firebase-admin`
   - Create auth module with guards
   - Protect routes with `@UseGuards(AuthGuard)`
4. **Connect to Database**:
   - Choose ORM (TypeORM or Prisma recommended)
   - Replace in-memory storage in services
   - Implement proper error handling
5. **Test all endpoints**: Use Swagger UI at `/api`

## 10. Important Notes

- All modules use in-memory storage (arrays) for now - this is intentional for easy testing
- Password field in User entity should be hashed before storage (TODO)
- All services have a placeholder `generateUUID()` method - replace with database-generated UUIDs
- Swagger decorators are fully implemented for API documentation
- Validation decorators are in place but need proper error handling
- Foreign key relationships are defined in the database schema

## Conclusion

The template has been successfully transformed from a Supabase-based system to a standalone NestJS application ready for Firebase OAuth and PostgreSQL integration. All modules are structured, documented, and ready for database implementation.
