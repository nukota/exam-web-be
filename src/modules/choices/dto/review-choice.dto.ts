import { ApiProperty } from '@nestjs/swagger';
import { Choice } from '../entities/choice.entity';

export class ReviewChoiceDto extends Choice {
  @ApiProperty({
    description: 'Whether this choice is correct',
    example: true,
  })
  is_correct: boolean;

  @ApiProperty({
    description: 'Whether the student chose this choice',
    example: false,
  })
  is_chosen: boolean;
}
