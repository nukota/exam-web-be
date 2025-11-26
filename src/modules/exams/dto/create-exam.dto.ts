import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ExamType } from '../../../common/enum';

export class CreateExamDto {
  @ApiProperty({
    description: 'Exam title',
    example: 'Midterm Examination - Biology 101',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Exam description',
    example:
      'This exam covers chapters 1-5 of the Biology textbook including cell structure, photosynthesis, and cellular respiration.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Exam type',
    enum: ExamType,
    example: ExamType.STANDARD,
  })
  @IsEnum(ExamType)
  type: ExamType;

  @ApiProperty({
    description: 'Exam start time in ISO 8601 format',
    example: '2025-12-01T09:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_at?: string;

  @ApiProperty({
    description: 'Exam end time in ISO 8601 format',
    example: '2025-12-01T11:00:00Z',
  })
  @IsDateString()
  end_at: string;

  @ApiProperty({
    description: 'Exam duration in minutes',
    example: 90,
    required: false,
  })
  @IsInt()
  @IsOptional()
  duration_minutes?: number;
}
