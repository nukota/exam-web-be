import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../questions/entities/question.entity';

@Entity('coding_test_cases')
export class CodingTestCase {
  @ApiProperty({ description: 'Test case unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  test_case_id: string;

  @ApiProperty({ description: 'Question ID this test case belongs to' })
  @Column({ type: 'uuid' })
  question_id: string;

  @ApiProperty({ description: 'Input data for test case', required: false })
  @Column({ type: 'text', nullable: true })
  input_data?: string;

  @ApiProperty({ description: 'Expected output', required: false })
  @Column({ type: 'text', nullable: true })
  expected_output?: string;

  @ApiProperty({ description: 'Whether this is a hidden test case', default: false })
  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;

  @ManyToOne(() => Question, question => question.codingTestCases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
