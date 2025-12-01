import { ApiProperty } from '@nestjs/swagger';

export class DashboardDto {
  @ApiProperty({
    description: 'Total number of exams',
    example: 15,
  })
  total_exams: number;

  @ApiProperty({
    description: 'Total number of students',
    example: 120,
  })
  total_students: number;

  @ApiProperty({
    description: 'Number of submissions pending grading',
    example: 8,
  })
  pending_grading: number;

  @ApiProperty({
    description: 'Average score across all exams',
    example: '78.5',
  })
  avg_score: string;

  @ApiProperty({
    description: 'Latest 30 days exam scores with 3-day intervals',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        avg_score: { type: 'number' },
      },
    },
  })
  exam_scores_data: {
    date?: string;
    avg_score?: number;
  }[];

  @ApiProperty({
    description: 'Exam type distribution data',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        value: { type: 'number' },
      },
    },
  })
  exam_type_data: {
    name?: string;
    value?: number;
  }[];

  @ApiProperty({
    description: 'Top exams by submission count',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        exam: { type: 'string' },
        submissions: { type: 'number' },
      },
    },
  })
  top_exams_data: {
    exam?: string;
    submissions?: number;
  }[];

  @ApiProperty({
    description: 'Latest 30 days student activity with 3-day intervals',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        students: { type: 'number' },
      },
    },
  })
  student_activity_data: {
    date?: string;
    students?: number;
  }[];
}
