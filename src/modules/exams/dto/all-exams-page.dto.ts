import { ApiProperty } from '@nestjs/swagger';
import { ExamType } from '../../../common/enum';

export type ExamStatus =
  | 'not started'
  | 'started'
  | 'ended'
  | 'graded'
  | 'released'
  | 'submitted';

export class AllExamsPageItemDto {
  @ApiProperty({ description: 'Exam unique identifier' })
  exam_id: string;

  @ApiProperty({ description: 'Teacher ID who created the exam' })
  teacher_id: string;

  @ApiProperty({ description: 'Exam title' })
  title: string;

  @ApiProperty({ description: 'Exam description', required: false })
  description?: string;

  @ApiProperty({ description: 'Exam type', enum: ExamType })
  type: ExamType;

  @ApiProperty({ description: 'Access code for students' })
  access_code: string;

  @ApiProperty({ description: 'Exam start time', required: false })
  start_at?: string;

  @ApiProperty({ description: 'Exam end time' })
  end_at: string;

  @ApiProperty({ description: 'Exam creation timestamp' })
  created_at: string;

  @ApiProperty({ description: 'Exam duration in minutes', required: false })
  duration_minutes?: number;

  @ApiProperty({
    description: 'Whether results have been released to students',
    required: false,
  })
  results_released?: boolean;

  @ApiProperty({ description: 'Number of questions in the exam' })
  question_amount: number;

  @ApiProperty({
    description: 'Current status of the exam',
    enum: [
      'not started',
      'started',
      'ended',
      'graded',
      'released',
      'submitted',
    ],
  })
  status: ExamStatus;
}

export type AllExamsPageDto = AllExamsPageItemDto[];
