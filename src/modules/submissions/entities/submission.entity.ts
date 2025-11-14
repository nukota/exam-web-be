import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '../../../common/enum';
import { Exam } from '../../exams/entities/exam.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { Flag } from '../../flags/entities/flag.entity';

@Entity('submissions')
export class Submission {
  @ApiProperty({ description: 'Submission unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  submission_id: string;

  @ApiProperty({ description: 'Exam ID' })
  @Column({ type: 'uuid' })
  exam_id: string;

  @ApiProperty({ description: 'User ID who submitted' })
  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ description: 'Submission timestamp' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  submitted_at: Date;

  @ApiProperty({ description: 'Total score', default: 0 })
  @Column({ type: 'float', default: 0 })
  total_score: number;

  @ApiProperty({ description: 'Whether cheating was detected', default: false })
  @Column({ type: 'boolean', default: false })
  cheated: boolean;

  @ApiProperty({ description: 'Submission status', enum: SubmissionStatus, default: 'submitted' })
  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.SUBMITTED })
  status: SubmissionStatus;

  @ManyToOne(() => Exam, exam => exam.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => User, user => user.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Answer, answer => answer.submission)
  answers: Answer[];

  @OneToMany(() => Flag, flag => flag.submission)
  flags: Flag[];
}
