import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../questions/entities/question.entity';

@Entity('choices')
export class Choice {
  @ApiProperty({ description: 'Choice unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  choice_id: string;

  @ApiProperty({ description: 'Question ID this choice belongs to' })
  @Column({ type: 'uuid' })
  question_id: string;

  @ApiProperty({ description: 'Choice text', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  choice_text?: string;

  @ApiProperty({ description: 'Whether this choice is correct', default: false })
  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @ManyToOne(() => Question, question => question.choices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
