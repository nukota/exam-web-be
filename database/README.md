# Database Setup Guide

This folder contains SQL for recreating the ExamWeb PostgreSQL schema in Supabase.

## Recreate The Database

1. Open your Supabase project dashboard.
2. Go to SQL Editor.
3. Copy the contents of `database/recreate_schema.sql`.
4. Paste it into the editor and run it.

`recreate_schema.sql` is destructive: it drops the ExamWeb app tables and enum types before recreating them. Use it for a new Supabase project or when you intentionally want to reset the app schema.

## What The Script Creates

### Extensions

- `pgcrypto` for `gen_random_uuid()`
- `uuid-ossp` for UUID compatibility

### Enum Types

- `users_role_enum`: `student`, `admin`
- `exams_type_enum`: `standard`, `coding`
- `questions_question_type_enum`: `essay`, `single_choice`, `multiple_choice`, `short_answer`, `coding`
- `questions_programming_languages_enum`: `c++`, `python`, `javascript`, `java`
- `answers_programming_language_enum`: `c++`, `python`, `javascript`, `java`
- `attempts_status_enum`: `not_started`, `in_progress`, `submitted`, `overdue`, `graded`, `cancelled`

### Tables

- `users`
- `exams`
- `questions`
- `choices`
- `coding_test_cases`
- `attempts`
- `answers`
- `flags`

The enum type names follow TypeORM's default PostgreSQL naming convention for the current NestJS entities.

## Notes

- The script does not enable Row Level Security because the backend connects directly to PostgreSQL through TypeORM.
- After recreating the schema, update the backend `.env` with the new Supabase database host, port, database, username, and password.
- If you want sample data, run the backend seed endpoint/service after the schema exists.
