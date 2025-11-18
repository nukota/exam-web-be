import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Attempt } from '../../attempts/entities/attempt.entity';

@Entity('flags')
export class Flag {
  @ApiProperty({ description: 'Flag unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  flag_id: string;

  @ApiProperty({ description: 'User ID who flagged' })
  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ description: 'Question ID that was flagged' })
  @Column({ type: 'uuid' })
  question_id: string;

  @ApiProperty({ description: 'Attempt ID' })
  @Column({ type: 'uuid' })
  attempt_id: string;

  @ApiProperty({ description: 'When the question was flagged' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  flagged_at: Date;

  @ApiProperty({
    description: 'Optional note about why the question was flagged',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ManyToOne(() => User, (user) => user.flags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Question, (question) => question.flags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Attempt, (attempt) => attempt.flags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attempt_id' })
  attempt: Attempt;
}
