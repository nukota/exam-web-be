-- ExamWeb full database recreation script for Supabase/PostgreSQL.
-- WARNING: This drops the app tables and enum types before recreating them.
-- Run this in Supabase SQL Editor for a new/recreated project.

BEGIN;

-- ==========================
-- Extensions
-- ==========================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================
-- Drop Existing Schema Objects
-- ==========================
DROP TABLE IF EXISTS flags CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS coding_test_cases CASCADE;
DROP TABLE IF EXISTS choices CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS users_role_enum CASCADE;
DROP TYPE IF EXISTS exams_type_enum CASCADE;
DROP TYPE IF EXISTS questions_question_type_enum CASCADE;
DROP TYPE IF EXISTS questions_programming_languages_enum CASCADE;
DROP TYPE IF EXISTS answers_programming_language_enum CASCADE;
DROP TYPE IF EXISTS attempts_status_enum CASCADE;

-- ==========================
-- Enum Types
-- ==========================
-- These names match TypeORM's default PostgreSQL enum naming convention.
CREATE TYPE users_role_enum AS ENUM ('student', 'admin');
CREATE TYPE exams_type_enum AS ENUM ('standard', 'coding');
CREATE TYPE questions_question_type_enum AS ENUM (
  'essay',
  'single_choice',
  'multiple_choice',
  'short_answer',
  'coding'
);
CREATE TYPE questions_programming_languages_enum AS ENUM (
  'c++',
  'python',
  'javascript',
  'java'
);
CREATE TYPE answers_programming_language_enum AS ENUM (
  'c++',
  'python',
  'javascript',
  'java'
);
CREATE TYPE attempts_status_enum AS ENUM (
  'not_started',
  'in_progress',
  'submitted',
  'overdue',
  'graded',
  'cancelled'
);

-- ==========================
-- Tables
-- ==========================
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  photo_url VARCHAR(512),
  role users_role_enum NOT NULL,
  dob DATE,
  class_name VARCHAR(100),
  school_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_users_username UNIQUE (username),
  CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE exams (
  exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type exams_type_enum NOT NULL,
  access_code VARCHAR(100) NOT NULL,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_minutes INTEGER,
  results_released BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT uq_exams_access_code UNIQUE (access_code),
  CONSTRAINT fk_exams_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  title VARCHAR(255),
  "order" INTEGER NOT NULL DEFAULT 0,
  question_type questions_question_type_enum NOT NULL,
  points DOUBLE PRECISION NOT NULL DEFAULT 1,
  correct_answer UUID[],
  correct_answer_text TEXT[],
  coding_template JSONB,
  programming_languages questions_programming_languages_enum[],
  CONSTRAINT fk_questions_exam
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

CREATE TABLE choices (
  choice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  choice_text VARCHAR(500),
  CONSTRAINT fk_choices_question
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE coding_test_cases (
  test_case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  input_data TEXT,
  expected_output TEXT,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_coding_test_cases_question
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE attempts (
  attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_score DOUBLE PRECISION DEFAULT 0,
  cheated BOOLEAN NOT NULL DEFAULT false,
  status attempts_status_enum NOT NULL DEFAULT 'not_started',
  CONSTRAINT fk_attempts_exam
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE,
  CONSTRAINT fk_attempts_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE answers (
  attempt_id UUID NOT NULL,
  question_id UUID NOT NULL,
  answer_text TEXT,
  selected_choices UUID[],
  programming_language answers_programming_language_enum,
  score DOUBLE PRECISION,
  graded_by UUID,
  graded_at TIMESTAMPTZ,
  PRIMARY KEY (attempt_id, question_id),
  CONSTRAINT fk_answers_attempt
    FOREIGN KEY (attempt_id) REFERENCES attempts(attempt_id) ON DELETE CASCADE,
  CONSTRAINT fk_answers_question
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
  CONSTRAINT fk_answers_graded_by
    FOREIGN KEY (graded_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE flags (
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id),
  CONSTRAINT fk_flags_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_flags_question
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- ==========================
-- updated_at Trigger
-- ==========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_attempts_set_updated_at
BEFORE UPDATE ON attempts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ==========================
-- Indexes
-- ==========================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX idx_exams_access_code ON exams(access_code);
CREATE INDEX idx_exams_start_at ON exams(start_at);
CREATE INDEX idx_exams_end_at ON exams(end_at);

CREATE INDEX idx_questions_exam_id ON questions(exam_id);
CREATE INDEX idx_questions_exam_order ON questions(exam_id, "order");
CREATE INDEX idx_questions_question_type ON questions(question_type);

CREATE INDEX idx_choices_question_id ON choices(question_id);

CREATE INDEX idx_coding_test_cases_question_id ON coding_test_cases(question_id);

CREATE INDEX idx_attempts_exam_id ON attempts(exam_id);
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_status ON attempts(status);
CREATE INDEX idx_attempts_exam_user ON attempts(exam_id, user_id);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_graded_by ON answers(graded_by);

CREATE INDEX idx_flags_question_id ON flags(question_id);

-- ==========================
-- Comments
-- ==========================
COMMENT ON TABLE users IS 'Stores user information for students and administrators';
COMMENT ON TABLE exams IS 'Stores exam metadata created by admins';
COMMENT ON TABLE questions IS 'Stores questions belonging to exams';
COMMENT ON TABLE choices IS 'Stores multiple choice options for questions';
COMMENT ON TABLE coding_test_cases IS 'Stores test cases for coding questions';
COMMENT ON TABLE attempts IS 'Stores student exam attempts';
COMMENT ON TABLE answers IS 'Stores student answers for each question in an attempt';
COMMENT ON TABLE flags IS 'Stores flagged questions by students during exam attempts';

COMMIT;
