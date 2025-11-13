import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateChoiceDto {
  @ApiProperty({ description: 'Question ID this choice belongs to' })
  @IsUUID()
  question_id: string;

  @ApiProperty({ description: 'Choice text', required: false })
  @IsString()
  @IsOptional()
  choice_text?: string;

  @ApiProperty({ description: 'Whether this choice is correct', default: false })
  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;
}
