import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateFlagDto {
  @ApiProperty({ description: 'User ID who flagged' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Question ID that was flagged' })
  @IsUUID()
  question_id: string;

  @ApiProperty({ description: 'Submission ID' })
  @IsUUID()
  submission_id: string;

  @ApiProperty({ description: 'Optional note about why the question was flagged', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
