import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType, ProgrammingLanguage } from '../../../common/enum';
import { Exam } from '../../exams/entities/exam.entity';
import { Choice } from '../../choices/entities/choice.entity';
import { CodingTestCase } from '../../coding-test-cases/entities/coding-test-case.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { Flag } from '../../flags/entities/flag.entity';

@Entity('questions')
export class Question {
  @ApiProperty({ description: 'Question unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  question_id: string;

  @ApiProperty({ description: 'Exam ID this question belongs to' })
  @Column({ type: 'uuid' })
  exam_id: string;

  @ApiProperty({ description: 'Question text' })
  @Column({ type: 'text' })
  question_text: string;

  @ApiProperty({
    description: 'Question title (for coding questions)',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @ApiProperty({ description: 'Order of question in exam', default: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
  })
  @Column({ type: 'enum', enum: QuestionType })
  question_type: QuestionType;

  @ApiProperty({ description: 'Points for this question', default: 1 })
  @Column({ type: 'float', default: 1 })
  points: number;

  @ApiProperty({
    description: 'Correct answer UUIDs (for choice questions)',
    required: false,
    type: [String],
  })
  @Column({ type: 'uuid', array: true, nullable: true })
  correct_answer?: string[];

  @ApiProperty({
    description: 'Correct answer texts (for short_answer questions)',
    required: false,
    type: [String],
  })
  @Column({ type: 'text', array: true, nullable: true })
  correct_answer_text?: string[];

  @ApiProperty({
    description:
      'Coding templates mapped by programming language, e.g. {"python": "def solution():\\n    pass", "c++": "int main() {}" }',
    required: false,
    example: {
      python: 'def solution():\n    pass',
      'c++': 'int main() { return 0; }',
    },
  })
  @Column({ type: 'jsonb', nullable: true })
  coding_template?: Record<string, string>;

  @ApiProperty({
    description: 'Programming languages allowed for coding questions',
    required: false,
    type: [String],
    enum: ProgrammingLanguage,
  })
  @Column({
    type: 'enum',
    enum: ProgrammingLanguage,
    array: true,
    nullable: true,
  })
  programming_languages?: ProgrammingLanguage[];

  @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @OneToMany(() => Choice, (choice) => choice.question)
  choices: Choice[];

  @OneToMany(() => CodingTestCase, (testCase) => testCase.question)
  codingTestCases: CodingTestCase[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => Flag, (flag) => flag.question)
  flags: Flag[];
}
