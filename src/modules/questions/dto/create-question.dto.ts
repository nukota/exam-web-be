import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsUUID,
} from 'class-validator';
import { QuestionType, ProgrammingLanguage } from '../../../common/enum';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Exam ID this question belongs to' })
  @IsUUID()
  exam_id: string;

  @ApiProperty({ description: 'Question text', required: false })
  @IsString()
  @IsOptional()
  question_text?: string;

  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
  })
  @IsEnum(QuestionType)
  question_type: QuestionType;

  @ApiProperty({ description: 'Points for this question', default: 1 })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({
    description: 'Correct answer UUIDs (for choice questions)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  correct_answer?: string[];

  @ApiProperty({
    description: 'Correct answer text (for short_answer questions)',
    required: false,
  })
  @IsString()
  @IsOptional()
  correct_answer_text?: string;

  @ApiProperty({ description: 'Coding template', required: false })
  @IsString()
  @IsOptional()
  coding_template?: string;

  @ApiProperty({
    description: 'Programming languages allowed for coding questions',
    required: false,
    type: [String],
    enum: ProgrammingLanguage,
  })
  @IsArray()
  @IsEnum(ProgrammingLanguage, { each: true })
  @IsOptional()
  programming_languages?: ProgrammingLanguage[];

  @ApiProperty({ description: 'Image URL', required: false })
  @IsString()
  @IsOptional()
  image_url?: string;
}
