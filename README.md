# ExamWeb Backend

NestJS backend for ExamWeb - An Online Examination System for creating, managing, and grading exams with support for multiple question types including essays, multiple choice, and coding questions.

## Features

- 🚀 NestJS framework with TypeScript
- 📝 Swagger API documentation
- 🎓 Complete exam management system
- 👥 User management (Students, Teachers, Admins)
- 📋 Multiple question types (Essay, Multiple Choice, Short Answer, Coding)
- ✅ Automated grading support
- 🔍 Question flagging system
- 📊 Submission tracking and scoring
- 🔐 Ready for Firebase Google OAuth integration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/examweb
   CORS_ORIGIN=http://localhost:3000
   ```

4. Set up your PostgreSQL database using the schema in `database/schema.sql`:
   ```bash
   psql -U your_username -d your_database -f database/schema.sql
   ```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api`

## Project Structure

```
src/
├── modules/
│   ├── users/                # User management
│   ├── exams/                # Exam management
│   ├── questions/            # Question management
│   ├── choices/              # Multiple choice options
│   ├── coding-test-cases/    # Test cases for coding questions
│   ├── submissions/          # Student exam submissions
│   ├── answers/              # Student answers
│   └── flags/                # Question flags during exams
├── common/                   # Shared utilities
├── app.module.ts             # Root module
└── main.ts                   # Application entry point
```

## Database Schema

The system supports the following entities:

- **Users**: Students, teachers, and administrators
- **Exams**: Exam metadata with access codes
- **Questions**: Multiple question types (essay, multiple choice, coding, etc.)
- **Choices**: Options for multiple choice questions
- **Coding Test Cases**: Input/output test cases for coding questions
- **Submissions**: Student exam submissions
- **Answers**: Student answers to questions
- **Flags**: Questions flagged by students during exams

## Available Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Exams
- `GET /exams` - Get all exams (filter by teacherId)
- `GET /exams/:id` - Get exam by ID
- `GET /exams/access-code/:code` - Get exam by access code
- `POST /exams` - Create new exam
- `PATCH /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam

### Questions
- `GET /questions` - Get all questions (filter by examId)
- `GET /questions/:id` - Get question by ID
- `POST /questions` - Create new question
- `PATCH /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question

### Choices
- `GET /choices` - Get all choices (filter by questionId)
- `GET /choices/:id` - Get choice by ID
- `POST /choices` - Create new choice
- `PATCH /choices/:id` - Update choice
- `DELETE /choices/:id` - Delete choice

### Coding Test Cases
- `GET /coding-test-cases` - Get all test cases (filter by questionId)
- `GET /coding-test-cases/:id` - Get test case by ID
- `POST /coding-test-cases` - Create new test case
- `PATCH /coding-test-cases/:id` - Update test case
- `DELETE /coding-test-cases/:id` - Delete test case

### Submissions
- `GET /submissions` - Get all submissions (filter by examId or userId)
- `GET /submissions/:id` - Get submission by ID
- `POST /submissions` - Create new submission
- `PATCH /submissions/:id` - Update submission (for grading)
- `DELETE /submissions/:id` - Delete submission

### Answers
- `GET /answers` - Get all answers (filter by submissionId or questionId)
- `GET /answers/:id` - Get answer by ID
- `POST /answers` - Create new answer
- `PATCH /answers/:id` - Update answer (for grading)
- `DELETE /answers/:id` - Delete answer

### Flags
- `GET /flags` - Get all flags (filter by userId, submissionId, or questionId)
- `GET /flags/:id` - Get flag by ID
- `POST /flags` - Create new flag
- `PATCH /flags/:id` - Update flag
- `DELETE /flags/:id` - Delete flag

## Next Steps

### Authentication with Firebase
To integrate Firebase Google OAuth:

1. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Create an auth module and guard:
   - Initialize Firebase Admin in a config file
   - Create a JWT strategy to validate Firebase tokens
   - Implement an AuthGuard to protect routes
   - Add user extraction decorator

3. Apply the guard to protected routes using `@UseGuards(AuthGuard)`

### Database Integration
Currently, all modules use in-memory storage. To integrate with PostgreSQL:

1. Install a database client:
   ```bash
   npm install pg
   # or use an ORM like TypeORM or Prisma
   ```

2. Replace the in-memory arrays in each service with actual database queries

3. Consider using TypeORM or Prisma for better type safety and migrations

## License

MIT
