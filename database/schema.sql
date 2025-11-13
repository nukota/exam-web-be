-- ExamWeb Database Schema
-- PostgreSQL database schema for the online examination system

-- ==========================
-- Extensions
-- ==========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================
-- Tables
-- ==========================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  dob DATE, -- student only
  class_name VARCHAR(100), -- student only
  school_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('essay', 'multiple_choice', 'coding')),
  access_code VARCHAR(100) UNIQUE NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL,
  question_text TEXT,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('essay', 'single_choice', 'multiple_choice', 'short_answer', 'coding')),
  points FLOAT DEFAULT 1,
  correct_answer UUID[], -- store UUIDs of correct choices or NULL for essay/coding
  coding_template VARCHAR(1000),
  image_url VARCHAR(500)
);

-- Choices table
CREATE TABLE IF NOT EXISTS choices (
  choice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  choice_text VARCHAR(500),
  is_correct BOOLEAN DEFAULT false
);

-- Coding test cases table
CREATE TABLE IF NOT EXISTS coding_test_cases (
  test_case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  input_data TEXT,
  expected_output TEXT,
  is_hidden BOOLEAN DEFAULT false -- true = hidden test case
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL,
  user_id UUID NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score FLOAT DEFAULT 0,
  cheated BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded'))
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL,
  question_id UUID NOT NULL,
  answer_text TEXT, -- or code for coding exams, essay, short_answer
  selected_choices UUID[], -- for single_choice or multiple_choice questions
  score FLOAT, -- null until graded
  graded_by UUID, -- teacher_id if essay or coding exam
  graded_at TIMESTAMP WITH TIME ZONE
);

-- Flags table
CREATE TABLE IF NOT EXISTS flags (
  flag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  submission_id UUID NOT NULL,
  flagged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  note TEXT -- optional note the user can add when flagging a question
);

-- ==========================
-- Foreign Key Constraints
-- ==========================

ALTER TABLE exams
  ADD CONSTRAINT fk_exams_teacher
  FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE questions
  ADD CONSTRAINT fk_questions_exam
  FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE;

ALTER TABLE choices
  ADD CONSTRAINT fk_choices_question
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE;

ALTER TABLE coding_test_cases
  ADD CONSTRAINT fk_coding_test_cases_question
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE;

ALTER TABLE submissions
  ADD CONSTRAINT fk_submissions_exam
  FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE;

ALTER TABLE submissions
  ADD CONSTRAINT fk_submissions_user
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE answers
  ADD CONSTRAINT fk_answers_submission
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE;

ALTER TABLE answers
  ADD CONSTRAINT fk_answers_question
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE;

ALTER TABLE answers
  ADD CONSTRAINT fk_answers_graded_by
  FOREIGN KEY (graded_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE flags
  ADD CONSTRAINT fk_flags_user
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE flags
  ADD CONSTRAINT fk_flags_question
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE;

ALTER TABLE flags
  ADD CONSTRAINT fk_flags_submission
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE;

-- ==========================
-- Indexes for Performance
-- ==========================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX idx_exams_access_code ON exams(access_code);
CREATE INDEX idx_exams_start_at ON exams(start_at);
CREATE INDEX idx_exams_end_at ON exams(end_at);

CREATE INDEX idx_questions_exam_id ON questions(exam_id);

CREATE INDEX idx_choices_question_id ON choices(question_id);

CREATE INDEX idx_coding_test_cases_question_id ON coding_test_cases(question_id);

CREATE INDEX idx_submissions_exam_id ON submissions(exam_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);

CREATE INDEX idx_answers_submission_id ON answers(submission_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

CREATE INDEX idx_flags_user_id ON flags(user_id);
CREATE INDEX idx_flags_question_id ON flags(question_id);
CREATE INDEX idx_flags_submission_id ON flags(submission_id);

-- ==========================
-- Comments
-- ==========================

COMMENT ON TABLE users IS 'Stores user information for students, teachers, and administrators';
COMMENT ON TABLE exams IS 'Stores exam metadata created by teachers';
COMMENT ON TABLE questions IS 'Stores questions belonging to exams';
COMMENT ON TABLE choices IS 'Stores multiple choice options for questions';
COMMENT ON TABLE coding_test_cases IS 'Stores test cases for coding questions';
COMMENT ON TABLE submissions IS 'Stores student exam submissions';
COMMENT ON TABLE answers IS 'Stores student answers for each question in a submission';
COMMENT ON TABLE flags IS 'Stores flagged questions by students during exams';
