import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamDto } from './create-exam.dto';
import { QuestionInput } from '../../questions/types/question-input.interface';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @ApiProperty({
    description: 'Array of questions to update/create for this exam',
    required: false,
    type: 'array',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  questions?: QuestionInput[];
}
