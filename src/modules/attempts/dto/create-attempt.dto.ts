import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AttemptStatus } from '../../../common/enum';

export class CreateAttemptDto {
  @ApiProperty({ description: 'Exam ID' })
  @IsUUID()
  exam_id: string;

  @ApiProperty({ description: 'User ID who is taking the exam' })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Attempt status',
    enum: AttemptStatus,
    default: 'not_started',
    required: false,
  })
  @IsEnum(AttemptStatus)
  @IsOptional()
  status?: AttemptStatus;
}
