export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export enum ExamType {
  STANDARD = 'standard',
  CODING = 'coding',
}

export enum QuestionType {
  ESSAY = 'essay',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  CODING = 'coding',
}

export enum ProgrammingLanguage {
  CPP = 'c++',
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  JAVA = 'java',
}

export enum AttemptStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  OVERDUE = 'overdue',
  GRADED = 'graded',
}
