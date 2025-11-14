import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

  @ApiProperty({ description: 'Question text', required: false })
  @Column({ type: 'text', nullable: true })
  question_text?: string;

  @ApiProperty({ 
    description: 'Question type', 
    enum: QuestionType
  })
  @Column({ type: 'enum', enum: QuestionType })
  question_type: QuestionType;

  @ApiProperty({ description: 'Points for this question', default: 1 })
  @Column({ type: 'float', default: 1 })
  points: number;

  @ApiProperty({ description: 'Correct answer UUIDs (for choice questions)', required: false, type: [String] })
  @Column({ type: 'uuid', array: true, nullable: true })
  correct_answer?: string[];

  @ApiProperty({ description: 'Coding template', required: false })
  @Column({ type: 'varchar', length: 1000, nullable: true })
  coding_template?: string;

  @ApiProperty({ 
    description: 'Programming languages allowed for coding questions', 
    required: false, 
    type: [String],
    enum: ProgrammingLanguage
  })
  @Column({ 
    type: 'enum',
    enum: ProgrammingLanguage,
    array: true,
    nullable: true
  })
  programming_languages?: ProgrammingLanguage[];

  @ApiProperty({ description: 'Image URL', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url?: string;

  @ManyToOne(() => Exam, exam => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @OneToMany(() => Choice, choice => choice.question)
  choices: Choice[];

  @OneToMany(() => CodingTestCase, testCase => testCase.question)
  codingTestCases: CodingTestCase[];

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];

  @OneToMany(() => Flag, flag => flag.question)
  flags: Flag[];
}
