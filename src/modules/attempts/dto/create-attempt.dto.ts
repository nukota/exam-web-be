import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AttemptStatus } from '../../../common/enum';

export class CreateAttemptDto {
  @ApiProperty({
    description: 'Exam ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  exam_id: string;

  @ApiProperty({
    description: 'User ID who is taking the exam',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Attempt status',
    enum: AttemptStatus,
    example: AttemptStatus.NOT_STARTED,
    default: 'not_started',
    required: false,
  })
  @IsEnum(AttemptStatus)
  @IsOptional()
  status?: AttemptStatus;
}
