import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ExamType } from '../../../common/enum';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity('exams')
export class Exam {
  @ApiProperty({ description: 'Exam unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  exam_id: string;

  @ApiProperty({ description: 'Teacher ID who created the exam' })
  @Column({ type: 'uuid' })
  teacher_id: string;

  @ApiProperty({ description: 'Exam title', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @ApiProperty({ description: 'Exam description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ 
    description: 'Exam type', 
    enum: ExamType
  })
  @Column({ type: 'enum', enum: ExamType })
  type: ExamType;

  @ApiProperty({ description: 'Access code for students' })
  @Column({ type: 'varchar', length: 100, unique: true })
  access_code: string;

  @ApiProperty({ description: 'Exam start time', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  start_at?: Date;

  @ApiProperty({ description: 'Exam end time', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  end_at?: Date;

  @ApiProperty({ description: 'Exam creation timestamp' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'Exam duration in minutes', required: false })
  @Column({ type: 'integer', nullable: true })
  duration_minutes?: number;

  @ManyToOne(() => User, user => user.exams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Question, question => question.exam)
  questions: Question[];

  @OneToMany(() => Submission, submission => submission.exam)
  submissions: Submission[];
}
