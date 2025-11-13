import { ApiProperty } from '@nestjs/swagger';

export class Question {
  @ApiProperty({ description: 'Question unique identifier' })
  question_id: string;

  @ApiProperty({ description: 'Exam ID this question belongs to' })
  exam_id: string;

  @ApiProperty({ description: 'Question text', required: false })
  question_text?: string;

  @ApiProperty({ 
    description: 'Question type', 
    enum: ['essay', 'single_choice', 'multiple_choice', 'short_answer', 'coding'] 
  })
  question_type: string;

  @ApiProperty({ description: 'Points for this question', default: 1 })
  points: number;

  @ApiProperty({ description: 'Correct answer UUIDs (for choice questions)', required: false, type: [String] })
  correct_answer?: string[];

  @ApiProperty({ description: 'Coding template', required: false })
  coding_template?: string;

  @ApiProperty({ description: 'Image URL', required: false })
  image_url?: string;
}
