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
  @ApiProperty({ description: 'Exam title', required: false })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Exam description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Exam type',
    enum: ExamType,
  })
  @IsEnum(ExamType)
  type: ExamType;

  @ApiProperty({ description: 'Exam start time', required: false })
  @IsDateString()
  @IsOptional()
  start_at?: string;

  @ApiProperty({ description: 'Exam end time' })
  @IsDateString()
  end_at: string;

  @ApiProperty({ description: 'Exam duration in minutes', required: false })
  @IsInt()
  @IsOptional()
  duration_minutes?: number;
}
