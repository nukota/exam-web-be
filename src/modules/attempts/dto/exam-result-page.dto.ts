import { ApiProperty } from '@nestjs/swagger';
import { AttemptStatus } from '../../../common/enum';

export class LeaderboardItemDto {
  @ApiProperty({
    description: 'Rank position on the leaderboard',
    example: 1,
  })
  rank: number;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Student score',
    example: 95.5,
    required: false,
  })
  score?: number;

  @ApiProperty({
    description: 'Submission timestamp',
    example: '2025-11-28T10:00:00Z',
    required: false,
  })
  submitted_at?: string;
}

export class MyResultsPageItemDto {
  @ApiProperty({
    description: 'Attempt unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  attempt_id: string;

  @ApiProperty({
    description: 'Exam information',
    type: 'object',
    properties: {
      exam_id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string', nullable: true },
      max_score: { type: 'number' },
    },
  })
  exam: {
    exam_id: string;
    title: string;
    description?: string;
    max_score: number;
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

export class ExamResultPageDto extends MyResultsPageItemDto {
  @ApiProperty({
    description: "Current student's rank on the leaderboard",
    example: 5,
    required: false,
  })
  rank?: number;

  @ApiProperty({
    description: 'Total number of participants who submitted',
    example: 25,
    required: false,
  })
  total_participants?: number;

  @ApiProperty({
    description: 'Leaderboard with top students',
    type: [LeaderboardItemDto],
  })
  leaderboard: LeaderboardItemDto[];
}
