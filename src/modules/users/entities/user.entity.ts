import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exam } from '../../exams/entities/exam.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Flag } from '../../flags/entities/flag.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string;

  @ApiProperty({
    description: 'User role',
    enum: ['student', 'teacher', 'admin'],
    example: 'student',
  })
  @Column({ type: 'varchar', length: 50 })
  role: string;

  @ApiProperty({
    description: 'Date of birth (student only)',
    example: '2000-01-01',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @ApiProperty({
    description: 'Class name (student only)',
    example: 'Class 10A',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  class_name?: string;

  @ApiProperty({
    description: 'School name',
    example: 'Springfield High School',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  school_name?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @OneToMany(() => Exam, exam => exam.teacher)
  exams: Exam[];

  @OneToMany(() => Submission, submission => submission.user)
  submissions: Submission[];

  @OneToMany(() => Flag, flag => flag.user)
  flags: Flag[];
}
