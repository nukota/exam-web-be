import { ApiProperty } from '@nestjs/swagger';
import { QuestionType, ProgrammingLanguage } from '../../../common/enum';
import { ReviewChoiceDto } from '../../choices/dto/review-choice.dto';

export class ReviewQuestionDto {
  @ApiProperty({
    description: 'Question unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  question_id: string;

  @ApiProperty({
    description: 'Exam ID this question belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  exam_id: string;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the powerhouse of the cell?',
  })
  question_text: string;

  @ApiProperty({
    description: 'Question title',
    required: false,
    example: 'Cell Biology',
  })
  title?: string;

  @ApiProperty({
    description: 'Order of question in exam',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Question type',
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
  })
  question_type: QuestionType;

  @ApiProperty({
    description: 'Points for this question',
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: 'Correct answer UUIDs (for choice questions)',
    required: false,
    type: [String],
  })
  correct_answer?: string[];

  @ApiProperty({
    description: 'Correct answer texts (for short_answer questions)',
    required: false,
    type: [String],
  })
  correct_answer_text?: string[];

  @ApiProperty({
    description: 'Coding templates by programming language',
    required: false,
  })
  coding_template?: Record<string, string>;

  @ApiProperty({
    description: 'Programming languages allowed',
    required: false,
    type: [String],
    enum: ProgrammingLanguage,
  })
  programming_languages?: ProgrammingLanguage[];

  @ApiProperty({
    description: "Student's answer text",
    required: false,
    example: 'The mitochondria is responsible for energy production',
  })
  answer_text?: string;

  @ApiProperty({
    description: "Student's selected choice IDs",
    required: false,
    type: [String],
  })
  selected_choices?: string[];

  @ApiProperty({
    description: 'Programming language used for coding answer',
    required: false,
    enum: ProgrammingLanguage,
    example: 'python',
  })
  programming_language?: ProgrammingLanguage;

  @ApiProperty({
    description: 'Score awarded for this question',
    required: false,
    example: 8.5,
  })
  score?: number;

  @ApiProperty({
    description: 'List of choices with correctness indicator',
    type: [ReviewChoiceDto],
    required: false,
  })
  choices?: ReviewChoiceDto[];

  @ApiProperty({
    description: 'Whether the student flagged this question',
    required: false,
    example: false,
  })
  is_flagged?: boolean;

  @ApiProperty({
    description: 'Whether the student answered correctly',
    required: false,
    example: true,
  })
  answered_correctly?: boolean;
}
