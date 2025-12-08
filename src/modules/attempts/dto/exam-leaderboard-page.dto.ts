import { ApiProperty } from '@nestjs/swagger';

export class ExamLeaderboardItemDto {
  @ApiProperty({ description: 'Rank of the student in the leaderboard' })
  rank: number;

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
    description: 'Total score achieved',
    required: false,
  })
  score?: number;

  @ApiProperty({
    description: 'When the exam was submitted',
    required: false,
  })
  submitted_at?: string;

  @ApiProperty({ description: 'Attempt ID' })
  attempt_id: string;

  @ApiProperty({
    description: 'Attempt status',
    enum: [
      'not_started',
      'in_progress',
      'submitted',
      'overdue',
      'graded',
      'cancelled',
    ],
  })
  status: string;
}

export class ExamLeaderboardPageDto {
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
    description: 'Leaderboard items ordered by score',
    type: [ExamLeaderboardItemDto],
  })
  leaderboard: ExamLeaderboardItemDto[];
}
