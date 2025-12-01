import { ApiProperty } from '@nestjs/swagger';
import { AttemptStatus } from '../../../common/enum';

export class ExamAttemptsPageItemDto {
  @ApiProperty({
    description: 'Attempt unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  attempt_id: string;

  @ApiProperty({
    description: 'Student information',
    type: 'object',
    properties: {
      user_id: { type: 'string' },
      full_name: { type: 'string' },
      email: { type: 'string' },
    },
  })
  student: {
    user_id: string;
    full_name?: string;
    email?: string;
  };

  @ApiProperty({
    description: 'Submission timestamp',
    example: '2025-11-28T10:00:00Z',
    required: false,
  })
  submitted_at?: string;

  @ApiProperty({
    description: 'Score as a percentage',
    example: 85.5,
    required: false,
  })
  percentage_score?: number;

  @ApiProperty({
    description: 'Total score achieved',
    example: 42.5,
    required: false,
  })
  total_score?: number;

  @ApiProperty({
    description: 'Whether cheating was detected',
    example: false,
  })
  cheated: boolean;

  @ApiProperty({
    description: 'Attempt status',
    enum: AttemptStatus,
    example: AttemptStatus.GRADED,
  })
  status: AttemptStatus;
}

export class ExamAttemptsPageDto {
  @ApiProperty({
    description: 'Exam unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  exam_id: string;

  @ApiProperty({
    description: 'Exam title',
    example: 'Midterm Examination - Biology 101',
  })
  title: string;

  @ApiProperty({
    description: 'Exam description',
    example: 'This exam covers chapters 1-5',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Maximum possible score for the exam',
    example: 100,
  })
  max_score: number;

  @ApiProperty({
    description: 'Total number of attempts',
    example: 25,
  })
  total_attempts: number;

  @ApiProperty({
    description: 'Number of graded attempts',
    example: 20,
  })
  graded_attempts: number;

  @ApiProperty({
    description: 'Number of attempts with cheating flags',
    example: 3,
  })
  flagged_attempts: number;

  @ApiProperty({
    description: 'List of all attempts for the exam',
    type: [ExamAttemptsPageItemDto],
  })
  attempts: ExamAttemptsPageItemDto[];
}
