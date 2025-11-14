import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Submission } from '../../submissions/entities/submission.entity';
import { Question } from '../../questions/entities/question.entity';
import { User } from '../../users/entities/user.entity';

@Entity('answers')
export class Answer {
  @ApiProperty({ description: 'Answer unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  answer_id: string;

  @ApiProperty({ description: 'Submission ID' })
  @Column({ type: 'uuid' })
  submission_id: string;

  @ApiProperty({ description: 'Question ID' })
  @Column({ type: 'uuid' })
  question_id: string;

  @ApiProperty({ description: 'Answer text (for essay, short answer, or code)', required: false })
  @Column({ type: 'text', nullable: true })
  answer_text?: string;

  @ApiProperty({ description: 'Selected choice IDs (for multiple choice)', required: false, type: [String] })
  @Column({ type: 'uuid', array: true, nullable: true })
  selected_choices?: string[];

  @ApiProperty({ description: 'Score (null until graded)', required: false })
  @Column({ type: 'float', nullable: true })
  score?: number;

  @ApiProperty({ description: 'Teacher ID who graded', required: false })
  @Column({ type: 'uuid', nullable: true })
  graded_by?: string;

  @ApiProperty({ description: 'Grading timestamp', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  graded_at?: Date;

  @ManyToOne(() => Submission, submission => submission.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @ManyToOne(() => Question, question => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'graded_by' })
  grader: User;
}
