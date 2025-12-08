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
      dob: new Date('2005-05-15'),
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
      dob: new Date('2005-06-20'),
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
      dob: new Date('2005-07-10'),
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
      dob: new Date('2005-08-25'),
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
      dob: new Date('2005-09-30'),
    });
    await this.userRepository.save([
      student1,
      student2,
      student3,
      student4,
      student5,
    ]);

    this.logger.log('5 student users created');

    // 3. Create Standard Exams with Questions

    // Exam 1: Mathematics Basics
    const mathExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Mathematics Fundamentals',
      description: 'Basic mathematics concepts and problem solving',
      type: ExamType.STANDARD,
      access_code: 'MATH101',
      start_at: new Date('2025-12-04T08:00:00'),
      end_at: new Date('2025-12-04T10:00:00'),
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

    // Exam 2: English Grammar
    const englishExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'English Grammar Test',
      description: 'Test your understanding of English grammar rules',
      type: ExamType.STANDARD,
      access_code: 'ENG201',
      start_at: new Date('2025-12-06T09:00:00'),
      end_at: new Date('2025-12-06T10:30:00'),
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

    await this.questionRepository.save({
      exam_id: englishExam.exam_id,
      question_type: QuestionType.ESSAY,
      question_text:
        'Write a short paragraph (100-150 words) describing your favorite hobby and why you enjoy it.',
      points: 20,
      order: 2,
    });

    // Exam 3: Science Quiz
    const scienceExam = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'General Science Knowledge',
      description: 'Test your knowledge of basic science concepts',
      type: ExamType.STANDARD,
      access_code: 'SCI101',
      start_at: new Date('2025-12-07T10:00:00'),
      end_at: new Date('2026-01-30T11:00:00'),
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

    // 4. Create Coding Exams

    // Coding Exam 1: Basic Programming
    const codingExam1 = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Introduction to Programming',
      description: 'Basic programming exercises for beginners',
      type: ExamType.CODING,
      access_code: 'CODE101',
      start_at: new Date('2025-12-08T14:00:00'),
      end_at: new Date('2025-12-20T16:00:00'),
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

    // Coding Exam 2: Algorithm Challenge
    const codingExam2 = await this.examRepository.save({
      teacher_id: admin.user_id,
      title: 'Algorithm and Data Structures',
      description: 'Intermediate level coding challenges',
      type: ExamType.CODING,
      access_code: 'ALGO202',
      start_at: new Date('2025-12-10T14:00:00'),
      end_at: new Date('2025-12-10T17:00:00'),
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

    this.logger.log('Exams and questions created');

    // 5. Create Attempts and Answers

    // Student 1: Attempted Math and English exams
    const attempt1 = await this.attemptRepository.save({
      exam_id: mathExam.exam_id,
      user_id: student1.user_id,
      started_at: new Date('2025-12-05T08:05:00'),
      submitted_at: new Date('2025-12-05T09:30:00'),
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
      started_at: new Date('2025-12-06T09:10:00'),
      submitted_at: new Date('2025-12-06T10:15:00'),
      status: AttemptStatus.SUBMITTED,
      total_score: 5, // Only choice graded, essay not graded
      cheated: false,
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
      started_at: new Date('2025-12-07T10:05:00'),
      status: AttemptStatus.IN_PROGRESS,
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
      started_at: new Date('2025-12-08T14:10:00'),
      submitted_at: new Date('2025-12-08T15:45:00'),
      status: AttemptStatus.GRADED,
      total_score: 25, // 15 + 10 (partial for sum)
      cheated: false,
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
      started_at: new Date('2025-12-05T08:00:00'),
      submitted_at: new Date('2025-12-05T09:45:00'),
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
      started_at: new Date('2025-12-10T14:00:00'),
      status: AttemptStatus.OVERDUE,
      cheated: false,
    });

    // No answers for overdue attempt

    // Student 4: Attempted English and Science
    const attempt7 = await this.attemptRepository.save({
      exam_id: englishExam.exam_id,
      user_id: student4.user_id,
      started_at: new Date('2025-12-06T09:00:00'),
      submitted_at: new Date('2025-12-06T10:20:00'),
      status: AttemptStatus.SUBMITTED,
      total_score: 5, // 5
      cheated: false,
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
      started_at: new Date('2025-12-07T10:00:00'),
      submitted_at: new Date('2025-12-07T10:50:00'),
      status: AttemptStatus.SUBMITTED,
      total_score: 10,
      cheated: false,
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

    this.logger.log('Attempts and answers created');

    const summary = {
      users: {
        admin: 1,
        students: 5,
      },
      exams: {
        standard: 3,
        coding: 2,
        total: 5,
      },
      questions: {
        single_choice: 3,
        multiple_choice: 3,
        short_answer: 1,
        essay: 1,
        coding: 4,
        total: 12,
      },
      attempts: 9,
      answers: 14,
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
