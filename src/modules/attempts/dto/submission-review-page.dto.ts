import { ApiProperty } from '@nestjs/swagger';
import { ReviewQuestionDto } from '../../questions/dto/review-question.dto';
import { ReviewChoiceDto } from '../../choices/dto/review-choice.dto';

export class SubmissionReviewPageDTO {
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
    description: 'Exam information',
    type: 'object',
    properties: {
      exam_id: { type: 'string' },
      title: { type: 'string' },
      max_score: { type: 'number' },
    },
  })
  exam: {
    exam_id: string;
    title: string;
    max_score: number;
  };

  @ApiProperty({
    description: 'Total score achieved',
    required: false,
    example: 85.5,
  })
  total_score?: number;

  @ApiProperty({
    description: 'Whether cheating was detected',
    example: false,
  })
  cheated: boolean;

  @ApiProperty({
    description: 'Submission timestamp',
    required: false,
    example: '2025-11-28T10:00:00Z',
  })
  submitted_at?: string;

  @ApiProperty({
    description: 'List of questions with answers and review information',
    type: [ReviewQuestionDto],
  })
  questions: ReviewQuestionDto[];
}
