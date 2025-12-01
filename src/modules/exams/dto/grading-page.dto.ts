import { ApiProperty } from '@nestjs/swagger';

export class GradingPageItemDto {
  @ApiProperty({
    description: 'Exam unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  exam_id: string;

  @ApiProperty({
    description: 'Exam title',
    example: 'Midterm Examination',
  })
  title: string;

  @ApiProperty({
    description: 'Exam description',
    required: false,
    example: 'Midterm exam covering chapters 1-5',
  })
  description?: string;

  @ApiProperty({
    description: 'Exam end time',
    example: '2025-12-31T23:59:59Z',
  })
  end_at: string;

  @ApiProperty({
    description: 'Total number of submissions',
    example: 25,
  })
  total_submissions: number;

  @ApiProperty({
    description: 'Number of submissions pending grading',
    example: 5,
  })
  pending_submissions: number;

  @ApiProperty({
    description: 'Teacher information',
    type: 'object',
    properties: {
      teacher_id: { type: 'string' },
      full_name: { type: 'string' },
      email: { type: 'string' },
    },
  })
  teacher: {
    teacher_id: string;
    full_name?: string;
    email?: string;
  };
}

export type GradingPageDto = GradingPageItemDto[];
