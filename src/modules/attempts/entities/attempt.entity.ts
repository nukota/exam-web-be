import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttemptStatus } from '../../../common/enum';
import { Exam } from '../../exams/entities/exam.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { Flag } from '../../flags/entities/flag.entity';

@Entity('attempts')
export class Attempt {
  @ApiProperty({ description: 'Attempt unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  attempt_id: string;

  @ApiProperty({ description: 'Exam ID' })
  @Column({ type: 'uuid' })
  exam_id: string;

  @ApiProperty({ description: 'User ID who is taking the exam' })
  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ description: 'Attempt started timestamp', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  started_at?: Date;

  @ApiProperty({ description: 'Attempt submitted timestamp', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  submitted_at?: Date;

  @ApiProperty({ description: 'Attempt creation timestamp' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ApiProperty({ description: 'Total score', default: 0 })
  @Column({ type: 'float', default: 0, nullable: true })
  total_score?: number;

  @ApiProperty({ description: 'Whether cheating was detected', default: false })
  @Column({ type: 'boolean', default: false })
  cheated: boolean;

  @ApiProperty({
    description: 'Attempt status',
    enum: AttemptStatus,
    default: 'not_started',
  })
  @Column({
    type: 'enum',
    enum: AttemptStatus,
    default: AttemptStatus.NOT_STARTED,
  })
  status: AttemptStatus;

  @ManyToOne(() => Exam, (exam) => exam.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => User, (user) => user.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Answer, (answer) => answer.attempt)
  answers: Answer[];
}
