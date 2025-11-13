import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ description: 'Submission ID' })
  @IsUUID()
  submission_id: string;

  @ApiProperty({ description: 'Question ID' })
  @IsUUID()
  question_id: string;

  @ApiProperty({ description: 'Answer text', required: false })
  @IsString()
  @IsOptional()
  answer_text?: string;

  @ApiProperty({ description: 'Selected choice IDs', required: false, type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  selected_choices?: string[];

  @ApiProperty({ description: 'Score', required: false })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiProperty({ description: 'Teacher ID who graded', required: false })
  @IsUUID()
  @IsOptional()
  graded_by?: string;
}
