import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'Submission ID',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @IsUUID()
  submission_id: string;

  @ApiProperty({
    description: 'Question ID',
    example: '8d4f3289-1234-56ab-cdef-1234567890ab',
  })
  @IsUUID()
  question_id: string;

  @ApiProperty({
    description: 'Answer text for essay, short answer, or coding questions',
    example:
      'The photosynthesis process converts light energy into chemical energy.',
    required: false,
  })
  @IsString()
  @IsOptional()
  answer_text?: string;

  @ApiProperty({
    description: 'Selected choice IDs for single or multiple choice questions',
    example: [
      '9e5f4390-2345-67bc-def0-234567890abc',
      'af6g5401-3456-78cd-ef01-345678901bcd',
    ],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  selected_choices?: string[];

  @ApiProperty({
    description: 'Score assigned to the answer',
    example: 8.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiProperty({
    description: 'Teacher ID who graded this answer',
    example: 'b07h6512-4567-89de-f012-456789012cde',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  graded_by?: string;
}
