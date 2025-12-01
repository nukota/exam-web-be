import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsUUID,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class QuestionGrade {
  @ApiProperty({
    description: 'Question unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  question_id: string;

  @ApiProperty({
    description: 'Score awarded for the question',
    example: 8.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  score: number;
}

export class GradeEssayDto {
  @ApiProperty({
    description: 'Array of question grades',
    type: [QuestionGrade],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionGrade)
  question_grades: QuestionGrade[];
}
