import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { SubmissionStatus } from '../../../common/enum';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Exam ID' })
  @IsUUID()
  exam_id: string;

  @ApiProperty({ description: 'User ID who submitted' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Total score', default: 0, required: false })
  @IsNumber()
  @IsOptional()
  total_score?: number;

  @ApiProperty({ description: 'Whether cheating was detected', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  cheated?: boolean;

  @ApiProperty({ description: 'Submission status', enum: SubmissionStatus, default: 'submitted', required: false })
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;
}
