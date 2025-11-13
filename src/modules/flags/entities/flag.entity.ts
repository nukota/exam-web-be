import { ApiProperty } from '@nestjs/swagger';

export class Flag {
  @ApiProperty({ description: 'Flag unique identifier' })
  flag_id: string;

  @ApiProperty({ description: 'User ID who flagged' })
  user_id: string;

  @ApiProperty({ description: 'Question ID that was flagged' })
  question_id: string;

  @ApiProperty({ description: 'Submission ID' })
  submission_id: string;

  @ApiProperty({ description: 'When the question was flagged' })
  flagged_at: Date;

  @ApiProperty({ description: 'Optional note about why the question was flagged', required: false })
  note?: string;
}
