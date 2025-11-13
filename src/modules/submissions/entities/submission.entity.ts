import { ApiProperty } from '@nestjs/swagger';

export class Submission {
  @ApiProperty({ description: 'Submission unique identifier' })
  submission_id: string;

  @ApiProperty({ description: 'Exam ID' })
  exam_id: string;

  @ApiProperty({ description: 'User ID who submitted' })
  user_id: string;

  @ApiProperty({ description: 'Submission timestamp' })
  submitted_at: Date;

  @ApiProperty({ description: 'Total score', default: 0 })
  total_score: number;

  @ApiProperty({ description: 'Whether cheating was detected', default: false })
  cheated: boolean;

  @ApiProperty({ description: 'Submission status', enum: ['submitted', 'graded'], default: 'submitted' })
  status: string;
}
