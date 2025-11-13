import { ApiProperty } from '@nestjs/swagger';

export class Answer {
  @ApiProperty({ description: 'Answer unique identifier' })
  answer_id: string;

  @ApiProperty({ description: 'Submission ID' })
  submission_id: string;

  @ApiProperty({ description: 'Question ID' })
  question_id: string;

  @ApiProperty({ description: 'Answer text (for essay, short answer, or code)', required: false })
  answer_text?: string;

  @ApiProperty({ description: 'Selected choice IDs (for multiple choice)', required: false, type: [String] })
  selected_choices?: string[];

  @ApiProperty({ description: 'Score (null until graded)', required: false })
  score?: number;

  @ApiProperty({ description: 'Teacher ID who graded', required: false })
  graded_by?: string;

  @ApiProperty({ description: 'Grading timestamp', required: false })
  graded_at?: Date;
}
