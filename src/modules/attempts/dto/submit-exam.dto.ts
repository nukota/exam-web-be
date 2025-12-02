import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerSubmissionDto {
  @ApiProperty({
    description: 'Question unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  question_id: string;

  @ApiProperty({
    description: 'Answer text for essay, short answer, or coding questions',
    required: false,
    example: 'The mitochondria is the powerhouse of the cell',
  })
  @IsOptional()
  @IsString()
  answer_text?: string;

  @ApiProperty({
    description: 'Selected choice IDs for single/multiple choice questions',
    required: false,
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174001'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  selected_choices?: string[];

  @ApiProperty({
    description: 'Programming language used for coding questions',
    required: false,
    example: 'python',
  })
  @IsOptional()
  @IsString()
  programming_language?: string;
}

export class SubmitExamDto {
  @ApiProperty({
    description: 'Array of answer submissions',
    type: [AnswerSubmissionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmissionDto)
  answers: AnswerSubmissionDto[];

  @ApiProperty({
    description: 'Timestamp when the attempt was started',
    required: false,
    example: '2025-12-02T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  started_at?: string;

  @ApiProperty({
    description: 'Whether cheating was detected during the attempt',
    example: false,
  })
  @IsBoolean()
  cheated: boolean;
}
