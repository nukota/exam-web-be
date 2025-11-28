import { ApiProperty } from '@nestjs/swagger';
import { CreateExamDto } from './create-exam.dto';
import { QuestionDTO } from '../../questions/types/question.interface';

export class DetailedExamDto extends CreateExamDto {
  @ApiProperty({
    description: 'Exam unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  exam_id: string;

  @ApiProperty({
    description: 'Teacher ID who created the exam',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  teacher_id: string;

  @ApiProperty({
    description: 'Access code for students',
    example: 'ABC123',
  })
  access_code: string;

  @ApiProperty({
    description: 'Exam creation timestamp',
    example: '2025-11-28T10:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Whether results have been released to students',
    example: false,
  })
  results_released: boolean;

  @ApiProperty({
    type: () => [QuestionDTO],
    description: 'List of questions in the exam',
  })
  questions: QuestionDTO[];
}
