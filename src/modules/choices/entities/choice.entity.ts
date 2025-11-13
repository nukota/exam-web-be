import { ApiProperty } from '@nestjs/swagger';

export class Choice {
  @ApiProperty({ description: 'Choice unique identifier' })
  choice_id: string;

  @ApiProperty({ description: 'Question ID this choice belongs to' })
  question_id: string;

  @ApiProperty({ description: 'Choice text', required: false })
  choice_text?: string;

  @ApiProperty({ description: 'Whether this choice is correct', default: false })
  is_correct: boolean;
}
