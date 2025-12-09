import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from '../questions/entities/question.entity';
import { Choice } from '../choices/entities/choice.entity';
import { CodingTestCase } from '../coding-test-cases/entities/coding-test-case.entity';
import { Flag } from '../flags/entities/flag.entity';
import { Attempt } from '../attempts/entities/attempt.entity';
import { Answer } from '../answers/entities/answer.entity';
import {
  ExamType,
  QuestionType,
  ProgrammingLanguage,
  UserRole,
  AttemptStatus,
} from '../../common/enum';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
    @InjectRepository(CodingTestCase)
    private readonly codingTestCaseRepository: Repository<CodingTestCase>,
    @InjectRepository(Flag)
    private readonly flagRepository: Repository<Flag>,
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  /**
   * Clear all data from database
   */
  async clearDatabase(): Promise<{ message: string }> {
    this.logger.warn('Clearing all database tables...');

    // Use query builder to delete with CASCADE to handle foreign keys
    const queryRunner =
      this.flagRepository.manager.connection.createQueryRunner();

    try {
      await queryRunner.query('DELETE FROM flags');
      await queryRunner.query('DELETE FROM answers');
      await queryRunner.query('DELETE FROM attempts');
      await queryRunner.query('DELETE FROM coding_test_cases');
      await queryRunner.query('DELETE FROM choices');
      await queryRunner.query('DELETE FROM questions');
      await queryRunner.query('DELETE FROM exams');
      await queryRunner.query('DELETE FROM users');

      this.logger.log('Database cleared successfully');
      return { message: 'Database cleared successfully' };
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Seed initial data
   */
  async seedDatabase(): Promise<{ message: string; data: any }> {
    this.logger.log('Seeding database...');

    // Get current date for relative date calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Create Admin User
    const admin = this.userRepository.create({
      email: 'thanhnc.sg.americanstudy@gmail.com',
      username: 'thanhnc',
      full_name: 'Nguyễn Công Thành',
      school_name: 'IT ACADEMY',
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(admin);

    this.logger.log('Admin user created');

    // 2. Create 5 Student Users
    const student1 = this.userRepository.create({
      email: 'student1@example.com',
      username: 'student1',
      full_name: 'Trần Văn An',
      school_name: 'National High School',
      class_name: 'Class A',
      role: UserRole.STUDENT,
      photo_url:
        'https://as1.ftcdn.net/jpg/01/81/01/66/1000_F_181016624_jg6E1C5xIKjNiitl6RwsF6EzY9y9wrBV.jpg',
      dob: new Date(today.getFullYear() - 20, 4, 15),
    });
    const student2 = this.userRepository.create({
      email: 'student2@example.com',
      username: 'student2',
      full_name: 'Lê Thị Bình',
      school_name: 'National High School',
      class_name: 'Class A',
      role: UserRole.STUDENT,
      photo_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4At4PYMhG1JEetHoyeY9GUV9SgZjYC2is0g&s',
      dob: new Date(today.getFullYear() - 20, 5, 20),
    });
    const student3 = this.userRepository.create({
      email: 'student3@example.com',
      username: 'student3',
      full_name: 'Phạm Minh Cường',
      school_name: 'National High School',
      class_name: 'Class B',
      role: UserRole.STUDENT,
      photo_url:
        'https://media.istockphoto.com/id/1438185814/photo/college-student-asian-man-and-studying-on-laptop-at-campus-research-and-education-test-exam.jpg?s=612x612&w=0&k=20&c=YmnXshbaBxyRc4Nj43_hLdLD5FLPTbP0p_3-uC7sjik=',
      dob: new Date(today.getFullYear() - 20, 6, 10),
    });
    const student4 = this.userRepository.create({
      email: 'student4@example.com',
      username: 'student4',
      full_name: 'Hoàng Thu Dung',
      school_name: 'National High School',
      class_name: 'Class B',
      role: UserRole.STUDENT,
      photo_url:
        'https://img.freepik.com/free-photo/people-traveling-without-covid-worries_23-2149051623.jpg?semt=ais_hybrid&w=740&q=80',
      dob: new Date(today.getFullYear() - 20, 7, 25),
    });
    const student5 = this.userRepository.create({
      email: 'student5@example.com',
      username: 'student5',
      full_name: 'Ngô Quang Đạt',
      school_name: 'National High School',
      class_name: 'Class A',
      role: UserRole.STUDENT,
      photo_url:
        'https://as1.ftcdn.net/jpg/01/62/11/66/1000_F_162116623_tA4TIrSHxeEdTvcYSV6Y86TxcbzmYSiI.jpg',
      dob: new Date(today.getFullYear() - 20, 8, 30),
    });
    const student6 = this.userRepository.create({
      email: 'student6@example.com',
      username: 'student6',
      full_name: 'Vũ Thị Hà',
      school_name: 'National High School',
      class_name: 'Class B',
      role: UserRole.STUDENT,
      photo_url:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      dob: new Date(today.getFullYear() - 20, 3, 12),
    });
    const student7 = this.userRepository.create({
      email: 'student7@example.com',
      username: 'student7',
      full_name: 'Đặng Văn Hùng',
      school_name: 'National High School',
      class_name: 'Class A',
      role: UserRole.STUDENT,
      photo_url:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      dob: new Date(today.getFullYear() - 20, 10, 8),
    });
    const student8 = this.userRepository.create({
      email: 'student8@example.com',
      username: 'student8',
      full_name: 'Bùi Thị Lan',
      school_name: 'National High School',
      class_name: 'Class B',
      role: UserRole.STUDENT,
      photo_url:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      dob: new Date(today.getFullYear() - 20, 2, 22),
    });
    const student9 = this.userRepository.create({
      email: 'student9@example.com',
      username: 'student9',
      full_name: 'Lý Minh Khang',
      school_name: 'National High School',
      class_name: 'Class A',
      role: UserRole.STUDENT,
      photo_url:
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      dob: new Date(today.getFullYear() - 20, 11, 15),
    });
    const student10 = this.userRepository.create({
      email: 'student10@example.com',
      username: 'student10',
      full_name: 'Trương Thị Mai',
      school_name: 'National High School',
      class_name: 'Class B',
      role: UserRole.STUDENT,
      photo_url:
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      dob: new Date(today.getFullYear() - 20, 1, 28),
    });
    await this.userRepository.save([
      student1,
      student2,
      student3,
      student4,
      student5,
      student6,
      student7,
      student8,
      student9,
      student10,
    ]);

    this.logger.log('10 student users created');

    // 3. Create Standard Exams with Questions

    // Exam 1: Mathematics Basics (completed - 5 days ago)
    const mathExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Mathematics Fundamentals',
      description: 'Basic mathematics concepts and problem solving',
      type: ExamType.STANDARD,
      access_code: 'MATH101',
      start_at: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      end_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
      ), // 5 days ago + 2 hours
      duration_minutes: 90,
      results_released: false,
    });

    // Math Questions
    const mathQ1 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'What is 15 + 27?',
      points: 5,
      order: 1,
    });

    const mathQ1Choices = await this.choiceRepository.save([
      { question_id: mathQ1.question_id, choice_text: '32' },
      { question_id: mathQ1.question_id, choice_text: '42' },
      { question_id: mathQ1.question_id, choice_text: '52' },
      { question_id: mathQ1.question_id, choice_text: '62' },
    ]);

    await this.questionRepository.update(mathQ1.question_id, {
      correct_answer: [mathQ1Choices[1].choice_id],
    });

    const mathQ2 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.MULTIPLE_CHOICE,
      question_text: 'Which of the following are prime numbers?',
      points: 10,
      order: 2,
    });

    const mathQ2Choices = await this.choiceRepository.save([
      { question_id: mathQ2.question_id, choice_text: '2' },
      { question_id: mathQ2.question_id, choice_text: '4' },
      { question_id: mathQ2.question_id, choice_text: '7' },
      { question_id: mathQ2.question_id, choice_text: '9' },
      { question_id: mathQ2.question_id, choice_text: '11' },
    ]);

    await this.questionRepository.update(mathQ2.question_id, {
      correct_answer: [
        mathQ2Choices[0].choice_id,
        mathQ2Choices[2].choice_id,
        mathQ2Choices[4].choice_id,
      ],
    });

    const mathQ3 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.SHORT_ANSWER,
      question_text: 'What is the square root of 144?',
      points: 5,
      order: 3,
      correct_answer_text: ['12'],
    });

    const mathQ4 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'What is the value of π (pi) to 2 decimal places?',
      points: 5,
      order: 4,
    });

    const mathQ4Choices = await this.choiceRepository.save([
      { question_id: mathQ4.question_id, choice_text: '3.12' },
      { question_id: mathQ4.question_id, choice_text: '3.14' },
      { question_id: mathQ4.question_id, choice_text: '3.16' },
      { question_id: mathQ4.question_id, choice_text: '3.18' },
    ]);

    await this.questionRepository.update(mathQ4.question_id, {
      correct_answer: [mathQ4Choices[1].choice_id],
    });

    const mathQ5 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.MULTIPLE_CHOICE,
      question_text: 'Which of these numbers are divisible by 3?',
      points: 10,
      order: 5,
    });

    const mathQ5Choices = await this.choiceRepository.save([
      { question_id: mathQ5.question_id, choice_text: '9' },
      { question_id: mathQ5.question_id, choice_text: '10' },
      { question_id: mathQ5.question_id, choice_text: '12' },
      { question_id: mathQ5.question_id, choice_text: '14' },
      { question_id: mathQ5.question_id, choice_text: '15' },
    ]);

    await this.questionRepository.update(mathQ5.question_id, {
      correct_answer: [
        mathQ5Choices[0].choice_id,
        mathQ5Choices[2].choice_id,
        mathQ5Choices[4].choice_id,
      ],
    });

    const mathQ6 = await this.questionRepository.save({
      exam_id: mathExam.exam_id,
      question_type: QuestionType.SHORT_ANSWER,
      question_text: 'If x + 5 = 12, what is x?',
      points: 5,
      order: 6,
      correct_answer_text: ['7'],
    });

    // Exam 2: English Grammar (completed - 3 days ago)
    const englishExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'English Grammar Test',
      description: 'Test your understanding of English grammar rules',
      type: ExamType.STANDARD,
      access_code: 'ENG201',
      start_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      end_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000,
      ), // 3 days ago + 1.5 hours
      duration_minutes: 60,
      results_released: false,
    });

    const engQ1 = await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'Choose the correct sentence:',
      points: 5,
      order: 1,
    });

    const engQ1Choices = await this.choiceRepository.save([
      { question_id: engQ1.question_id, choice_text: "She don't like apples." },
      {
        question_id: engQ1.question_id,
        choice_text: "She doesn't like apples.",
      },
      {
        question_id: engQ1.question_id,
        choice_text: "She don't likes apples.",
      },
      {
        question_id: engQ1.question_id,
        choice_text: "She doesn't likes apples.",
      },
    ]);

    await this.questionRepository.update(engQ1.question_id, {
      correct_answer: [engQ1Choices[1].choice_id],
    });

    const engQ2 = await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Write a short paragraph (100-150 words) describing your favorite hobby and why you enjoy it.',
      points: 20,
      order: 2,
    });

    const engQ3 = await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'Choose the correct form of "to be":',
      points: 5,
      order: 3,
    });

    const engQ3Choices = await this.choiceRepository.save([
      { question_id: engQ3.question_id, choice_text: 'They is happy.' },
      { question_id: engQ3.question_id, choice_text: 'They are happy.' },
      { question_id: engQ3.question_id, choice_text: 'They am happy.' },
      { question_id: engQ3.question_id, choice_text: 'They be happy.' },
    ]);

    await this.questionRepository.update(engQ3.question_id, {
      correct_answer: [engQ3Choices[1].choice_id],
    });

    const engQ4 = await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.MULTIPLE_CHOICE,
      question_text: 'Select all correct prepositions:',
      points: 10,
      order: 4,
    });

    const engQ4Choices = await this.choiceRepository.save([
      { question_id: engQ4.question_id, choice_text: 'in' },
      { question_id: engQ4.question_id, choice_text: 'quickly' },
      { question_id: engQ4.question_id, choice_text: 'on' },
      { question_id: engQ4.question_id, choice_text: 'happy' },
      { question_id: engQ4.question_id, choice_text: 'at' },
    ]);

    await this.questionRepository.update(engQ4.question_id, {
      correct_answer: [
        engQ4Choices[0].choice_id,
        engQ4Choices[2].choice_id,
        engQ4Choices[4].choice_id,
      ],
    });

    const engQ5 = await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.SHORT_ANSWER,
      question_text: 'What is the past tense of "go"?',
      points: 5,
      order: 5,
      correct_answer_text: ['went'],
    });

    // Exam 3: Science Quiz (ongoing - started 2 days ago, ends in 50 days)
    const scienceExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'General Science Knowledge',
      description: 'Test your knowledge of basic science concepts',
      type: ExamType.STANDARD,
      access_code: 'SCI101',
      start_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      end_at: new Date(today.getTime() + 50 * 24 * 60 * 60 * 1000), // 50 days from now
      duration_minutes: 45,
      results_released: false,
    });

    const sciQ1 = await this.questionRepository.save({
      exam_id: scienceExam.exam_id,
      question_type: QuestionType.MULTIPLE_CHOICE,
      question_text: 'Which of the following are states of matter?',
      points: 10,
      order: 1,
    });

    const sciQ1Choices = await this.choiceRepository.save([
      { question_id: sciQ1.question_id, choice_text: 'Solid' },
      { question_id: sciQ1.question_id, choice_text: 'Liquid' },
      { question_id: sciQ1.question_id, choice_text: 'Gas' },
      { question_id: sciQ1.question_id, choice_text: 'Energy' },
    ]);

    await this.questionRepository.update(sciQ1.question_id, {
      correct_answer: [
        sciQ1Choices[0].choice_id,
        sciQ1Choices[1].choice_id,
        sciQ1Choices[2].choice_id,
      ],
    });

    const sciQ2 = await this.questionRepository.save({
      exam_id: scienceExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'What is the chemical symbol for water?',
      points: 5,
      order: 2,
    });

    const sciQ2Choices = await this.choiceRepository.save([
      { question_id: sciQ2.question_id, choice_text: 'H2O' },
      { question_id: sciQ2.question_id, choice_text: 'O2' },
      { question_id: sciQ2.question_id, choice_text: 'CO2' },
      { question_id: sciQ2.question_id, choice_text: 'H2' },
    ]);

    await this.questionRepository.update(sciQ2.question_id, {
      correct_answer: [sciQ2Choices[0].choice_id],
    });

    const sciQ3 = await this.questionRepository.save({
      exam_id: scienceExam.exam_id,
      question_type: QuestionType.SHORT_ANSWER,
      question_text: 'How many planets are in our solar system?',
      points: 5,
      order: 3,
      correct_answer_text: ['8', 'eight'],
    });

    const sciQ4 = await this.questionRepository.save({
      exam_id: scienceExam.exam_id,
      question_type: QuestionType.SINGLE_CHOICE,
      question_text: 'Which organ pumps blood throughout the body?',
      points: 5,
      order: 4,
    });

    const sciQ4Choices = await this.choiceRepository.save([
      { question_id: sciQ4.question_id, choice_text: 'Brain' },
      { question_id: sciQ4.question_id, choice_text: 'Liver' },
      { question_id: sciQ4.question_id, choice_text: 'Heart' },
      { question_id: sciQ4.question_id, choice_text: 'Lungs' },
    ]);

    await this.questionRepository.update(sciQ4.question_id, {
      correct_answer: [sciQ4Choices[2].choice_id],
    });

    // 4. Create Coding Exams

    // Coding Exam 1: Basic Programming (ongoing - started 1 day ago, ends in 10 days)
    const codingExam1 = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Introduction to Programming',
      description: 'Basic programming exercises for beginners',
      type: ExamType.CODING,
      access_code: 'CODE101',
      start_at: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      end_at: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      duration_minutes: 90,
      results_released: false,
    });

    // Coding Question 1: Hello World
    const codeQ1 = await this.questionRepository.save({
      exam_id: codingExam1.exam_id,
      question_type: QuestionType.CODING,
      title: 'Hello World',
      question_text:
        'Write a program that reads a name from input and prints "Hello [name]". If no input is provided, print just "Hello".',
      points: 15,
      order: 1,
      programming_languages: [
        ProgrammingLanguage.JAVASCRIPT,
        ProgrammingLanguage.PYTHON,
        ProgrammingLanguage.CPP,
      ],
      coding_template: {
        javascript:
          "// Read input and print greeting\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin\n});\n\nlet input = '';\nrl.on('line', (line) => {\n  input = line;\n});\n\nrl.on('close', () => {\n  // Your code here\n});",
        python:
          '# Read input and print greeting\nimport sys\ninput_line = sys.stdin.read().strip()\n# Your code here',
        cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    getline(cin, name);\n    // Your code here\n    return 0;\n}',
      },
    });

    await this.codingTestCaseRepository.save([
      {
        question_id: codeQ1.question_id,
        input_data: '',
        expected_output: 'Hello',
        is_hidden: false,
      },
      {
        question_id: codeQ1.question_id,
        input_data: 'World',
        expected_output: 'Hello World',
        is_hidden: false,
      },
      {
        question_id: codeQ1.question_id,
        input_data: 'Alice',
        expected_output: 'Hello Alice',
        is_hidden: true,
      },
    ]);

    // Coding Question 2: Sum Two Numbers
    const codeQ2 = await this.questionRepository.save({
      exam_id: codingExam1.exam_id,
      question_type: QuestionType.CODING,
      title: 'Add Two Numbers',
      question_text:
        'Write a program that reads two integers from input (one per line) and prints their sum.',
      points: 20,
      order: 2,
      programming_languages: [
        ProgrammingLanguage.JAVASCRIPT,
        ProgrammingLanguage.PYTHON,
        ProgrammingLanguage.CPP,
      ],
      coding_template: {
        javascript:
          "// Read two numbers and print their sum\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin\n});\n\nconst numbers = [];\nrl.on('line', (line) => {\n  numbers.push(parseInt(line));\n});\n\nrl.on('close', () => {\n  // Your code here\n});",
        python:
          '# Read two numbers and print their sum\nimport sys\nlines = sys.stdin.readlines()\n# Your code here',
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Your code here\n    return 0;\n}',
      },
    });

    await this.codingTestCaseRepository.save([
      {
        question_id: codeQ2.question_id,
        input_data: '5\n3',
        expected_output: '8',
        is_hidden: false,
      },
      {
        question_id: codeQ2.question_id,
        input_data: '10\n20',
        expected_output: '30',
        is_hidden: false,
      },
      {
        question_id: codeQ2.question_id,
        input_data: '-5\n5',
        expected_output: '0',
        is_hidden: true,
      },
      {
        question_id: codeQ2.question_id,
        input_data: '100\n200',
        expected_output: '300',
        is_hidden: true,
      },
    ]);

    // Coding Exam 2: Algorithm Challenge (future - starts in 3 days)
    const codingExam2 = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Algorithm and Data Structures',
      description: 'Intermediate level coding challenges',
      type: ExamType.CODING,
      access_code: 'ALGO202',
      start_at: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end_at: new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
      ), // 3 days from now + 3 hours
      duration_minutes: 120,
      results_released: false,
    });

    // Coding Question 3: Find Maximum
    const codeQ3 = await this.questionRepository.save({
      exam_id: codingExam2.exam_id,
      question_type: QuestionType.CODING,
      title: 'Find Maximum Number',
      question_text:
        'Write a program that reads N integers from input (first line is N, followed by N numbers) and prints the maximum number.',
      points: 25,
      order: 1,
      programming_languages: [
        ProgrammingLanguage.JAVASCRIPT,
        ProgrammingLanguage.PYTHON,
        ProgrammingLanguage.CPP,
      ],
      coding_template: {
        javascript:
          "// Find maximum number\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin\n});\n\nconst lines = [];\nrl.on('line', (line) => {\n  lines.push(line);\n});\n\nrl.on('close', () => {\n  const n = parseInt(lines[0]);\n  const numbers = lines.slice(1, n + 1).map(x => parseInt(x));\n  // Your code here\n});",
        python:
          '# Find maximum number\nimport sys\nlines = sys.stdin.readlines()\nn = int(lines[0])\nnumbers = [int(lines[i]) for i in range(1, n + 1)]\n# Your code here',
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int numbers[n];\n    for (int i = 0; i < n; i++) {\n        cin >> numbers[i];\n    }\n    // Your code here\n    return 0;\n}',
      },
    });

    await this.codingTestCaseRepository.save([
      {
        question_id: codeQ3.question_id,
        input_data: '5\n3\n7\n2\n9\n4',
        expected_output: '9',
        is_hidden: false,
      },
      {
        question_id: codeQ3.question_id,
        input_data: '3\n-5\n-2\n-10',
        expected_output: '-2',
        is_hidden: false,
      },
      {
        question_id: codeQ3.question_id,
        input_data: '1\n42',
        expected_output: '42',
        is_hidden: true,
      },
    ]);

    // Coding Question 4: Palindrome Check
    const codeQ4 = await this.questionRepository.save({
      exam_id: codingExam2.exam_id,
      question_type: QuestionType.CODING,
      title: 'Check Palindrome',
      question_text:
        'Write a program that reads a string and prints "YES" if it is a palindrome (reads the same forwards and backwards), otherwise prints "NO". Ignore case sensitivity.',
      points: 30,
      order: 2,
      programming_languages: [
        ProgrammingLanguage.JAVASCRIPT,
        ProgrammingLanguage.PYTHON,
        ProgrammingLanguage.CPP,
      ],
      coding_template: {
        javascript:
          "// Check if string is palindrome\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin\n});\n\nlet input = '';\nrl.on('line', (line) => {\n  input = line;\n});\n\nrl.on('close', () => {\n  // Your code here\n});",
        python:
          '# Check if string is palindrome\nimport sys\ninput_str = sys.stdin.read().strip()\n# Your code here',
        cpp: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string str;\n    getline(cin, str);\n    // Your code here\n    return 0;\n}',
      },
    });

    await this.codingTestCaseRepository.save([
      {
        question_id: codeQ4.question_id,
        input_data: 'racecar',
        expected_output: 'YES',
        is_hidden: false,
      },
      {
        question_id: codeQ4.question_id,
        input_data: 'hello',
        expected_output: 'NO',
        is_hidden: false,
      },
      {
        question_id: codeQ4.question_id,
        input_data: 'Madam',
        expected_output: 'YES',
        is_hidden: true,
      },
      {
        question_id: codeQ4.question_id,
        input_data: 'A man a plan a canal Panama',
        expected_output: 'NO',
        is_hidden: true,
      },
    ]);

    // Essay-only Exam 1: Literature Analysis (future - starts in 5 days)
    const literatureExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Literature Analysis Essays',
      description: 'Write analytical essays on various literary topics',
      type: ExamType.STANDARD,
      access_code: 'LIT301',
      start_at: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      end_at: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
      ), // 5 days from now + 3 hours
      duration_minutes: 120,
      results_released: false,
    });

    const litQ1 = await this.questionRepository.save({
      exam_id: literatureExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Analyze the theme of friendship in your favorite novel. Discuss how the author develops this theme through characters and plot. (200-300 words)',
      points: 30,
      order: 1,
    });

    const litQ2 = await this.questionRepository.save({
      exam_id: literatureExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Compare and contrast two different genres of literature (e.g., poetry vs prose). What are the unique characteristics of each? (200-300 words)',
      points: 30,
      order: 2,
    });

    const litQ3 = await this.questionRepository.save({
      exam_id: literatureExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Discuss the importance of setting in storytelling. Provide examples from books you have read. (150-200 words)',
      points: 20,
      order: 3,
    });

    // Essay-only Exam 2: Critical Thinking (future - starts in 7 days)
    const criticalThinkingExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Critical Thinking Essays',
      description: 'Essays on various philosophical and ethical questions',
      type: ExamType.STANDARD,
      access_code: 'CRIT401',
      start_at: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      end_at: new Date(
        today.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
      ), // 7 days from now + 3 hours
      duration_minutes: 150,
      results_released: false,
    });

    const critQ1 = await this.questionRepository.save({
      exam_id: criticalThinkingExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Is technology making us more or less connected to each other? Defend your position with specific examples. (250-350 words)',
      points: 35,
      order: 1,
    });

    const critQ2 = await this.questionRepository.save({
      exam_id: criticalThinkingExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Discuss the role of education in modern society. What changes would you suggest to improve the current education system? (250-350 words)',
      points: 35,
      order: 2,
    });

    const critQ3 = await this.questionRepository.save({
      exam_id: criticalThinkingExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Should artificial intelligence be regulated? Explain the potential benefits and risks. (200-250 words)',
      points: 30,
      order: 3,
    });

    // Essay-only Exam 3: History Reflection (future - starts in 10 days)
    const historyExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Historical Reflections',
      description: 'Reflective essays on historical events and their impact',
      type: ExamType.STANDARD,
      access_code: 'HIST201',
      start_at: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      end_at: new Date(
        today.getTime() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
      ), // 10 days from now + 3 hours
      duration_minutes: 120,
      results_released: false,
    });

    const histQ1 = await this.questionRepository.save({
      exam_id: historyExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Discuss the impact of the Industrial Revolution on modern society. What were the major changes it brought? (250-300 words)',
      points: 35,
      order: 1,
    });

    const histQ2 = await this.questionRepository.save({
      exam_id: historyExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Analyze how a historical figure of your choice influenced their era. What lessons can we learn from them today? (200-250 words)',
      points: 30,
      order: 2,
    });

    const histQ3 = await this.questionRepository.save({
      exam_id: historyExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'What role did technological innovations play in shaping 20th century history? Provide specific examples. (200-250 words)',
      points: 35,
      order: 3,
    });

    this.logger.log('Exams and questions created');

    // 5. Create Attempts and Answers

    // Student 1: Attempted Math and English exams
    const attempt1 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student1.user_id,
      started_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      ), // 5 days ago + 5 min
      submitted_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000,
      ), // 5 days ago + 90 min
      status: AttemptStatus.GRADED,
      total_score: 15, // 5 + 10 + 0 (short answer wrong)
      cheated: false,
    });

    // Answers for Math Exam
    await this.answerRepository.save([
      {
        attempt_id: attempt1.attempt_id,
        question_id: mathQ1.question_id,
        selected_choices: [mathQ1Choices[1].choice_id], // Correct
        score: 5,
      },
      {
        attempt_id: attempt1.attempt_id,
        question_id: mathQ2.question_id,
        selected_choices: [
          mathQ2Choices[0].choice_id,
          mathQ2Choices[2].choice_id,
          mathQ2Choices[4].choice_id,
        ], // Correct
        score: 10,
      },
      {
        attempt_id: attempt1.attempt_id,
        question_id: mathQ3.question_id,
        answer_text: '14', // Wrong
        score: 0,
      },
    ]);

    const attempt2 = await this.attemptRepository.save({
      exam_id: englishExam.exam_id,
      user_id: student1.user_id,
      started_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000,
      ), // 3 days ago + 10 min
      submitted_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 65 * 60 * 1000,
      ), // 3 days ago + 65 min
      status: AttemptStatus.SUBMITTED,
      total_score: 5, // Only choice graded, essay not graded
      cheated: true,
    });

    // Answers for English Exam
    const engEssayQ = await this.questionRepository.findOne({
      where: {
        exam_id: englishExam.exam_id,
        question_type: QuestionType.ESSAY,
      },
    });
    if (!engEssayQ) throw new Error('Essay question not found');

    await this.answerRepository.save([
      {
        attempt_id: attempt2.attempt_id,
        question_id: engQ1.question_id,
        selected_choices: [engQ1Choices[1].choice_id], // Correct
        score: 5,
      },
      {
        attempt_id: attempt2.attempt_id,
        question_id: engEssayQ.question_id,
        answer_text:
          'My favorite hobby is reading books. I enjoy reading because it allows me to explore different worlds and learn new things. Books help me relax and escape from the daily stress of life. I particularly like mystery novels because they keep me engaged and guessing until the end.',
        // score: null, // Not graded yet
      },
    ]);

    // Student 2: Attempted Science and Coding1
    const attempt3 = await this.attemptRepository.save({
      exam_id: scienceExam.exam_id,
      user_id: student2.user_id,
      started_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      ), // 2 days ago + 5 min
      status: AttemptStatus.NOT_STARTED,
      cheated: false,
    });

    // Answers for Science Exam (partial)
    await this.answerRepository.save([
      {
        attempt_id: attempt3.attempt_id,
        question_id: sciQ1.question_id,
        selected_choices: [
          sciQ1Choices[0].choice_id,
          sciQ1Choices[1].choice_id,
          sciQ1Choices[2].choice_id,
        ], // Correct
        // score: null, // Not submitted yet
      },
    ]);

    const attempt4 = await this.attemptRepository.save({
      exam_id: codingExam1.exam_id,
      user_id: student2.user_id,
      started_at: new Date(
        today.getTime() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000,
      ), // 1 day ago + 10 min
      submitted_at: new Date(
        today.getTime() - 1 * 24 * 60 * 60 * 1000 + 95 * 60 * 1000,
      ), // 1 day ago + 95 min
      status: AttemptStatus.GRADED,
      total_score: 25, // 15 + 10 (partial for sum)
      cheated: true,
    });

    // Answers for Coding Exam 1
    await this.answerRepository.save([
      {
        attempt_id: attempt4.attempt_id,
        question_id: codeQ1.question_id,
        answer_text: 'console.log("Hello " + (input || ""));', // JS code
        score: 15,
      },
      {
        attempt_id: attempt4.attempt_id,
        question_id: codeQ2.question_id,
        answer_text: 'print(int(lines[0]) + int(lines[1]))', // Python code, partial
        score: 10,
      },
    ]);

    // Student 3: Attempted Math and Coding2
    const attempt5 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student3.user_id,
      started_at: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      submitted_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 105 * 60 * 1000,
      ), // 5 days ago + 105 min
      status: AttemptStatus.GRADED,
      total_score: 20, // Full score
      cheated: false,
    });

    // Answers for Math Exam (all correct)
    await this.answerRepository.save([
      {
        attempt_id: attempt5.attempt_id,
        question_id: mathQ1.question_id,
        selected_choices: [mathQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt5.attempt_id,
        question_id: mathQ2.question_id,
        selected_choices: [
          mathQ2Choices[0].choice_id,
          mathQ2Choices[2].choice_id,
          mathQ2Choices[4].choice_id,
        ],
        score: 10,
      },
      {
        attempt_id: attempt5.attempt_id,
        question_id: mathQ3.question_id,
        answer_text: '12',
        score: 5,
      },
    ]);

    const attempt6 = await this.attemptRepository.save({
      exam_id: codingExam2.exam_id,
      user_id: student3.user_id,
      started_at: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: AttemptStatus.OVERDUE,
      cheated: false,
    });

    // No answers for overdue attempt

    // Student 4: Attempted English and Science
    const attempt7 = await this.attemptRepository.save({
      exam_id: englishExam.exam_id,
      user_id: student4.user_id,
      started_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      submitted_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 80 * 60 * 1000,
      ), // 3 days ago + 80 min
      status: AttemptStatus.SUBMITTED,
      total_score: 5, // 5
      cheated: true,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt7.attempt_id,
        question_id: engQ1.question_id,
        selected_choices: [engQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt7.attempt_id,
        question_id: engEssayQ.question_id,
        answer_text:
          'Playing soccer is my passion. I love the feeling of running on the field, the teamwork with my friends, and the excitement of scoring goals. It keeps me fit and teaches me important life skills like cooperation and perseverance. Every weekend, I look forward to our local matches.',
      },
    ]);

    const attempt8 = await this.attemptRepository.save({
      exam_id: scienceExam.exam_id,
      user_id: student4.user_id,
      started_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      submitted_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000,
      ), // 2 days ago + 50 min
      status: AttemptStatus.SUBMITTED,
      total_score: 10,
      cheated: true,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt8.attempt_id,
        question_id: sciQ1.question_id,
        selected_choices: [
          sciQ1Choices[0].choice_id,
          sciQ1Choices[1].choice_id,
          sciQ1Choices[2].choice_id,
        ],
        score: 10,
      },
    ]);

    // Student 5: Not started Coding1
    const attempt9 = await this.attemptRepository.save({
      exam_id: codingExam1.exam_id,
      user_id: student5.user_id,
      status: AttemptStatus.NOT_STARTED,
      cheated: false,
    });

    // Student 5: Attempted Math Exam (graded)
    const attempt10 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student5.user_id,
      started_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000,
      ), // 5 days ago + 15 min
      submitted_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 80 * 60 * 1000,
      ), // 5 days ago + 80 min
      status: AttemptStatus.GRADED,
      total_score: 10, // Partial score
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt10.attempt_id,
        question_id: mathQ1.question_id,
        selected_choices: [mathQ1Choices[0].choice_id], // Wrong
        score: 0,
      },
      {
        attempt_id: attempt10.attempt_id,
        question_id: mathQ2.question_id,
        selected_choices: [
          mathQ2Choices[0].choice_id,
          mathQ2Choices[2].choice_id,
        ], // Partial
        score: 5,
      },
      {
        attempt_id: attempt10.attempt_id,
        question_id: mathQ3.question_id,
        answer_text: '12',
        score: 5,
      },
      {
        attempt_id: attempt10.attempt_id,
        question_id: mathQ4.question_id,
        selected_choices: [mathQ4Choices[1].choice_id],
        score: 0, // Not answered
      },
    ]);

    // Student 6: Attempted Literature Exam (submitted, not graded)
    const attempt11 = await this.attemptRepository.save({
      exam_id: literatureExam.exam_id,
      user_id: student6.user_id,
      started_at: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      ), // 5 days from now + 5 min
      submitted_at: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000 + 145 * 60 * 1000,
      ), // 5 days from now + 145 min
      status: AttemptStatus.SUBMITTED,
      total_score: 0,
      cheated: true,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt11.attempt_id,
        question_id: litQ1.question_id,
        answer_text:
          'In "Harry Potter," friendship is a central theme that drives the entire narrative. The bond between Harry, Ron, and Hermione demonstrates how true friendship involves loyalty, sacrifice, and mutual support. J.K. Rowling develops this theme by showing how the trio faces numerous challenges together, from fighting trolls to defeating dark wizards. Their friendship is tested repeatedly, yet it grows stronger with each trial. The author uses dialogue and actions to reveal the depth of their connection. For instance, Ron and Hermione risk their lives multiple times to protect Harry. The friendship theme is also contrasted with negative relationships, like Draco Malfoy\'s shallow connections based on power rather than genuine care.',
      },
      {
        attempt_id: attempt11.attempt_id,
        question_id: litQ2.question_id,
        answer_text:
          'Poetry and prose represent two distinct forms of literary expression. Poetry is characterized by its use of verse, rhythm, and often rhyme, with condensed language that evokes emotion and imagery in compact forms. Prose, on the other hand, follows natural speech patterns and is written in sentences and paragraphs. Poetry allows for more abstract expression and interpretation, while prose typically offers clearer narratives and detailed descriptions. Both have their strengths: poetry excels at capturing moments and emotions intensely, while prose provides space for complex character development and plot. Despite their differences, both genres share the goal of communicating human experiences and ideas through carefully chosen words.',
      },
      {
        attempt_id: attempt11.attempt_id,
        question_id: litQ3.question_id,
        answer_text:
          'Setting plays a crucial role in storytelling by establishing atmosphere, influencing characters, and advancing the plot. In "The Great Gatsby," the contrast between West Egg and East Egg reflects class divisions. In "Lord of the Flies," the isolated island becomes both paradise and prison, shaping the boys\' descent into savagery. Settings can act as characters themselves, like the moors in "Wuthering Heights," or serve as metaphors for internal states.',
      },
    ]);

    // Student 7: Attempted English Exam (submitted, not graded)
    const attempt12 = await this.attemptRepository.save({
      exam_id: englishExam.exam_id,
      user_id: student7.user_id,
      started_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      ), // 3 days ago + 5 min
      submitted_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 85 * 60 * 1000,
      ), // 3 days ago + 85 min
      status: AttemptStatus.SUBMITTED,
      total_score: 15, // Only multiple choice graded
      cheated: true,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt12.attempt_id,
        question_id: engQ1.question_id,
        selected_choices: [engQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt12.attempt_id,
        question_id: engQ2.question_id,
        answer_text:
          'Photography is my greatest passion. I love capturing moments and telling stories through images. It allows me to see the world differently and appreciate small details. When I photograph landscapes, I feel connected to nature. Portrait photography helps me understand people better. Each photo is like preserving a memory forever. The technical aspects challenge me to improve constantly.',
      },
      {
        attempt_id: attempt12.attempt_id,
        question_id: engQ3.question_id,
        selected_choices: [engQ3Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt12.attempt_id,
        question_id: engQ4.question_id,
        selected_choices: [
          engQ4Choices[0].choice_id,
          engQ4Choices[2].choice_id,
          engQ4Choices[4].choice_id,
        ],
        score: 5,
      },
      {
        attempt_id: attempt12.attempt_id,
        question_id: engQ5.question_id,
        answer_text: 'went',
        score: 0, // Not graded yet
      },
    ]);

    // Student 8: Attempted Critical Thinking Exam (submitted, not graded)
    const attempt13 = await this.attemptRepository.save({
      exam_id: criticalThinkingExam.exam_id,
      user_id: student8.user_id,
      started_at: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      submitted_at: new Date(
        today.getTime() + 7 * 24 * 60 * 60 * 1000 + 165 * 60 * 1000,
      ), // 7 days from now + 165 min
      status: AttemptStatus.SUBMITTED,
      total_score: 0,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt13.attempt_id,
        question_id: critQ1.question_id,
        answer_text:
          'Technology has created a paradox in human connectivity. While we have unprecedented ability to communicate across distances, many argue we are becoming less genuinely connected. Social media platforms allow us to maintain hundreds of "friendships," yet these connections often lack depth. We can video chat with someone on another continent, but we might ignore the person sitting next to us. However, technology also enables meaningful connections that would otherwise be impossible. Long-distance relationships can thrive through video calls. Online communities bring together people with rare interests or conditions. During the pandemic, technology kept us connected when physical proximity was dangerous. The key is how we use technology. If we treat it as a tool to enhance real relationships rather than replace them, it can make us more connected. But if we hide behind screens instead of engaging authentically, it isolates us.',
      },
      {
        attempt_id: attempt13.attempt_id,
        question_id: critQ2.question_id,
        answer_text:
          "Education serves as the foundation for individual growth and societal progress. It equips people with knowledge, critical thinking skills, and the ability to adapt to changing circumstances. In modern society, education determines economic opportunities and social mobility. However, current systems face challenges including outdated curricula, standardized testing pressure, and inequality in access to quality education. To improve education, we should emphasize critical thinking over memorization, incorporate more practical skills, personalize learning to individual needs, reduce the focus on standardized testing, provide better teacher training and compensation, and ensure equal access regardless of socioeconomic background. Technology should enhance learning, not replace human interaction. We need to prepare students for jobs that don't exist yet by teaching adaptability and continuous learning.",
      },
      {
        attempt_id: attempt13.attempt_id,
        question_id: critQ3.question_id,
        answer_text:
          'Artificial intelligence regulation is essential to maximize benefits while minimizing risks. AI offers tremendous potential in healthcare, education, and efficiency. It can diagnose diseases, personalize learning, and solve complex problems. However, unregulated AI poses serious risks including privacy violations, bias amplification, job displacement, and potential misuse. Regulation should establish ethical guidelines, ensure transparency in decision-making algorithms, protect individual privacy and data rights, prevent discriminatory outcomes, and require human oversight for critical decisions. The challenge is creating flexible regulations that encourage innovation while protecting society.',
      },
    ]);

    // Student 9: Attempted Science Exam (graded)
    const attempt14 = await this.attemptRepository.save({
      exam_id: scienceExam.exam_id,
      user_id: student9.user_id,
      started_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      submitted_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000,
      ), // 2 days ago + 40 min
      status: AttemptStatus.GRADED,
      total_score: 20, // Partial score
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt14.attempt_id,
        question_id: sciQ1.question_id,
        selected_choices: [
          sciQ1Choices[0].choice_id,
          sciQ1Choices[1].choice_id,
          sciQ1Choices[2].choice_id,
        ],
        score: 10,
      },
      {
        attempt_id: attempt14.attempt_id,
        question_id: sciQ2.question_id,
        selected_choices: [sciQ2Choices[0].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt14.attempt_id,
        question_id: sciQ3.question_id,
        answer_text: '8',
        score: 5,
      },
      {
        attempt_id: attempt14.attempt_id,
        question_id: sciQ4.question_id,
        selected_choices: [sciQ4Choices[2].choice_id],
        score: 0, // Wrong (not scored)
      },
    ]);

    // Student 10: Attempted History Exam (submitted, not graded)
    const attempt15 = await this.attemptRepository.save({
      exam_id: historyExam.exam_id,
      user_id: student10.user_id,
      started_at: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      submitted_at: new Date(
        today.getTime() + 10 * 24 * 60 * 60 * 1000 + 150 * 60 * 1000,
      ), // 10 days from now + 150 min
      status: AttemptStatus.SUBMITTED,
      total_score: 0,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt15.attempt_id,
        question_id: histQ1.question_id,
        answer_text:
          'The Industrial Revolution fundamentally transformed human society in ways that still affect us today. Beginning in the late 18th century, it marked the shift from agrarian economies to industrial manufacturing. Major changes included urbanization as people moved from farms to cities for factory work, the rise of the middle class, new forms of labor organization, and rapid technological advancement. Steam engines, mechanized production, and new transportation systems revolutionized how goods were produced and distributed. However, it also brought challenges: poor working conditions, child labor, environmental pollution, and economic inequality. The Industrial Revolution established the foundation for modern capitalism and global trade. Its legacy includes both progress and ongoing social issues we still grapple with today.',
      },
      {
        attempt_id: attempt15.attempt_id,
        question_id: histQ2.question_id,
        answer_text:
          'Marie Curie profoundly influenced her era through groundbreaking scientific discoveries and by breaking gender barriers. As the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences, she inspired countless women to pursue scientific careers. Her research on radioactivity laid foundations for modern physics and medicine. Despite facing discrimination in male-dominated academia, she persevered and succeeded. Today, we learn from her dedication, curiosity, and courage to challenge societal limitations. Her life teaches us that talent and determination transcend gender and social barriers.',
      },
      {
        attempt_id: attempt15.attempt_id,
        question_id: histQ3.question_id,
        answer_text:
          "Technological innovations were pivotal in shaping 20th century history. The automobile transformed transportation, urban planning, and social mobility. Aviation connected continents and revolutionized warfare and commerce. Radio and television created mass media, influencing culture and politics. Nuclear technology brought both energy solutions and weapons of unprecedented destruction, defining Cold War tensions. Computers and the internet toward the century's end began the digital revolution. Medical technologies like antibiotics and vaccines dramatically increased life expectancy. Each innovation created ripple effects across society, economy, and politics.",
      },
    ]);

    // Student 6: Attempted Math Exam (graded)
    const attempt16 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student6.user_id,
      started_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000,
      ), // 5 days ago + 10 min
      submitted_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 95 * 60 * 1000,
      ), // 5 days ago + 95 min
      status: AttemptStatus.GRADED,
      total_score: 25,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ1.question_id,
        selected_choices: [mathQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ2.question_id,
        selected_choices: [
          mathQ2Choices[0].choice_id,
          mathQ2Choices[2].choice_id,
        ], // Partial
        score: 5,
      },
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ3.question_id,
        answer_text: '12',
        score: 5,
      },
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ4.question_id,
        selected_choices: [mathQ4Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ5.question_id,
        selected_choices: [
          mathQ5Choices[0].choice_id,
          mathQ5Choices[2].choice_id,
          mathQ5Choices[4].choice_id,
        ],
        score: 5,
      },
      {
        attempt_id: attempt16.attempt_id,
        question_id: mathQ6.question_id,
        answer_text: '7',
        score: 0, // Wrong (not scored correctly)
      },
    ]);

    // Student 7: Attempted Science Exam (graded)
    const attempt17 = await this.attemptRepository.save({
      exam_id: scienceExam.exam_id,
      user_id: student7.user_id,
      started_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      ), // 2 days ago + 5 min
      submitted_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
      ), // 2 days ago + 45 min
      status: AttemptStatus.GRADED,
      total_score: 25,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt17.attempt_id,
        question_id: sciQ1.question_id,
        selected_choices: [
          sciQ1Choices[0].choice_id,
          sciQ1Choices[1].choice_id,
          sciQ1Choices[2].choice_id,
        ],
        score: 10,
      },
      {
        attempt_id: attempt17.attempt_id,
        question_id: sciQ2.question_id,
        selected_choices: [sciQ2Choices[0].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt17.attempt_id,
        question_id: sciQ3.question_id,
        answer_text: 'eight',
        score: 5,
      },
      {
        attempt_id: attempt17.attempt_id,
        question_id: sciQ4.question_id,
        selected_choices: [sciQ4Choices[2].choice_id],
        score: 5,
      },
    ]);

    // Student 8: Attempted Math Exam (graded)
    const attempt18 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student8.user_id,
      started_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000,
      ), // 5 days ago + 20 min
      submitted_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000,
      ), // 5 days ago + 75 min
      status: AttemptStatus.GRADED,
      total_score: 15,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ1.question_id,
        selected_choices: [mathQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ2.question_id,
        selected_choices: [mathQ2Choices[0].choice_id], // Wrong
        score: 0,
      },
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ3.question_id,
        answer_text: '12',
        score: 5,
      },
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ4.question_id,
        selected_choices: [mathQ4Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ5.question_id,
        selected_choices: [mathQ5Choices[0].choice_id], // Partial
        score: 0,
      },
      {
        attempt_id: attempt18.attempt_id,
        question_id: mathQ6.question_id,
        answer_text: '7',
        score: 0, // Wrong
      },
    ]);

    // Student 9: Attempted English Exam (submitted, not graded)
    const attempt19 = await this.attemptRepository.save({
      exam_id: englishExam.exam_id,
      user_id: student9.user_id,
      started_at: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      submitted_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000 + 70 * 60 * 1000,
      ), // 3 days ago + 70 min
      status: AttemptStatus.SUBMITTED,
      total_score: 20, // Only multiple choice graded
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt19.attempt_id,
        question_id: engQ1.question_id,
        selected_choices: [engQ1Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt19.attempt_id,
        question_id: engQ2.question_id,
        answer_text:
          "Gaming is more than just entertainment for me; it's a way to connect with friends and challenge myself. I enjoy strategy games that require planning and quick thinking. Gaming helps me relax after studying and provides a sense of achievement when I complete difficult levels. I've made friends from different countries through online gaming communities. While some people criticize gaming, I believe it can develop problem-solving skills and teamwork abilities when played responsibly.",
      },
      {
        attempt_id: attempt19.attempt_id,
        question_id: engQ3.question_id,
        selected_choices: [engQ3Choices[1].choice_id],
        score: 5,
      },
      {
        attempt_id: attempt19.attempt_id,
        question_id: engQ4.question_id,
        selected_choices: [
          engQ4Choices[0].choice_id,
          engQ4Choices[2].choice_id,
          engQ4Choices[4].choice_id,
        ],
        score: 10,
      },
      {
        attempt_id: attempt19.attempt_id,
        question_id: engQ5.question_id,
        answer_text: 'went',
        score: 0, // Not graded yet
      },
    ]);

    // Student 10: Attempted Literature Exam (submitted, not graded)
    const attempt20 = await this.attemptRepository.save({
      exam_id: literatureExam.exam_id,
      user_id: student10.user_id,
      started_at: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      submitted_at: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000 + 165 * 60 * 1000,
      ), // 5 days from now + 165 min
      status: AttemptStatus.SUBMITTED,
      total_score: 0,
      cheated: false,
    });

    await this.answerRepository.save([
      {
        attempt_id: attempt20.attempt_id,
        question_id: litQ1.question_id,
        answer_text:
          'In "The Lord of the Rings," friendship is portrayed as a powerful force that can overcome evil. Tolkien develops this theme through the fellowship formed to destroy the Ring. Each member brings unique strengths, and their bond is tested throughout the journey. The friendship between Frodo and Sam exemplifies loyalty and selflessness, as Sam refuses to abandon Frodo even in the darkest moments. Tolkien shows that true friendship requires sacrifice, trust, and perseverance. The contrast between the fellowship\'s unity and Gollum\'s isolation highlights how friendship enriches life while its absence leads to corruption. Through various trials, the characters learn that together they can achieve what seems impossible alone.',
      },
      {
        attempt_id: attempt20.attempt_id,
        question_id: litQ2.question_id,
        answer_text:
          'Poetry and prose serve different literary purposes through distinct structural approaches. Poetry emphasizes condensed expression, using line breaks, meter, and often rhyme to create rhythmic patterns. It allows for ambiguity and multiple interpretations, with each word carrying significant weight. Prose follows conventional grammar and sentence structure, providing more space for detailed narrative development. While poetry captures intense emotions and moments, prose excels at complex storytelling with elaborate character development. Poetry might evoke a feeling in a few lines that prose would need paragraphs to achieve. However, both forms share the fundamental goal of artistic expression and communication.',
      },
      {
        attempt_id: attempt20.attempt_id,
        question_id: litQ3.question_id,
        answer_text:
          'Setting is fundamental to storytelling as it creates context, atmosphere, and influences character behavior. In "1984," Orwell\'s dystopian London reflects totalitarian oppression. The dark, decaying urban landscape mirrors the characters\' hopelessness. In "Pride and Prejudice," English country estates represent social class and propriety. Settings can symbolize themes, as the island in "Lord of the Flies" represents both paradise lost and human nature\'s darkness.',
      },
    ]);

    this.logger.log('Attempts and answers created');

    const summary = {
      users: {
        admin: 1,
        students: 10,
      },
      exams: {
        standard: 6, // Math, English, Science, Literature, Critical Thinking, History
        coding: 2,
        total: 8,
      },
      questions: {
        single_choice: 9, // Math(2), English(2), Science(3), added from originals
        multiple_choice: 5, // Math(2), English(1), Science(1), added from originals
        short_answer: 4, // Math(2), English(1), Science(1)
        essay: 10, // English(1), Literature(3), Critical Thinking(3), History(3)
        coding: 4,
        total: 32,
      },
      attempts: 20,
      answers: 95, // Approximate count based on all the answers created
    };

    this.logger.log('Database seeded successfully');
    return {
      message: 'Database seeded successfully',
      data: summary,
    };
  }

  /**
   * Reset database (clear + seed)
   */
  async resetDatabase(): Promise<{ message: string; data: any }> {
    await this.clearDatabase();
    return await this.seedDatabase();
  }
}
