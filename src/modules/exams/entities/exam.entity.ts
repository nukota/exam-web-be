import { ApiProperty } from '@nestjs/swagger';

export class Exam {
  @ApiProperty({ description: 'Exam unique identifier' })
  exam_id: string;

  @ApiProperty({ description: 'Teacher ID who created the exam' })
  teacher_id: string;

  @ApiProperty({ description: 'Exam title', required: false })
  title?: string;

  @ApiProperty({ description: 'Exam description', required: false })
  description?: string;

  @ApiProperty({ 
    description: 'Exam type', 
    enum: ['essay', 'multiple_choice', 'coding'] 
  })
  type: string;

  @ApiProperty({ description: 'Access code for students' })
  access_code: string;

  @ApiProperty({ description: 'Exam start time', required: false })
  start_at?: Date;

  @ApiProperty({ description: 'Exam end time', required: false })
  end_at?: Date;

  @ApiProperty({ description: 'Exam creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Exam duration in minutes', required: false })
  duration_minutes?: number;
}
