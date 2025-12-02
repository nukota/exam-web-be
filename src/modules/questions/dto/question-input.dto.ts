import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChoiceInputDto } from '../../choices/dto/choice-input.dto';
import { CodingTestCaseInputDto } from '../../coding-test-cases/dto/coding-test-case-input.dto';

export class QuestionInputDto {
  @ApiProperty({
    description: 'Question ID (null for new questions)',
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptional()
  @IsString()
  question_id?: string | null;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the powerhouse of the cell?',
  })
  @IsString()
  question_text: string;

  @ApiProperty({
    description: 'Question title',
    required: false,
    example: 'Cell Biology Question',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Order of question in exam',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Question type',
    example: 'single_choice',
  })
  @IsString()
  question_type: string;

  @ApiProperty({
    description: 'Points for this question',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiProperty({
    description: 'Correct answer UUIDs (for choice questions)',
    required: false,
    type: [String],
    example: ['temp_choice_001'],
  })
  @IsOptional()
  @IsArray()
  correct_answer?: string[];

  @ApiProperty({
    description: 'Correct answer texts (for short_answer questions)',
    required: false,
    type: [String],
    example: ['dog', 'canine'],
  })
  @IsOptional()
  @IsArray()
  correct_answer_text?: string[];

  @ApiProperty({
    description: 'Coding templates by programming language',
    required: false,
    example: {
      python: 'def solution():\n    pass',
      javascript: 'function solution() {\n    // Your code here\n}',
    },
  })
  @IsOptional()
  coding_template?: Record<string, string>;

  @ApiProperty({
    description: 'Programming languages allowed for coding questions',
    required: false,
    type: [String],
    example: ['python', 'javascript', 'c++'],
  })
  @IsOptional()
  @IsArray()
  programming_languages?: string[];

  @ApiProperty({
    description: 'Choices for this question',
    required: false,
    type: () => [ChoiceInputDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceInputDto)
  choices?: ChoiceInputDto[];

  @ApiProperty({
    description: 'Coding test cases for this question',
    required: false,
    type: () => [CodingTestCaseInputDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CodingTestCaseInputDto)
  coding_test_cases?: CodingTestCaseInputDto[];
}
