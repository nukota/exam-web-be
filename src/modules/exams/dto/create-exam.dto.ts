import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsInt, IsUUID } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ description: 'Teacher ID who created the exam' })
  @IsUUID()
  teacher_id: string;

  @ApiProperty({ description: 'Exam title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Exam description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Exam type', 
    enum: ['essay', 'multiple_choice', 'coding'] 
  })
  @IsEnum(['essay', 'multiple_choice', 'coding'])
  type: string;

  @ApiProperty({ description: 'Access code for students' })
  @IsString()
  access_code: string;

  @ApiProperty({ description: 'Exam start time', required: false })
  @IsDateString()
  @IsOptional()
  start_at?: string;

  @ApiProperty({ description: 'Exam end time', required: false })
  @IsDateString()
  @IsOptional()
  end_at?: string;

  @ApiProperty({ description: 'Exam duration in minutes', required: false })
  @IsInt()
  @IsOptional()
  duration_minutes?: number;
}
